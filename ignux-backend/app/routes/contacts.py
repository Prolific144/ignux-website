# app/routes/contacts.py
"""
Contact Management Routes

This module handles all contact-related operations including:
- Contact form submissions
- WhatsApp integration
- Quick quote requests
- Customer communications
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
import urllib.parse
import logging

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.core.config import settings
from app.core.email_service import email_service
from app.models import User, ContactMessage
from app.schemas import (
    ContactMessageCreate,
    ContactMessageResponse,
    ContactMessageUpdate,
    WhatsAppMessage,
    QuoteRequest,
    APIResponse
)
from app.crud import contact as contact_crud

router = APIRouter(prefix="/contacts", tags=["contacts"])

logger = logging.getLogger(__name__)


@router.post("/submit", response_model=ContactMessageResponse, status_code=status.HTTP_201_CREATED)
async def submit_contact_form(
    contact_data: ContactMessageCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> ContactMessageResponse:
    """
    Submit a contact form message.
    
    - Validates contact information
    - Stores message in database
    - Sends confirmation email to client
    - Sends notification to admin team
    
    Returns the created contact message with ID and timestamps.
    """
    try:
        # Create contact message
        contact_message = contact_crud.create_contact_message(db, contact_data)
        
        # Send confirmation email to client
        background_tasks.add_task(
            send_contact_confirmation_email,
            contact_message
        )
        
        # Send notification to admin team
        background_tasks.add_task(
            send_admin_contact_notification,
            contact_message
        )
        
        # Log submission
        logger.info(f"Contact form submitted: ID={contact_message.id}, Name={contact_message.name}, Email={contact_message.email}")
        
        return contact_message
        
    except Exception as e:
        logger.error(f"Failed to submit contact form: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit contact form: {str(e)}"
        )


@router.get("/", response_model=List[ContactMessageResponse])
async def get_contact_messages(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum records to return"),
    read_status: Optional[bool] = Query(None, description="Filter by read status"),
    responded_status: Optional[bool] = Query(None, description="Filter by responded status"),
    event_type: Optional[str] = Query(None, description="Filter by event type"),
    date_from: Optional[str] = Query(None, description="Filter by creation date from (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="Filter by creation date to (YYYY-MM-DD)"),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> List[ContactMessageResponse]:
    """
    Get contact messages with filtering options (admin only).
    
    - Supports pagination
    - Multiple filtering options
    - Returns messages sorted by creation date (newest first)
    """
    try:
        contact_messages = contact_crud.get_contact_messages(
            db=db,
            skip=skip,
            limit=limit,
            read_status=read_status,
            responded_status=responded_status,
            event_type=event_type,
            date_from=date_from,
            date_to=date_to
        )
        
        return contact_messages
        
    except Exception as e:
        logger.error(f"Failed to fetch contact messages: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch contact messages: {str(e)}"
        )


@router.get("/{message_id}", response_model=ContactMessageResponse)
async def get_contact_message(
    message_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> ContactMessageResponse:
    """
    Get a specific contact message by ID (admin only).
    """
    try:
        contact_message = contact_crud.get_contact_message(db, message_id)
        
        if not contact_message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contact message not found"
            )
        
        # Mark as read when accessed by admin
        if not contact_message.is_read:
            contact_message.is_read = True
            db.commit()
        
        return contact_message
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch contact message {message_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch contact message: {str(e)}"
        )


@router.patch("/{message_id}/read", response_model=ContactMessageResponse)
async def mark_as_read(
    message_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> ContactMessageResponse:
    """
    Mark a contact message as read (admin only).
    """
    try:
        contact_message = contact_crud.mark_as_read(db, message_id)
        
        if not contact_message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contact message not found"
            )
        
        logger.info(f"Contact message marked as read: ID={message_id}, By={current_user.email}")
        
        return contact_message
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to mark message as read {message_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark message as read: {str(e)}"
        )


@router.patch("/{message_id}/responded", response_model=ContactMessageResponse)
async def mark_as_responded(
    message_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> ContactMessageResponse:
    """
    Mark a contact message as responded (admin only).
    """
    try:
        contact_message = contact_crud.get_contact_message(db, message_id)
        
        if not contact_message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contact message not found"
            )
        
        contact_message.responded = True
        contact_message.is_read = True  # Also mark as read
        db.commit()
        db.refresh(contact_message)
        
        logger.info(f"Contact message marked as responded: ID={message_id}, By={current_user.email}")
        
        return contact_message
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to mark message as responded {message_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark message as responded: {str(e)}"
        )


@router.patch("/{message_id}", response_model=ContactMessageResponse)
async def update_contact_message(
    message_id: int,
    message_update: ContactMessageUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> ContactMessageResponse:
    """
    Update a contact message (admin only).
    
    Can update notes and status fields.
    """
    try:
        contact_message = contact_crud.update_contact_message(db, message_id, message_update)
        
        if not contact_message:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Contact message not found"
            )
        
        logger.info(f"Contact message updated: ID={message_id}, By={current_user.email}")
        
        return contact_message
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update contact message {message_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update contact message: {str(e)}"
        )


@router.post("/whatsapp/generate-link", response_model=APIResponse)
async def generate_whatsapp_link(
    whatsapp_data: WhatsAppMessage,
    current_user: Optional[User] = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Generate a WhatsApp link for direct messaging.
    
    - Validates phone number format
    - URL-encodes message
    - Supports message templates
    - Returns clickable WhatsApp link
    
    Can be used by both authenticated and anonymous users.
    """
    try:
        # Clean and validate phone number
        phone = whatsapp_data.phone.strip()
        
        # Remove any non-numeric characters except plus sign
        if not phone.startswith('+'):
            # Assume Kenyan number if no country code
            if phone.startswith('0'):
                phone = '+254' + phone[1:]
            else:
                phone = '+254' + phone
        
        # Validate phone number length
        if len(phone) < 10 or len(phone) > 15:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid phone number length"
            )
        
        # Get message
        message = whatsapp_data.message.strip()
        
        # Use template if specified
        if whatsapp_data.template:
            templates = {
                "wedding": "Hello IGNUX! I'm interested in wedding fireworks services for my special day.",
                "corporate": "Hello IGNUX! I need professional fireworks for a corporate event.",
                "festival": "Hello IGNUX! I'm organizing a festival and need spectacular fireworks.",
                "private": "Hello IGNUX! I'd like fireworks for a private celebration.",
                "quote": "Hello IGNUX! Can I get a detailed quote for fireworks services?",
                "consultation": "Hello IGNUX! I'd like to schedule a consultation about fireworks.",
                "emergency": "Hello IGNUX! I need urgent fireworks services. Please contact me ASAP."
            }
            message = templates.get(whatsapp_data.template, message)
        
        # URL encode the message
        encoded_message = urllib.parse.quote(message)
        
        # Create WhatsApp link
        whatsapp_url = f"https://wa.me/{phone}?text={encoded_message}"
        
        # Log generation (without sensitive data)
        logger.info(f"WhatsApp link generated for template: {whatsapp_data.template or 'custom'}")
        
        return APIResponse(
            success=True,
            message="WhatsApp link generated successfully",
            data={
                "whatsapp_url": whatsapp_url,
                "phone": phone,
                "message_preview": message[:100] + ("..." if len(message) > 100 else ""),
                "template_used": whatsapp_data.template
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to generate WhatsApp link: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate WhatsApp link: {str(e)}"
        )


@router.post("/quick-quote", response_model=APIResponse)
async def request_quick_quote(
    quote_request: QuoteRequest,
    background_tasks: BackgroundTasks,
    current_user: Optional[User] = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Submit a quick quote request.
    
    - Validates required fields
    - Sends email to sales team
    - Sends confirmation to requester
    - Can be used by both authenticated and anonymous users
    
    Returns immediate confirmation with estimated response time.
    """
    try:
        # Validate quote request data
        if not quote_request.service_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Service type is required"
            )
        
        if not quote_request.location:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Location is required"
            )
        
        # Send quote request to admin
        background_tasks.add_task(
            send_quote_request_to_admin,
            quote_request,
            current_user.email if current_user else None
        )
        
        # Send confirmation to requester
        background_tasks.add_task(
            send_quote_confirmation_email,
            quote_request
        )
        
        # Log quote request
        logger.info(f"Quick quote requested: Service={quote_request.service_type}, Email={quote_request.contact_email}")
        
        return APIResponse(
            success=True,
            message="Quote request submitted successfully. Our sales team will contact you within 24 hours.",
            data={
                "reference": f"QR-{int(datetime.now().timestamp())}",
                "service_type": quote_request.service_type,
                "contact_email": quote_request.contact_email,
                "estimated_response": "24 hours"
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to submit quote request: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit quote request: {str(e)}"
        )


@router.get("/stats", response_model=Dict[str, Any])
async def get_contact_stats(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get contact message statistics (admin only).
    
    - Total messages
    - Unread messages
    - Pending responses
    - Messages by event type
    - Recent activity
    """
    try:
        stats = contact_crud.get_contact_stats(db)
        
        return {
            "success": True,
            "message": "Contact statistics retrieved successfully",
            "data": stats
        }
        
    except Exception as e:
        logger.error(f"Failed to fetch contact stats: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch contact stats: {str(e)}"
        )


@router.post("/bulk-action", response_model=APIResponse)
async def bulk_action_on_messages(
    message_ids: List[int],
    action: str = Query(..., regex="^(read|unread|responded|delete)$"),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Perform bulk actions on contact messages (admin only).
    
    - Mark multiple messages as read/unread
    - Mark as responded
    - Delete multiple messages
    """
    try:
        if not message_ids:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No message IDs provided"
            )
        
        result = contact_crud.bulk_action(db, message_ids, action)
        
        logger.info(f"Bulk action performed: Action={action}, Count={len(message_ids)}, By={current_user.email}")
        
        return APIResponse(
            success=True,
            message=f"Bulk action '{action}' completed successfully",
            data={
                "action": action,
                "processed_count": result.get("processed", 0),
                "failed_count": result.get("failed", 0)
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to perform bulk action: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to perform bulk action: {str(e)}"
        )


# Email helper functions
async def send_contact_confirmation_email(contact_message: ContactMessage) -> None:
    """Send confirmation email to contact form submitter."""
    subject = "🎆 Thank You for Contacting IGNUX!"
    
    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #FF6B00 0%, #FFD700 100%); 
                       color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1>🎆 Thank You for Contacting IGNUX!</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px;">
                <p>Dear {contact_message.name},</p>
                <p>We've received your inquiry about our {contact_message.event_type} services and will get back to you within 24 hours.</p>
                
                <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h3>📝 Your Inquiry Summary:</h3>
                    <p><strong>Inquiry ID:</strong> #{contact_message.id}</p>
                    <p><strong>Event Type:</strong> {contact_message.event_type}</p>
                    <p><strong>Event Date:</strong> {contact_message.event_date.strftime('%B %d, %Y') if contact_message.event_date else 'Not specified'}</p>
                    <p><strong>Budget:</strong> {contact_message.budget or 'Not specified'}</p>
                    <p><strong>Message:</strong> {contact_message.message[:200]}{'...' if len(contact_message.message) > 200 else ''}</p>
                </div>
                
                <p><strong>For immediate assistance, you can:</strong></p>
                <ul>
                    <li>📞 Call us: {settings.COMPANY_PHONE}</li>
                    <li>📧 Email: {settings.COMPANY_EMAIL}</li>
                    <li>💬 WhatsApp: <a href="https://wa.me/{settings.WHATSAPP_PHONE}">Click to chat</a></li>
                </ul>
                
                <p><strong>What happens next?</strong></p>
                <ol>
                    <li>Our team reviews your inquiry</li>
                    <li>We contact you for more details if needed</li>
                    <li>We provide a customized proposal</li>
                    <li>We schedule a site visit if required</li>
                </ol>
                
                <p>Best regards,<br>The IGNUX Team</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        email_service.send_email(contact_message.email, subject, html_body, is_html=True)
    except Exception as e:
        logger.error(f"Failed to send contact confirmation email: {e}")


async def send_admin_contact_notification(contact_message: ContactMessage) -> None:
    """Send contact form notification to admin team."""
    subject = f"📧 New Contact Form Submission - #{contact_message.id} - {contact_message.event_type}"
    
    body = f"""
    New contact form submission received:
    
    Inquiry ID: #{contact_message.id}
    Submitted: {contact_message.created_at.strftime('%Y-%m-%d %H:%M')}
    
    Contact Information:
    Name: {contact_message.name}
    Email: {contact_message.email}
    Phone: {contact_message.phone}
    
    Event Details:
    Type: {contact_message.event_type}
    Date: {contact_message.event_date.strftime('%Y-%m-%d') if contact_message.event_date else 'Not specified'}
    Budget: {contact_message.budget or 'Not specified'}
    
    Message:
    {contact_message.message}
    
    Status: {'✅ Read' if contact_message.is_read else '⏳ Unread'} | {'✅ Responded' if contact_message.responded else '⏳ Pending'}
    
    Please respond within 24 hours.
    """
    
    try:
        email_service.send_email(settings.EMAIL_ADMIN, subject, body)
    except Exception as e:
        logger.error(f"Failed to send admin contact notification: {e}")


async def send_quote_request_to_admin(
    quote_request: QuoteRequest,
    user_email: Optional[str] = None
) -> None:
    """Send quote request to admin/sales team."""
    subject = f"💰 Quick Quote Request - {quote_request.service_type}"
    
    requester_info = f"User: {user_email}" if user_email else "Anonymous user"
    
    body = f"""
    New quick quote request received:
    
    Reference: QR-{int(datetime.now().timestamp())}
    Requested: {datetime.now().strftime('%Y-%m-%d %H:%M')}
    {requester_info}
    
    Quote Details:
    Service Type: {quote_request.service_type}
    Event Date: {quote_request.event_date.strftime('%Y-%m-%d') if quote_request.event_date else 'Not specified'}
    Guest Count: {quote_request.guest_count or 'Not specified'}
    Location: {quote_request.location}
    Duration: {quote_request.duration}
    
    Special Requests:
    {quote_request.special_requests or 'None'}
    
    Contact Information:
    Email: {quote_request.contact_email}
    Phone: {quote_request.contact_phone}
    
    Priority: High (24-hour response expected)
    
    Please contact the client with a detailed quote.
    """
    
    try:
        email_service.send_email(settings.EMAIL_ADMIN, subject, body)
    except Exception as e:
        logger.error(f"Failed to send quote request to admin: {e}")


async def send_quote_confirmation_email(quote_request: QuoteRequest) -> None:
    """Send quote request confirmation to client."""
    subject = "✅ IGNUX Quote Request Received"
    
    html_body = f"""
    <html>
    <body>
        <h2>Quote Request Received</h2>
        <p>Thank you for requesting a quote from IGNUX!</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3>Request Details</h3>
            <p><strong>Service Type:</strong> {quote_request.service_type}</p>
            <p><strong>Location:</strong> {quote_request.location}</p>
            <p><strong>Duration:</strong> {quote_request.duration}</p>
            {f'<p><strong>Event Date:</strong> {quote_request.event_date.strftime("%B %d, %Y")}</p>' if quote_request.event_date else ''}
            {f'<p><strong>Guest Count:</strong> {quote_request.guest_count}</p>' if quote_request.guest_count else ''}
        </div>
        
        <p><strong>What happens next?</strong></p>
        <ol>
            <li>Our sales team reviews your request</li>
            <li>We contact you for any additional details</li>
            <li>We prepare a customized quote</li>
            <li>We send you the quote within 24 hours</li>
        </ol>
        
        <p>For immediate assistance, contact us at {settings.COMPANY_PHONE} or {settings.COMPANY_EMAIL}.</p>
        
        <br>
        <p>Best regards,<br>The IGNUX Team</p>
    </body>
    </html>
    """
    
    try:
        email_service.send_email(quote_request.contact_email, subject, html_body, is_html=True)
    except Exception as e:
        logger.error(f"Failed to send quote confirmation email: {e}")