# app/models.py
"""
SQLAlchemy ORM Models

This module defines all database models for the IGNUX application.
Models are designed with proper constraints, indexes, and relationships
for optimal database performance.
"""

from sqlalchemy import (
    Column, Integer, String, Float, DateTime, Boolean, 
    Text, Enum, ForeignKey, Index, CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import relationship, validates
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import JSONB  # For PostgreSQL JSON support
import enum
from typing import Optional, List, Dict, Any

from app.database import Base  # Use the centralized Base


class BookingStatus(str, enum.Enum):
    """
    Enumeration for booking status values.
    
    Attributes:
        PENDING: Initial booking state
        CONFIRMED: Booking confirmed by admin
        IN_PROGRESS: Event is currently in progress
        COMPLETED: Event successfully completed
        CANCELLED: Booking cancelled
    """
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class PaymentStatus(str, enum.Enum):
    """
    Enumeration for payment status values.
    
    Attributes:
        PENDING: No payment received
        PARTIAL: Partial payment received
        PAID: Full payment received
        REFUNDED: Payment refunded
    """
    PENDING = "pending"
    PARTIAL = "partial"
    PAID = "paid"
    REFUNDED = "refunded"


class ContactMessage(Base):
    """
    Model for storing contact form submissions.
    
    This table stores inquiries from potential clients who fill out
    the contact form on the website.
    """
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    email = Column(String(100), nullable=False, index=True)
    phone = Column(String(20), nullable=False, index=True)
    event_type = Column(String(50), nullable=False, index=True)
    event_date = Column(DateTime, nullable=True, index=True)
    budget = Column(String(50), nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now(), index=True)
    is_read = Column(Boolean, default=False, index=True)
    responded = Column(Boolean, default=False, index=True)
    notes = Column(Text, nullable=True)
    
    # Indexes for common query patterns
    __table_args__ = (
        Index('ix_contact_messages_created_at_read', 'created_at', 'is_read'),
        Index('ix_contact_messages_email_responded', 'email', 'responded'),
    )
    
    @validates('email')
    def validate_email(self, key: str, email: str) -> str:
        """Validate email format before saving."""
        if '@' not in email:
            raise ValueError("Invalid email address")
        return email.lower()  # Store emails in lowercase


class Booking(Base):
    """
    Model for storing client bookings.
    
    This is the main business entity representing confirmed or potential
    fireworks display bookings. Contains comprehensive event details.
    """
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # ============ Client Information ============
    client_name = Column(String(100), nullable=False, index=True)
    client_email = Column(String(100), nullable=False, index=True)
    client_phone = Column(String(20), nullable=False, index=True)
    client_address = Column(String(200), nullable=True)
    
    # ============ Event Details ============
    event_type = Column(String(50), nullable=False, index=True)
    event_name = Column(String(100), nullable=False)
    event_date = Column(DateTime, nullable=False, index=True)
    event_time = Column(String(20), nullable=False)
    event_location = Column(String(200), nullable=False)
    venue_type = Column(String(50), nullable=False)  # indoor, outdoor, mixed
    expected_guests = Column(Integer, nullable=True)
    
    # ============ Service Details ============
    service_type = Column(String(50), nullable=False, index=True)
    service_package = Column(String(50), nullable=False)
    additional_services = Column(Text, nullable=True)  # JSON string
    
    # ============ Pyrotechnics Details ============
    display_duration = Column(String(20), nullable=False)
    display_type = Column(String(50), nullable=False)  # ground, aerial, mixed
    colors_requested = Column(String(200), nullable=True)
    music_sync = Column(Boolean, default=False)
    special_effects = Column(Text, nullable=True)
    
    # ============ Pricing ============
    base_price = Column(Float, nullable=False)
    additional_charges = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    total_price = Column(Float, nullable=False)
    deposit_paid = Column(Float, default=0.0)
    balance_due = Column(Float, nullable=False)
    
    # ============ Status ============
    booking_status = Column(
        Enum(BookingStatus), 
        default=BookingStatus.PENDING, 
        nullable=False,
        index=True
    )
    payment_status = Column(
        Enum(PaymentStatus), 
        default=PaymentStatus.PENDING, 
        nullable=False,
        index=True
    )
    
    # ============ Dates ============
    created_at = Column(DateTime, default=func.now(), index=True)
    confirmed_at = Column(DateTime, nullable=True, index=True)
    completed_at = Column(DateTime, nullable=True, index=True)
    
    # ============ Additional Information ============
    special_instructions = Column(Text, nullable=True)
    emergency_contact = Column(String(100), nullable=True)
    insurance_required = Column(Boolean, default=False)
    permit_required = Column(Boolean, default=True)
    permit_obtained = Column(Boolean, default=False, index=True)
    
    # ============ Staff Assignment ============
    assigned_team_leader = Column(String(100), nullable=True, index=True)
    team_size = Column(Integer, default=3)
    
    # ============ Audit Fields ============
    updated_at = Column(
        DateTime, 
        default=func.now(), 
        onupdate=func.now(), 
        index=True
    )
    created_by = Column(String(100), nullable=True)
    updated_by = Column(String(100), nullable=True)
    
    # ============ Indexes and Constraints ============
    __table_args__ = (
        # Composite index for common queries
        Index('ix_bookings_status_date', 'booking_status', 'event_date'),
        Index('ix_bookings_email_status', 'client_email', 'booking_status'),
        Index('ix_bookings_payment_status', 'payment_status', 'balance_due'),
        
        # Check constraints for data integrity
        CheckConstraint('total_price >= 0', name='check_total_price_positive'),
        CheckConstraint('balance_due >= 0', name='check_balance_due_non_negative'),
        CheckConstraint('discount >= 0', name='check_discount_non_negative'),
        CheckConstraint('team_size > 0', name='check_team_size_positive'),
    )
    
    @validates('expected_guests')
    def validate_expected_guests(self, key: str, guests: Optional[int]) -> Optional[int]:
        """Validate expected guests count."""
        if guests is not None and guests <= 0:
            raise ValueError("Expected guests must be positive")
        return guests
    
    @validates('total_price')
    def validate_total_price(self, key: str, price: float) -> float:
        """Validate total price."""
        if price <= 0:
            raise ValueError("Total price must be positive")
        return round(price, 2)  # Store with 2 decimal places


class Service(Base):
    """
    Model for storing available services/packages.
    
    Represents different fireworks display packages offered by IGNUX.
    """
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)
    description = Column(Text, nullable=False)
    features = Column(Text, nullable=True)  # JSON string
    base_price = Column(Float, nullable=False)
    price_range_min = Column(Float, nullable=False)
    price_range_max = Column(Float, nullable=False)
    duration = Column(String(50), nullable=False)
    is_popular = Column(Boolean, default=False, index=True)
    is_active = Column(Boolean, default=True, index=True)
    display_order = Column(Integer, default=0, index=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Optional fields for enhanced service management
    image_url = Column(String(500), nullable=True)
    disclaimer = Column(Text, nullable=True)
    min_guests = Column(Integer, nullable=True)
    max_guests = Column(Integer, nullable=True)
    
    __table_args__ = (
        Index('ix_services_category_popular', 'category', 'is_popular'),
        UniqueConstraint('slug', name='uq_services_slug'),
        CheckConstraint('price_range_max >= price_range_min', 
                       name='check_price_range_valid'),
        CheckConstraint('base_price >= 0', name='check_base_price_positive'),
        CheckConstraint('display_order >= 0', name='check_display_order_non_negative'),
    )


class Testimonial(Base):
    """
    Model for storing client testimonials.
    
    Stores reviews and ratings from clients who have used IGNUX services.
    """
    __tablename__ = "testimonials"
    
    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(100), nullable=False, index=True)
    event_type = Column(String(50), nullable=False, index=True)
    event_date = Column(DateTime, nullable=True, index=True)
    rating = Column(Integer, nullable=False, index=True)
    testimonial = Column(Text, nullable=False)
    is_approved = Column(Boolean, default=False, index=True)
    is_featured = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=func.now(), index=True)
    
    # Optional fields for enhanced testimonials
    client_location = Column(String(100), nullable=True)
    service_used = Column(String(100), nullable=True)
    verified_purchase = Column(Boolean, default=False)
    helpful_votes = Column(Integer, default=0)
    
    __table_args__ = (
        Index('ix_testimonials_rating_approved', 'rating', 'is_approved'),
        Index('ix_testimonials_featured_created', 'is_featured', 'created_at'),
        CheckConstraint('rating >= 1 AND rating <= 5', 
                       name='check_rating_range'),
    )


class NewsletterSubscriber(Base):
    """
    Model for newsletter subscribers.
    
    Stores email addresses of users who have subscribed to the newsletter.
    """
    __tablename__ = "newsletter_subscribers"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(100), nullable=True)
    subscribed_at = Column(DateTime, default=func.now(), index=True)
    unsubscribed_at = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    source = Column(String(50), default="website", index=True)
    
    # GDPR and compliance fields
    consent_given = Column(Boolean, default=True)
    consent_date = Column(DateTime, default=func.now())
    ip_address = Column(String(45), nullable=True)  # Supports IPv6
    user_agent = Column(Text, nullable=True)
    
    # Marketing preferences
    receive_promotions = Column(Boolean, default=True)
    receive_updates = Column(Boolean, default=True)
    
    __table_args__ = (
        Index('ix_subscribers_active_source', 'is_active', 'source'),
        CheckConstraint(
            "unsubscribed_at IS NULL OR unsubscribed_at >= subscribed_at",
            name='check_unsubscribe_date'
        ),
    )
    
    @validates('email')
    def validate_email(self, key: str, email: str) -> str:
        """Validate and normalize email addresses."""
        if '@' not in email:
            raise ValueError("Invalid email address")
        return email.lower().strip()


# Import models to ensure they're registered with Base
__all__ = [
    'Base',
    'Booking',
    'BookingStatus',
    'PaymentStatus',
    'ContactMessage',
    'Service',
    'Testimonial',
    'NewsletterSubscriber',
]