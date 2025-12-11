# app/schemas.py
from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from enum import Enum
import json

class BookingStatusEnum(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PaymentStatusEnum(str, Enum):
    PENDING = "pending"
    PARTIAL = "partial"
    PAID = "paid"
    REFUNDED = "refunded"

# Base Schemas
class BookingBase(BaseModel):
    client_name: str = Field(..., min_length=2, max_length=100)
    client_email: EmailStr
    client_phone: str = Field(..., min_length=10, max_length=20)
    client_address: Optional[str] = None
    
    event_type: str = Field(..., min_length=2, max_length=50)
    event_name: str = Field(..., min_length=2, max_length=100)
    event_date: date
    event_time: str
    event_location: str = Field(..., min_length=5, max_length=200)
    venue_type: str = Field(..., pattern="^(indoor|outdoor|mixed)$")
    expected_guests: Optional[int] = Field(None, gt=0)
    
    service_type: str = Field(..., min_length=2, max_length=50)
    service_package: str = Field(..., min_length=2, max_length=50)
    additional_services: Optional[List[str]] = []
    
    display_duration: str = Field(..., min_length=2, max_length=20)
    display_type: str = Field(..., pattern="^(ground|aerial|mixed)$")
    colors_requested: Optional[str] = None
    music_sync: bool = False
    special_effects: Optional[str] = None
    
    base_price: float = Field(..., gt=0)
    additional_charges: float = 0.0
    discount: float = 0.0
    total_price: float = Field(..., gt=0)
    
    special_instructions: Optional[str] = None
    emergency_contact: Optional[str] = None
    insurance_required: bool = False

class BookingCreate(BookingBase):
    @validator('additional_services')
    def validate_additional_services(cls, v):
        if v:
            return json.dumps(v)
        return None
    
    @validator('special_effects')
    def validate_special_effects(cls, v):
        if v:
            return json.dumps(v)
        return None

class BookingResponse(BookingBase):
    id: int
    booking_status: BookingStatusEnum
    payment_status: PaymentStatusEnum
    deposit_paid: float
    balance_due: float
    created_at: datetime
    confirmed_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    assigned_team_leader: Optional[str] = None
    team_size: int
    permit_required: bool
    permit_obtained: bool
    
    class Config:
        from_attributes = True

class ContactMessageBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=20)
    event_type: str = Field(..., min_length=2, max_length=50)
    event_date: Optional[date] = None
    budget: Optional[str] = None
    message: str = Field(..., min_length=10, max_length=5000)

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessageResponse(ContactMessageBase):
    id: int
    created_at: datetime
    is_read: bool
    responded: bool
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True

class ServiceBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    slug: str = Field(..., min_length=2, max_length=100, pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$")
    category: str = Field(..., min_length=2, max_length=50)
    description: str = Field(..., min_length=10)
    features: Optional[List[str]] = []
    base_price: float = Field(..., gt=0)
    price_range_min: float = Field(..., gt=0)
    price_range_max: float = Field(..., gt=0)
    duration: str = Field(..., min_length=2, max_length=50)
    is_popular: bool = False
    display_order: int = 0

class ServiceCreate(ServiceBase):
    @validator('features')
    def validate_features(cls, v):
        if v:
            return json.dumps(v)
        return None

class ServiceResponse(ServiceBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class TestimonialBase(BaseModel):
    client_name: str = Field(..., min_length=2, max_length=100)
    event_type: str = Field(..., min_length=2, max_length=50)
    event_date: Optional[date] = None
    rating: int = Field(..., ge=1, le=5)
    testimonial: str = Field(..., min_length=10, max_length=2000)

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialResponse(TestimonialBase):
    id: int
    is_approved: bool
    is_featured: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class NewsletterSubscribe(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    source: str = "website"

class WhatsAppMessage(BaseModel):
    phone: str = Field(..., min_length=10, max_length=20)
    message: str = Field(..., min_length=2, max_length=1000)
    template: Optional[str] = None  # quick message template

class QuoteRequest(BaseModel):
    service_type: str
    event_date: Optional[date] = None
    guest_count: Optional[int] = None
    location: str
    duration: str
    special_requests: Optional[str] = None
    contact_email: EmailStr
    contact_phone: str

class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

class StatsResponse(BaseModel):
    total_bookings: int
    pending_bookings: int
    completed_events: int
    total_revenue: float
    services_count: int
    testimonials_count: int
    newsletter_subscribers: int