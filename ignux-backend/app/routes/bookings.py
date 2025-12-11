# app/routes/bookings.py
"""
Booking Management Routes

This module handles all booking-related operations including:
- Creating new bookings
- Managing existing bookings
- Payment processing
- Booking status updates
"""

from datetime import datetime, date, timedelta
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc, func
import logging

from app.core.database import get_db
from app.core.security import get_current_user, get_current_admin_user
from app.core.config import settings
from app.core.email_service import email_service
from app.core.payment_service import payment_service
from app.models import User, Booking, BookingStatus, PaymentStatus
from app.schemas import (
    BookingCreate, 
    BookingResponse, 
    BookingUpdate, 
    BookingStatusEnum,
    PaymentStatusEnum,
    PaymentRecord,
    APIResponse
)
from app.crud import booking as booking_crud
from app.utils.validators import validate_booking_dates, validate_booking_data

router = APIRouter(prefix="/bookings", tags=["bookings"])

logger = logging.getLogger(__name__)


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking_data: BookingCreate,
    background_tasks: BackgroundTasks,
    current_user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> BookingResponse:
    """
    Create a new booking request.
    
    - Validates booking data
    - Creates booking in database
    - Sends confirmation emails
    - Triggers admin notifications
    
    Returns the created booking with status and payment information.
    """
    try:
        # Validate booking dates (must be at least 7 days in future)
        validate_booking_dates(booking_data.event_date)
        
        # Validate booking data
        validate_booking_data(booking_data)
        
        # Create booking
        booking = booking_crud.create_booking(db, booking_data, created_by=current_user.id if current_user else None)
        
        # Send confirmation email to client
        background_tasks.add_task(
            send_booking_confirmation_email,
            booking
        )
        
        # Send admin notification
        background_tasks.add_task(
            send_admin_booking_notification,
            booking
        )
        
        # Log booking creation
        logger.info(f"Booking created: ID={booking.id}, Event={booking.event_name}, Client={booking.client_email}")
        
        return booking
        
    except ValueError as e:
        logger.warning(f"Booking validation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Booking creation failed: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create booking: {str(e)}"
        )


@router.get("/", response_model=List[BookingResponse])
async def read_bookings(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum records to return"),
    status: Optional[BookingStatusEnum] = Query(None, description="Filter by booking status"),
    date_from: Optional[date] = Query(None, description="Filter by event date from"),
    date_to: Optional[date] = Query(None, description="Filter by event date to"),
    client_email: Optional[str] = Query(None, description="Filter by client email"),
    service_type: Optional[str] = Query(None, description="Filter by service type"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[BookingResponse]:
    """
    Get bookings with filtering options.
    
    - Regular users can only see their own bookings
    - Admin users can see all bookings
    - Supports pagination and filtering
    """
    try:
        # Regular users can only see their own bookings
        if not current_user.is_admin:
            client_email = current_user.email
        
        bookings = booking_crud.get_bookings(
            db=db,
            skip=skip,
            limit=limit,
            status=status.value if status else None,
            date_from=date_from,
            date_to=date_to,
            client_email=client_email,
            service_type=service_type
        )
        
        return bookings
        
    except Exception as e:
        logger.error(f"Failed to fetch bookings: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch bookings: {str(e)}"
        )


@router.get("/{booking_id}", response_model=BookingResponse)
async def read_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> BookingResponse:
    """
    Get a specific booking by ID.
    
    - Regular users can only access their own bookings
    - Admin users can access any booking
    """
    try:
        booking = booking_crud.get_booking(db, booking_id)
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        # Check access permissions
        if not current_user.is_admin and booking.client_email != current_user.email:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this booking"
            )
        
        return booking
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch booking {booking_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch booking: {str(e)}"
        )


@router.patch("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: int,
    booking_update: BookingUpdate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> BookingResponse:
    """
    Update a booking (admin only for now).
    
    Only certain fields can be updated depending on booking status.
    """
    try:
        # Only admin can update bookings
        if not current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin privileges required"
            )
        
        booking = booking_crud.get_booking(db, booking_id)
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        # Validate update based on current status
        if booking.booking_status == BookingStatus.COMPLETED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot update completed booking"
            )
        
        if booking.booking_status == BookingStatus.CANCELLED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot update cancelled booking"
            )
        
        # Update booking
        updated_booking = booking_crud.update_booking(db, booking_id, booking_update)
        
        # Log update
        logger.info(f"Booking updated: ID={booking_id}, Updated by={current_user.email}")
        
        # Send update notification
        background_tasks.add_task(
            send_booking_update_email,
            updated_booking,
            current_user.email
        )
        
        return updated_booking
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update booking {booking_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update booking: {str(e)}"
        )


@router.patch("/{booking_id}/status", response_model=BookingResponse)
async def update_booking_status(
    booking_id: int,
    new_status: BookingStatusEnum,
    notes: Optional[str] = Query(None, description="Optional status change notes"),
    background_tasks: BackgroundTasks = None,
    current_user: User = Depends(get_current_admin_user),
    db: Session = Depends(get_db)
) -> BookingResponse:
    """
    Update booking status (admin only).
    
    Valid status transitions:
    - PENDING → CONFIRMED, CANCELLED
    - CONFIRMED → IN_PROGRESS, CANCELLED
    - IN_PROGRESS → COMPLETED, CANCELLED
    
    Sends notification email on status change.
    """
    try:
        booking = booking_crud.get_booking(db, booking_id)
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        # Validate status transition
        valid_transitions = {
            BookingStatus.PENDING: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
            BookingStatus.CONFIRMED: [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED],
            BookingStatus.IN_PROGRESS: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
        }
        
        current_status = booking.booking_status
        if current_status not in valid_transitions or new_status.value not in valid_transitions[current_status]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot change status from {current_status.value} to {new_status.value}"
            )
        
        # Update status
        updated_booking = booking_crud.update_booking_status(
            db, booking_id, new_status.value, updated_by=current_user.email
        )
        
        # Add status notes if provided
        if notes:
            # This would be stored in a booking_notes table in a real implementation
            pass
        
        # Log status change
        logger.info(f"Booking status changed: ID={booking_id}, {current_status.value}→{new_status.value}, By={current_user.email}")
        
        # Send status update email
        if background_tasks:
            background_tasks.add_task(
                send_booking_status_email,
                updated_booking,
                current_status.value,
                new_status.value,
                notes
            )
        
        return updated_booking
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update booking status {booking_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update booking status: {str(e)}"
        )


@router.post("/{booking_id}/payments", response_model=BookingResponse)
async def record_payment(
    booking_id: int,
    payment_data: PaymentRecord,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> BookingResponse:
    """
    Record a payment for a booking.
    
    - Admin can record any payment
    - Users can only record payments for their own bookings
    - Updates payment status automatically
    """
    try:
        booking = booking_crud.get_booking(db, booking_id)
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        # Check permissions
        if not current_user.is_admin and booking.client_email != current_user.email:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to record payment for this booking"
            )
        
        # Validate payment amount
        if payment_data.amount <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Payment amount must be positive"
            )
        
        # Record payment
        updated_booking = booking_crud.record_payment(
            db, booking_id, payment_data, recorded_by=current_user.email
        )
        
        # Log payment
        logger.info(f"Payment recorded: Booking={booking_id}, Amount={payment_data.amount}, Method={payment_data.payment_method}")
        
        # Send payment confirmation
        background_tasks.add_task(
            send_payment_confirmation_email,
            updated_booking,
            payment_data
        )
        
        return updated_booking
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to record payment for booking {booking_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to record payment: {str(e)}"
        )


@router.get("/{booking_id}/payments", response_model=List[PaymentRecord])
async def get_booking_payments(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[PaymentRecord]:
    """
    Get payment history for a booking.
    """
    try:
        booking = booking_crud.get_booking(db, booking_id)
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        # Check permissions
        if not current_user.is_admin and booking.client_email != current_user.email:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view payments for this booking"
            )
        
        # Get payments (in real app, fetch from payments table)
        # For now, return summary
        payments = []
        if booking.deposit_paid > 0:
            payments.append(PaymentRecord(
                amount=booking.deposit_paid,
                payment_method="deposit",
                transaction_date=booking.confirmed_at or booking.created_at,
                reference_number=f"DEP-{booking.id}"
            ))
        
        return payments
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to fetch payments for booking {booking_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch payments: {str(e)}"
        )


@router.get("/upcoming/", response_model=List[BookingResponse])
async def get_upcoming_bookings(
    days: int = Query(30, ge=1, le=365, description="Number of days to look ahead"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[BookingResponse]:
    """
    Get upcoming bookings within the specified number of days.
    
    - Admin sees all upcoming bookings
    - Regular users see only their own upcoming bookings
    """
    try:
        # Calculate date range
        today = date.today()
        future_date = today + timedelta(days=days)
        
        upcoming_bookings = booking_crud.get_upcoming_bookings(
            db, days, current_user.email if not current_user.is_admin else None
        )
        
        return upcoming_bookings
        
    except Exception as e:
        logger.error(f"Failed to fetch upcoming bookings: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch upcoming bookings: {str(e)}"
        )


@router.get("/calendar/availability")
async def check_availability(
    date_from: date = Query(..., description="Start date"),
    date_to: date = Query(..., description="End date"),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Check booking availability for a date range.
    
    Returns available and booked dates.
    Useful for frontend calendar display.
    """
    try:
        # Get all bookings in date range
        bookings = booking_crud.get_bookings(
            db=db,
            date_from=date_from,
            date_to=date_to,
            status=BookingStatus.CONFIRMED.value  # Only confirmed bookings block dates
        )
        
        # Calculate booked dates
        booked_dates = []
        for booking in bookings:
            booking_date = booking.event_date.date() if isinstance(booking.event_date, datetime) else booking.event_date
            booked_dates.append(booking_date.isoformat())
        
        # Generate date range
        delta = date_to - date_from
        all_dates = []
        for i in range(delta.days + 1):
            current_date = date_from + timedelta(days=i)
            all_dates.append(current_date.isoformat())
        
        available_dates = [d for d in all_dates if d not in booked_dates]
        
        return {
            "date_from": date_from.isoformat(),
            "date_to": date_to.isoformat(),
            "booked_dates": booked_dates,
            "available_dates": available_dates,
            "total_days": len(all_dates),
            "booked_days": len(booked_dates),
            "available_days": len(available_dates)
        }
        
    except Exception as e:
        logger.error(f"Failed to check availability: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to check availability: {str(e)}"
        )


@router.post("/{booking_id}/cancel", response_model=BookingResponse)
async def cancel_booking(
    booking_id: int,
    reason: Optional[str] = Query(None, description="Cancellation reason"),
    background_tasks: BackgroundTasks = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> BookingResponse:
    """
    Cancel a booking.
    
    - Users can cancel their own bookings (with restrictions)
    - Admin can cancel any booking
    - May involve refund processing
    """
    try:
        booking = booking_crud.get_booking(db, booking_id)
        
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        # Check permissions
        if not current_user.is_admin and booking.client_email != current_user.email:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to cancel this booking"
            )
        
        # Check if cancellation is allowed
        if booking.booking_status in [BookingStatus.COMPLETED, BookingStatus.CANCELLED]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot cancel booking with status: {booking.booking_status.value}"
            )
        
        # Calculate cancellation fee based on timing
        event_date = booking.event_date.date() if isinstance(booking.event_date, datetime) else booking.event_date
        days_until_event = (event_date - date.today()).days
        
        cancellation_fee = 0.0
        if days_until_event < 7:
            cancellation_fee = booking.total_price * 0.5  # 50% fee if less than 7 days
        elif days_until_event < 30:
            cancellation_fee = booking.total_price * 0.2  # 20% fee if less than 30 days
        
        # Cancel booking
        updated_booking = booking_crud.cancel_booking(
            db, booking_id, reason, cancellation_fee, cancelled_by=current_user.email
        )
        
        # Log cancellation
        logger.warning(f"Booking cancelled: ID={booking_id}, Reason={reason}, Fee={cancellation_fee}, By={current_user.email}")
        
        # Send cancellation notification
        if background_tasks:
            background_tasks.add_task(
                send_booking_cancellation_email,
                updated_booking,
                reason,
                cancellation_fee
            )
        
        return updated_booking
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to cancel booking {booking_id}: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to cancel booking: {str(e)}"
        )


# Email helper functions
async def send_booking_confirmation_email(booking: Booking) -> None:
    """Send booking confirmation email to client."""
    subject = f"🎆 IGNUX Booking Confirmation #{booking.id}"
    
    html_body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #FF6B00 0%, #FFD700 100%); 
                       color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1>🎆 IGNUX Booking Confirmation</h1>
                <p>Your fireworks experience is being prepared!</p>
            </div>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px;">
                <p>Dear {booking.client_name},</p>
                <p>Thank you for booking IGNUX for your {booking.event_type}. Your booking has been received and is being processed.</p>
                
                <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
                    <h3>📋 Booking Details</h3>
                    <p><strong>Booking ID:</strong> #{booking.id}</p>
                    <p><strong>Event:</strong> {booking.event_name}</p>
                    <p><strong>Date:</strong> {booking.event_date.strftime('%B %d, %Y')}</p>
                    <p><strong>Time:</strong> {booking.event_time}</p>
                    <p><strong>Location:</strong> {booking.event_location}</p>
                    <p><strong>Service Package:</strong> {booking.service_package}</p>
                    <p><strong>Duration:</strong> {booking.display_duration}</p>
                    
                    <h3>💰 Payment Information</h3>
                    <p><strong>Total Amount:</strong> KES {booking.total_price:,.2f}</p>
                    <p><strong>Deposit Required:</strong> KES {booking.total_price * 0.3:,.2f}</p>
                    <p><strong>Current Status:</strong> {booking.booking_status.value.title()}</p>
                </div>
                
                <p><strong>Next Steps:</strong></p>
                <ol>
                    <li>Our team will contact you within 24 hours for site assessment</li>
                    <li>Please confirm the deposit payment to secure your date</li>
                    <li>We'll send you safety and permit documentation</li>
                </ol>
                
                <p>For any questions, contact us at:</p>
                <ul>
                    <li>📞 Phone: {settings.COMPANY_PHONE}</li>
                    <li>📧 Email: {settings.COMPANY_EMAIL}</li>
                    <li>💬 WhatsApp: <a href="https://wa.me/{settings.WHATSAPP_PHONE}">Click to chat</a></li>
                </ul>
                
                <p>Best regards,<br>The IGNUX Team</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    try:
        email_service.send_email(booking.client_email, subject, html_body, is_html=True)
    except Exception as e:
        logger.error(f"Failed to send booking confirmation email: {e}")


async def send_admin_booking_notification(booking: Booking) -> None:
    """Send booking notification to admin."""
    subject = f"📋 New Booking Received - #{booking.id} - {booking.event_name}"
    
    body = f"""
    New booking received:
    
    Booking ID: #{booking.id}
    Client: {booking.client_name}
    Email: {booking.client_email}
    Phone: {booking.client_phone}
    
    Event: {booking.event_name} ({booking.event_type})
    Date: {booking.event_date.strftime('%Y-%m-%d')}
    Time: {booking.event_time}
    Location: {booking.event_location}
    
    Service: {booking.service_type} - {booking.service_package}
    Duration: {booking.display_duration}
    
    Amount: KES {booking.total_price:,.2f}
    Status: {booking.booking_status.value}
    
    Please review in the admin panel.
    """
    
    try:
        email_service.send_email(settings.EMAIL_ADMIN, subject, body)
    except Exception as e:
        logger.error(f"Failed to send admin booking notification: {e}")


async def send_booking_update_email(booking: Booking, updated_by: str) -> None:
    """Send notification email when booking is updated."""
    subject = f"📝 Booking Updated - #{booking.id}"
    
    html_body = f"""
    <html>
    <body>
        <h2>Booking Updated</h2>
        <p>Your booking #{booking.id} has been updated.</p>
        <p>Updated by: {updated_by}</p>
        <p>Please log in to your account to view the changes.</p>
        <br>
        <p>Best regards,<br>The IGNUX Team</p>
    </body>
    </html>
    """
    
    try:
        email_service.send_email(booking.client_email, subject, html_body, is_html=True)
    except Exception as e:
        logger.error(f"Failed to send booking update email: {e}")


async def send_booking_status_email(
    booking: Booking, 
    old_status: str, 
    new_status: str,
    notes: Optional[str] = None
) -> None:
    """Send email when booking status changes."""
    subject = f"🔄 Booking Status Updated - #{booking.id}"
    
    status_emojis = {
        "pending": "⏳",
        "confirmed": "✅",
        "in_progress": "🚀",
        "completed": "🎉",
        "cancelled": "❌"
    }
    
    html_body = f"""
    <html>
    <body>
        <h2>Booking Status Updated</h2>
        <p>Your booking #{booking.id} status has been updated:</p>
        <p><strong>{status_emojis.get(old_status, '')} Old Status:</strong> {old_status.title()}</p>
        <p><strong>{status_emojis.get(new_status, '')} New Status:</strong> {new_status.title()}</p>
        
        {f'<p><strong>Notes:</strong> {notes}</p>' if notes else ''}
        
        <p>Event: {booking.event_name}</p>
        <p>Date: {booking.event_date.strftime('%B %d, %Y')}</p>
        
        <br>
        <p>Best regards,<br>The IGNUX Team</p>
    </body>
    </html>
    """
    
    try:
        email_service.send_email(booking.client_email, subject, html_body, is_html=True)
    except Exception as e:
        logger.error(f"Failed to send booking status email: {e}")


async def send_payment_confirmation_email(booking: Booking, payment: PaymentRecord) -> None:
    """Send payment confirmation email."""
    subject = f"💰 Payment Received - Booking #{booking.id}"
    
    html_body = f"""
    <html>
    <body>
        <h2>Payment Confirmation</h2>
        <p>Payment has been recorded for your booking #{booking.id}.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h3>Payment Details</h3>
            <p><strong>Amount:</strong> KES {payment.amount:,.2f}</p>
            <p><strong>Method:</strong> {payment.payment_method.title()}</p>
            <p><strong>Date:</strong> {payment.transaction_date.strftime('%B %d, %Y %H:%M')}</p>
            <p><strong>Reference:</strong> {payment.reference_number}</p>
        </div>
        
        <p><strong>Booking Summary:</strong></p>
        <p>Total Amount: KES {booking.total_price:,.2f}</p>
        <p>Paid to Date: KES {booking.deposit_paid:,.2f}</p>
        <p>Balance Due: KES {booking.balance_due:,.2f}</p>
        <p>Payment Status: {booking.payment_status.value.title()}</p>
        
        <br>
        <p>Best regards,<br>The IGNUX Team</p>
    </body>
    </html>
    """
    
    try:
        email_service.send_email(booking.client_email, subject, html_body, is_html=True)
    except Exception as e:
        logger.error(f"Failed to send payment confirmation email: {e}")


async def send_booking_cancellation_email(
    booking: Booking, 
    reason: Optional[str], 
    cancellation_fee: float
) -> None:
    """Send booking cancellation email."""
    subject = f"❌ Booking Cancelled - #{booking.id}"
    
    html_body = f"""
    <html>
    <body>
        <h2>Booking Cancelled</h2>
        <p>Your booking #{booking.id} has been cancelled.</p>
        
        {f'<p><strong>Cancellation Reason:</strong> {reason}</p>' if reason else ''}
        
        {f'<p><strong>Cancellation Fee:</strong> KES {cancellation_fee:,.2f}</p>' if cancellation_fee > 0 else ''}
        
        <p>If you have any questions about the cancellation or refund, please contact us.</p>
        
        <br>
        <p>Best regards,<br>The IGNUX Team</p>
    </body>
    </html>
    """
    
    try:
        email_service.send_email(booking.client_email, subject, html_body, is_html=True)
    except Exception as e:
        logger.error(f"Failed to send cancellation email: {e}")