# app/routes/__init__.py
"""
Routes Package

This package contains all API route handlers for the IGNUX application.
Routes are organized by functionality and include proper authentication,
validation, and error handling.

Structure:
- auth.py: Authentication endpoints
- bookings.py: Booking management
- contacts.py: Contact form and communication
- services.py: Service catalog and testimonials
- admin.py: Administrative functions
- payments.py: Payment processing (future)
"""

from app.routes import auth, bookings, contacts, services, admin

__all__ = ["auth", "bookings", "contacts", "services", "admin"]