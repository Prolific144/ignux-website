# app/crud.py
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc
from typing import List, Optional, Dict, Any
from datetime import datetime, date, timedelta
import json
from . import models, schemas

# Contact Messages CRUD
def create_contact_message(db: Session, contact_data: schemas.ContactMessageCreate):
    db_contact = models.ContactMessage(
        name=contact_data.name,
        email=contact_data.email,
        phone=contact_data.phone,
        event_type=contact_data.event_type,
        event_date=contact_data.event_date,
        budget=contact_data.budget,
        message=contact_data.message
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

def get_contact_messages(db: Session, skip: int = 0, limit: int = 100, 
                         read_status: Optional[bool] = None,
                         responded_status: Optional[bool] = None):
    query = db.query(models.ContactMessage)
    
    if read_status is not None:
        query = query.filter(models.ContactMessage.is_read == read_status)
    
    if responded_status is not None:
        query = query.filter(models.ContactMessage.responded == responded_status)
    
    return query.order_by(desc(models.ContactMessage.created_at)).offset(skip).limit(limit).all()

def get_contact_message(db: Session, message_id: int):
    return db.query(models.ContactMessage).filter(models.ContactMessage.id == message_id).first()

def mark_as_read(db: Session, message_id: int):
    message = get_contact_message(db, message_id)
    if message:
        message.is_read = True
        db.commit()
        db.refresh(message)
    return message

def add_notes(db: Session, message_id: int, notes: str):
    message = get_contact_message(db, message_id)
    if message:
        message.notes = notes
        db.commit()
        db.refresh(message)
    return message

# Bookings CRUD
def create_booking(db: Session, booking_data: schemas.BookingCreate):
    # Calculate balance
    total_price = booking_data.total_price
    balance_due = total_price - booking_data.discount
    
    db_booking = models.Booking(
        # Client info
        client_name=booking_data.client_name,
        client_email=booking_data.client_email,
        client_phone=booking_data.client_phone,
        client_address=booking_data.client_address,
        
        # Event info
        event_type=booking_data.event_type,
        event_name=booking_data.event_name,
        event_date=booking_data.event_date,
        event_time=booking_data.event_time,
        event_location=booking_data.event_location,
        venue_type=booking_data.venue_type,
        expected_guests=booking_data.expected_guests,
        
        # Service info
        service_type=booking_data.service_type,
        service_package=booking_data.service_package,
        additional_services=booking_data.additional_services,
        
        # Pyrotechnics info
        display_duration=booking_data.display_duration,
        display_type=booking_data.display_type,
        colors_requested=booking_data.colors_requested,
        music_sync=booking_data.music_sync,
        special_effects=booking_data.special_effects,
        
        # Pricing
        base_price=booking_data.base_price,
        additional_charges=booking_data.additional_charges,
        discount=booking_data.discount,
        total_price=total_price,
        balance_due=balance_due,
        
        # Additional info
        special_instructions=booking_data.special_instructions,
        emergency_contact=booking_data.emergency_contact,
        insurance_required=booking_data.insurance_required,
        
        # Defaults
        booking_status=models.BookingStatus.PENDING,
        payment_status=models.PaymentStatus.PENDING,
        permit_required=True,  # Always require permits for fireworks
        team_size=3  # Default team size
    )
    
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_bookings(db: Session, skip: int = 0, limit: int = 100,
                 status: Optional[str] = None,
                 date_from: Optional[date] = None,
                 date_to: Optional[date] = None):
    query = db.query(models.Booking)
    
    if status:
        query = query.filter(models.Booking.booking_status == status)
    
    if date_from:
        query = query.filter(models.Booking.event_date >= date_from)
    
    if date_to:
        query = query.filter(models.Booking.event_date <= date_to)
    
    return query.order_by(asc(models.Booking.event_date)).offset(skip).limit(limit).all()

def get_booking(db: Session, booking_id: int):
    return db.query(models.Booking).filter(models.Booking.id == booking_id).first()

def update_booking_status(db: Session, booking_id: int, status: str):
    booking = get_booking(db, booking_id)
    if booking:
        booking.booking_status = status
        
        if status == "confirmed":
            booking.confirmed_at = datetime.now()
        elif status == "completed":
            booking.completed_at = datetime.now()
        
        db.commit()
        db.refresh(booking)
    return booking

def update_payment(db: Session, booking_id: int, amount: float):
    booking = get_booking(db, booking_id)
    if booking:
        booking.deposit_paid += amount
        booking.balance_due = max(0, booking.total_price - booking.deposit_paid)
        
        if booking.balance_due == 0:
            booking.payment_status = models.PaymentStatus.PAID
        elif booking.deposit_paid > 0:
            booking.payment_status = models.PaymentStatus.PARTIAL
        
        db.commit()
        db.refresh(booking)
    return booking

# Services CRUD
def create_service(db: Session, service_data: schemas.ServiceCreate):
    db_service = models.Service(
        name=service_data.name,
        slug=service_data.slug,
        category=service_data.category,
        description=service_data.description,
        features=service_data.features,
        base_price=service_data.base_price,
        price_range_min=service_data.price_range_min,
        price_range_max=service_data.price_range_max,
        duration=service_data.duration,
        is_popular=service_data.is_popular,
        display_order=service_data.display_order,
        is_active=True
    )
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

def get_services(db: Session, skip: int = 0, limit: int = 100,
                 category: Optional[str] = None,
                 popular_only: bool = False,
                 active_only: bool = True):
    query = db.query(models.Service)
    
    if category:
        query = query.filter(models.Service.category == category)
    
    if popular_only:
        query = query.filter(models.Service.is_popular == True)
    
    if active_only:
        query = query.filter(models.Service.is_active == True)
    
    return query.order_by(asc(models.Service.display_order)).offset(skip).limit(limit).all()

def get_service(db: Session, service_id: int):
    return db.query(models.Service).filter(models.Service.id == service_id).first()

def get_service_by_slug(db: Session, slug: str):
    return db.query(models.Service).filter(models.Service.slug == slug).first()

# Testimonials CRUD
def create_testimonial(db: Session, testimonial_data: schemas.TestimonialCreate):
    db_testimonial = models.Testimonial(
        client_name=testimonial_data.client_name,
        event_type=testimonial_data.event_type,
        event_date=testimonial_data.event_date,
        rating=testimonial_data.rating,
        testimonial=testimonial_data.testimonial,
        is_approved=False  # New testimonials need approval
    )
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial

def get_testimonials(db: Session, skip: int = 0, limit: int = 100,
                     approved_only: bool = True,
                     featured_only: bool = False):
    query = db.query(models.Testimonial)
    
    if approved_only:
        query = query.filter(models.Testimonial.is_approved == True)
    
    if featured_only:
        query = query.filter(models.Testimonial.is_featured == True)
    
    return query.order_by(desc(models.Testimonial.created_at)).offset(skip).limit(limit).all()

# Newsletter CRUD
def subscribe_newsletter(db: Session, email: str, name: Optional[str] = None, source: str = "website"):
    # Check if already subscribed
    existing = db.query(models.NewsletterSubscriber).filter(
        models.NewsletterSubscriber.email == email
    ).first()
    
    if existing:
        if not existing.is_active:
            existing.is_active = True
            existing.subscribed_at = datetime.now()
            db.commit()
            db.refresh(existing)
        return existing
    
    db_subscriber = models.NewsletterSubscriber(
        email=email,
        name=name,
        source=source
    )
    db.add(db_subscriber)
    db.commit()
    db.refresh(db_subscriber)
    return db_subscriber

def unsubscribe_newsletter(db: Session, email: str):
    subscriber = db.query(models.NewsletterSubscriber).filter(
        models.NewsletterSubscriber.email == email
    ).first()
    
    if subscriber:
        subscriber.is_active = False
        db.commit()
        db.refresh(subscriber)
    
    return subscriber

# Stats
def get_stats(db: Session):
    total_bookings = db.query(models.Booking).count()
    pending_bookings = db.query(models.Booking).filter(
        models.Booking.booking_status == "pending"
    ).count()
    completed_events = db.query(models.Booking).filter(
        models.Booking.booking_status == "completed"
    ).count()
    
    # Calculate revenue from completed events
    completed_bookings = db.query(models.Booking).filter(
        models.Booking.booking_status == "completed"
    ).all()
    total_revenue = sum(booking.total_price for booking in completed_bookings)
    
    services_count = db.query(models.Service).filter(
        models.Service.is_active == True
    ).count()
    
    testimonials_count = db.query(models.Testimonial).filter(
        models.Testimonial.is_approved == True
    ).count()
    
    newsletter_subscribers = db.query(models.NewsletterSubscriber).filter(
        models.NewsletterSubscriber.is_active == True
    ).count()
    
    return {
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "completed_events": completed_events,
        "total_revenue": total_revenue,
        "services_count": services_count,
        "testimonials_count": testimonials_count,
        "newsletter_subscribers": newsletter_subscribers
    }