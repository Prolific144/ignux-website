# app/routes/services.py
"""
Services and Content Management Routes

This module handles all service-related operations including:
- Service catalog management
- Testimonial submissions and approvals
- Newsletter subscriptions
- Service categories and packages
"""

from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
import logging

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.core.config import settings
from app.core.email_service import email_service
from app.models import User, Service, Testimonial, NewsletterSubscriber
from app.schemas import (
    ServiceCreate,
    ServiceResponse,
    ServiceUpdate,
    ServiceCategory,
    TestimonialCreate,
    TestimonialResponse,
    TestimonialUpdate,
    NewsletterSubscribe,
    NewsletterUnsubscribe,
    APIResponse
)
from app.crud import service as service_crud, testimonial as testimonial_crud, newsletter as newsletter_crud

router = APIRouter(prefix="/services", tags=["services"])

logger = logging.getLogger(__name__)


# ============ Service Management ============
@router.get("/", response_model=List[ServiceResponse])
async def get_services(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum records to return"),
    category: Optional[str] = Query(None, description="Filter by category"),
    popular_only: bool = Query(False, description="Show only popular services"),
    active_only: bool = Query(True, description="Show only active services"),
    featured_only: bool = Query(False, description="Show only featured services"),
    search: Optional[str] = Query(None, description="Search in service name and description"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    db: Session = Depends(get_db)
) -> List[ServiceResponse]:
    """
    Get services with filtering and search options.
    
    - Public endpoint (no authentication required)
    - Supports pagination, filtering, and search
    - Returns active services by default
    - Can filter by category, price range, popularity
    """
    try:
        services = service_crud.get_services(
            db=db,
            skip=skip,
            limit=limit,
            category=category,
            popular_only=popular_only,
            active_only=active_only,
            featured_only=featured_only,
            search=search,
            min_price=min_price,
            max_price=max_price
        )
        
        return services
        
    except Exception as e:
        logger.error(f"Failed to fetch services: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch services: {str(e)}"
        )


@router.get("/{service_id}", response_model=ServiceResponse)
async def get_service(
    service_id: int,
    db: Session = Depends(get_db)
) -> ServiceResponse:
    """
    Get a specific service by ID.
    
    - Public endpoint
    - Returns detailed service information
    - Includes features, pricing, and duration
    """
    try:
        service = service_crud.get_service(db, service_id)
        
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found"
            )
        
        # Check if service is active (unless admin request)
        # For public access, only return active services
        if not service.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found or inactive"
            )
        
        return service
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch service {service_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch service: {str(e)}"
        )


@router.get("/slug/{service_slug}", response_model=ServiceResponse)
async def get_service_by_slug(
    service_slug: str,
    db: Session = Depends(get_db)
) -> ServiceResponse:
    """
    Get a service by its URL-friendly slug.
    
    - Public endpoint
    - Useful for frontend routing
    - Returns same data as ID endpoint
    """
    try:
        service = service_crud.get_service_by_slug(db, service_slug)
        
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found"
            )
        
        # Check if service is active
        if not service.is_active:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found or inactive"
            )
        
        return service
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch service by slug {service_slug}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch service: {str(e)}"
        )


@router.get("/categories/", response_model=List[ServiceCategory])
async def get_service_categories(
    include_inactive: bool = Query(False, description="Include categories with inactive services"),
    db: Session = Depends(get_db)
) -> List[ServiceCategory]:
    """
    Get all service categories.
    
    - Public endpoint
    - Returns unique categories with counts
    - Can include/exclude inactive services
    """
    try:
        categories = service_crud.get_categories(db, include_inactive)
        
        return categories
        
    except Exception as e:
        logger.error(f"Failed to fetch service categories: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch service categories: {str(e)}"
        )


@router.get("/featured/", response_model=List[ServiceResponse])
async def get_featured_services(
    limit: int = Query(6, ge=1, le=20, description="Number of featured services to return"),
    db: Session = Depends(get_db)
) -> List[ServiceResponse]:
    """
    Get featured services for homepage display.
    
    - Public endpoint
    - Returns limited number of featured services
    - Ordered by display_order
    """
    try:
        services = service_crud.get_featured_services(db, limit)
        
        return services
        
    except Exception as e:
        logger.error(f"Failed to fetch featured services: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch featured services: {str(e)}"
        )


# ============ Testimonial Management ============
@router.post("/testimonials/", response_model=TestimonialResponse, status_code=status.HTTP_201_CREATED)
async def create_testimonial(
    testimonial_data: TestimonialCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> TestimonialResponse:
    """
    Submit a testimonial.
    
    - Public endpoint (requires moderation)
    - Testimonials require admin approval before being displayed
    - Sends notification to admin for review
    - Returns the created testimonial with pending status
    """
    try:
        # Create testimonial (initially not approved)
        testimonial = testimonial_crud.create_testimonial(db, testimonial_data)
        
        # Send notification to admin for approval
        background_tasks.add_task(
            send_testimonial_submission_notification,
            testimonial
        )
        
        # Send confirmation to submitter
        background_tasks.add_task(
            send_testimonial_confirmation_email,
            testimonial
        )
        
        logger.info(f"Testimonial submitted: ID={testimonial.id}, Client={testimonial.client_name}, Rating={testimonial.rating}")
        
        return testimonial
        
    except Exception as e:
        logger.error(f"Failed to submit testimonial: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to submit testimonial: {str(e)}"
        )


@router.get("/testimonials/", response_model=List[TestimonialResponse])
async def get_testimonials(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum records to return"),
    approved_only: bool = Query(True, description="Show only approved testimonials"),
    featured_only: bool = Query(False, description="Show only featured testimonials"),
    min_rating: Optional[int] = Query(None, ge=1, le=5, description="Minimum rating filter"),
    event_type: Optional[str] = Query(None, description="Filter by event type"),
    sort_by: str = Query("newest", regex="^(newest|oldest|highest_rating|lowest_rating)$"),
    db: Session = Depends(get_db)
) -> List[TestimonialResponse]:
    """
    Get testimonials with filtering options.
    
    - Public endpoint
    - By default shows only approved testimonials
    - Supports sorting and filtering
    - Useful for testimonial carousels and pages
    """
    try:
        testimonials = testimonial_crud.get_testimonials(
            db=db,
            skip=skip,
            limit=limit,
            approved_only=approved_only,
            featured_only=featured_only,
            min_rating=min_rating,
            event_type=event_type,
            sort_by=sort_by
        )
        
        return testimonials
        
    except Exception as e:
        logger.error(f"Failed to fetch testimonials: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch testimonials: {str(e)}"
        )


@router.get("/testimonials/stats", response_model=Dict[str, Any])
async def get_testimonial_stats(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Get testimonial statistics.
    
    - Public endpoint
    - Returns counts, average rating, distribution
    - Useful for displaying overall ratings
    """
    try:
        stats = testimonial_crud.get_testimonial_stats(db)
        
        return {
            "success": True,
            "message": "Testimonial statistics retrieved",
            "data": stats
        }
        
    except Exception as e:
        logger.error(f"Failed to fetch testimonial stats: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch testimonial stats: {str(e)}"
        )


@router.get("/testimonials/featured", response_model=List[TestimonialResponse])
async def get_featured_testimonials(
    limit: int = Query(3, ge=1, le=10, description="Number of featured testimonials to return"),
    db: Session = Depends(get_db)
) -> List[TestimonialResponse]:
    """
    Get featured testimonials for homepage.
    
    - Public endpoint
    - Returns highest-rated, approved testimonials
    - Limited number for display purposes
    """
    try:
        testimonials = testimonial_crud.get_featured_testimonials(db, limit)
        
        return testimonials
        
    except Exception as e:
        logger.error(f"Failed to fetch featured testimonials: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch featured testimonials: {str(e)}"
        )


# ============ Newsletter Management ============
@router.post("/newsletter/subscribe", response_model=APIResponse)
async def subscribe_to_newsletter(
    subscription: NewsletterSubscribe,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Subscribe to IGNUX newsletter.
    
    - Public endpoint
    - Validates email address
    - Prevents duplicate subscriptions
    - Sends welcome email
    - GDPR compliant with explicit consent
    """
    try:
        # Check if already subscribed
        existing = newsletter_crud.get_subscriber(db, subscription.email)
        
        if existing and existing.is_active:
            return APIResponse(
                success=True,
                message="You are already subscribed to our newsletter",
                data={"email": subscription.email, "status": "already_subscribed"}
            )
        
        # Create or reactivate subscription
        subscriber = newsletter_crud.subscribe_newsletter(
            db, 
            email=subscription.email,
            name=subscription.name,
            source=subscription.source
        )
        
        # Send welcome email
        background_tasks.add_task(
            send_newsletter_welcome_email,
            subscriber
        )
        
        logger.info(f"Newsletter subscription: Email={subscription.email}, Source={subscription.source}")
        
        return APIResponse(
            success=True,
            message="Successfully subscribed to IGNUX newsletter",
            data={
                "email": subscriber.email,
                "name": subscriber.name,
                "subscribed_at": subscriber.subscribed_at.isoformat() if subscriber.subscribed_at else None,
                "status": "subscribed"
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to subscribe to newsletter: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to subscribe to newsletter: {str(e)}"
        )


@router.post("/newsletter/unsubscribe", response_model=APIResponse)
async def unsubscribe_from_newsletter(
    unsubscribe_data: NewsletterUnsubscribe,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Unsubscribe from IGNUX newsletter.
    
    - Public endpoint
    - Requires email confirmation
    - Records unsubscribe reason if provided
    - Sends confirmation email
    - GDPR compliant with easy opt-out
    """
    try:
        subscriber = newsletter_crud.unsubscribe_newsletter(
            db, 
            email=unsubscribe_data.email,
            reason=unsubscribe_data.reason
        )
        
        if not subscriber:
            return APIResponse(
                success=True,
                message="Email not found in our subscription list",
                data={"email": unsubscribe_data.email, "status": "not_subscribed"}
            )
        
        # Send unsubscribe confirmation
        background_tasks.add_task(
            send_newsletter_unsubscribe_email,
            subscriber,
            unsubscribe_data.reason
        )
        
        logger.info(f"Newsletter unsubscription: Email={unsubscribe_data.email}, Reason={unsubscribe_data.reason}")
        
        return APIResponse(
            success=True,
            message="Successfully unsubscribed from IGNUX newsletter",
            data={
                "email": subscriber.email,
                "unsubscribed_at": subscriber.unsubscribed_at.isoformat() if subscriber.unsubscribed_at else None,
                "status": "unsubscribed"
            }
        )
        
    except Exception as e:
        logger.error(f"Failed to unsubscribe from newsletter: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to unsubscribe from newsletter: {str(e)}"
        )


@router.get("/newsletter/stats", response_model=Dict[str, Any])
async def get_newsletter_stats(
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Get newsletter subscription statistics (admin only).
    
    - Total subscribers
    - Active vs inactive
    - Subscription sources
    - Growth trends
    """
    try:
        stats = newsletter_crud.get_newsletter_stats(db)
        
        return {
            "success": True,
            "message": "Newsletter statistics retrieved",
            "data": stats
        }
        
    except Exception as e:
        logger.error(f"Failed to fetch newsletter stats: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch newsletter stats: {str(e)}"
        )


# ============ Admin Endpoints ============
@router.post("/", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
async def create_service(
    service_data: ServiceCreate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> ServiceResponse:
    """
    Create a new service (admin only).
    """
    try:
        service = service_crud.create_service(db, service_data, created_by=current_user.email)
        
        logger.info(f"Service created: ID={service.id}, Name={service.name}, By={current_user.email}")
        
        return service
        
    except Exception as e:
        logger.error(f"Failed to create service: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create service: {str(e)}"
        )


@router.patch("/{service_id}", response_model=ServiceResponse)
async def update_service(
    service_id: int,
    service_update: ServiceUpdate,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> ServiceResponse:
    """
    Update a service (admin only).
    """
    try:
        service = service_crud.update_service(db, service_id, service_update, updated_by=current_user.email)
        
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found"
            )
        
        logger.info(f"Service updated: ID={service_id}, By={current_user.email}")
        
        return service
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update service {service_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update service: {str(e)}"
        )


@router.delete("/{service_id}", response_model=APIResponse)
async def delete_service(
    service_id: int,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Soft delete a service (admin only).
    
    Sets service to inactive instead of permanent deletion.
    """
    try:
        service = service_crud.get_service(db, service_id)
        
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found"
            )
        
        # Soft delete (set inactive)
        service.is_active = False
        db.commit()
        
        logger.warning(f"Service deactivated: ID={service_id}, Name={service.name}, By={current_user.email}")
        
        return APIResponse(
            success=True,
            message=f"Service '{service.name}' has been deactivated",
            data={"service_id": service_id, "status": "inactive"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete service {service_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete service: {str(e)}"
        )


@router.patch("/testimonials/{testimonial_id}/approve", response_model=TestimonialResponse)
async def approve_testimonial(
    testimonial_id: int,
    featured: bool = Query(False, description="Mark as featured testimonial"),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> TestimonialResponse:
    """
    Approve a testimonial (admin only).
    
    - Approves pending testimonial
    - Optionally marks as featured
    - Sends notification to submitter
    """
    try:
        testimonial = testimonial_crud.approve_testimonial(db, testimonial_id, featured)
        
        if not testimonial:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Testimonial not found"
            )
        
        # Send approval notification
        background_tasks.add_task(
            send_testimonial_approval_email,
            testimonial,
            featured
        )
        
        logger.info(f"Testimonial approved: ID={testimonial_id}, Featured={featured}, By={current_user.email}")
        
        return testimonial
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to approve testimonial {testimonial_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to approve testimonial: {str(e)}"
        )


@router.delete("/testimonials/{testimonial_id}", response_model=APIResponse)
async def delete_testimonial(
    testimonial_id: int,
    reason: Optional[str] = Query(None, description="Reason for deletion"),
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Delete a testimonial (admin only).
    
    - Removes testimonial from display
    - Can provide reason for audit trail
    """
    try:
        testimonial = testimonial_crud.get_testimonial(db, testimonial_id)
        
        if not testimonial:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Testimonial not found"
            )
        
        # Soft delete or archive
        testimonial.is_approved = False
        db.commit()
        
        logger.warning(f"Testimonial deleted: ID={testimonial_id}, Client={testimonial.client_name}, Reason={reason}, By={current_user.email}")
        
        return APIResponse(
            success=True,
            message="Testimonial has been removed",
            data={"testimonial_id": testimonial_id, "status": "deleted"}
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete testimonial {testimonial_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete testimonial: {str(e)}"
        )


# Email helper functions
async def send_testimonial_submission_notification(testimonial: Testimonial) -> None:
    """Send notification to admin about new testimonial submission."""
    subject = f"⭐ New Testimonial Submission - {testimonial.client_name}"
    
    body = f"""
    New testimonial submitted and awaiting approval:
    
    Testimonial ID: #{testimonial.id}
    Submitted: {testimonial.created_at.strftime('%Y-%m-%d %H:%M')}
    
    Client: {testimonial.client_name}
    Event Type: {testimonial.event_type}
    Rating: {'⭐' * testimonial.rating} ({testimonial.rating}/5)
    
    Testimonial:
    {testimonial.testimonial}
    
    Status: ⏳ Pending Approval
    
    Please review and approve in the admin panel.
    """
    
    try:
        email_service.send_email(settings.EMAIL_ADMIN, subject, body)
    except Exception as e:
        logger.error(f"Failed to send testimonial submission notification: {e}")


async def send_testimonial_confirmation_email(testimonial: Testimonial) -> None:
    """Send confirmation email to testimonial submitter."""
    subject = "⭐ Thank You for Your Testimonial!"
    
    html_body = f"""
    <html>
    <body>
        <h2>Testimonial Received</h2>
        <p>Dear {testimonial.client_name},</p>
        <p>Thank you for sharing your experience with IGNUX!</p>
        <p>Your testimonial has been received and is awaiting moderation. We review all testimonials to ensure authenticity before publishing.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Your Rating:</strong> {'⭐' * testimonial.rating}</p>
            <p><strong>Event Type:</strong> {testimonial.event_type}</p>
        </div>
        
        <p>Once approved, your testimonial will be displayed on our website.</p>
        <p>If you have any questions, contact us at {settings.COMPANY_EMAIL}.</p>
        
        <br>
        <p>Best regards,<br>The IGNUX Team</p>
    </body>
    </html>
    """
    
    try:
        # Get email from testimonial or use contact form
        # In a real app, testimonials would have email field
        if hasattr(testimonial, 'client_email') and testimonial.client_email:
            email_service.send_email(testimonial.client_email, subject, html_body, is_html=True)
    except Exception as e:
        logger.error(f"Failed to send testimonial confirmation email: {e}")


async def send_testimonial_approval_email(testimonial: Testimonial, featured: bool) -> None:
    """Send notification when testimonial is approved."""
    subject = "✅ Your Testimonial Has Been Published!"
    
    html_body = f"""
    <html>
    <body>
        <h2>Testimonial Published</h2>
        <p>Dear {testimonial.client_name},</p>
        <p>Great news! Your testimonial has been approved and published on our website.</p>
        
        {f'<p><strong>🎉 Featured Testimonial:</strong> Your review has been marked as featured and will be prominently displayed!</p>' if featured else ''}
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p><strong>Your Words:</strong> {testimonial.testimonial[:150]}...</p>
            <p><strong>Your Rating:</strong> {'⭐' * testimonial.rating}</p>
        </div>
        
        <p>Thank you for sharing your experience. Your feedback helps others choose IGNUX with confidence.</p>
        
        <br>
        <p>Best regards,<br>The IGNUX Team</p>
    </body>
    </html>
    """
    
    try:
        if hasattr(testimonial, 'client_email') and testimonial.client_email:
            email_service.send_email(testimonial.client_email, subject, html_body, is_html=True)
    except Exception as e:
        logger.error(f"Failed to send testimonial approval email: {e}")


async def send_newsletter_welcome_email(subscriber: NewsletterSubscriber) -> None:
    """Send welcome email to new newsletter subscriber."""
    subject = "🎆 Welcome to IGNUX Newsletter!"
    
    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #FF6B00 0%, #FFD700 100%); 
                       color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1>Welcome to IGNUX Newsletter!</h1>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px;">
                <p>Hello {subscriber.name or 'Fireworks Enthusiast'},</p>
                <p>Thank you for subscribing to the IGNUX newsletter! You're now part of our exclusive community.</p>
                
                <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h3>🎇 What to Expect:</h3>
                    <ul>
                        <li>Latest fireworks display innovations</li>
                        <li>Exclusive offers and discounts</li>
                        <li>Event announcements and showcases</li>
                        <li>Safety tips and best practices</li>
                        <li>Behind-the-scenes content</li>
                    </ul>
                </div>
                
                <p><strong>Stay Connected:</strong></p>
                <ul>
                    <li>📞 Call: {settings.COMPANY_PHONE}</li>
                    <li>📧 Email: {settings.COMPANY_EMAIL}</li>
                    <li>💬 WhatsApp: <a href="https://wa.me/{settings.WHATSAPP_PHONE}">Chat with us</a></li>
                </ul>
                
                <p><strong>Unsubscribe:</strong> If you ever wish to stop receiving our emails, simply click the unsubscribe link in any newsletter.</p>
                
                <p>We're excited to share the magic of fireworks with you!</p>
                
                <br>
                <p>Best regards,<br>The IGNUX Team</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        email_service.send_email(subscriber.email, subject, html_body, is_html=True)
    except Exception as e:
        logger.error(f"Failed to send newsletter welcome email: {e}")


async def send_newsletter_unsubscribe_email(
    subscriber: NewsletterSubscriber, 
    reason: Optional[str] = None
) -> None:
    """Send confirmation email when unsubscribing from newsletter."""
    subject = "👋 You've Unsubscribed from IGNUX Newsletter"
    
    html_body = f"""
    <html>
    <body>
        <h2>Unsubscribe Confirmation</h2>
        <p>You have been successfully unsubscribed from the IGNUX newsletter.</p>
        
        {f'<p><strong>Reason:</strong> {reason}</p>' if reason else ''}
        
        <p>We're sorry to see you go! If this was a mistake, you can resubscribe at any time on our website.</p>
        
        <p>Thank you for being part of our community. We hope to welcome you back in the future.</p>
        
        <br>
        <p>Best regards,<br>The IGNUX Team</p>
    </body>
    </html>
    """
    
    try:
        email_service.send_email(subscriber.email, subject, html_body, is_html=True)
    except Exception as e:
        logger.error(f"Failed to send unsubscribe confirmation email: {e}")