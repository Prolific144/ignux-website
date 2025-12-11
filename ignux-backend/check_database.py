# check_db.py
from app.database import SessionLocal
from app.models import ContactMessage, Booking, Service, Testimonial

db = SessionLocal()

print("=== Database Status ===")
print(f"Contact Messages: {db.query(ContactMessage).count()}")
print(f"Bookings: {db.query(Booking).count()}")
print(f"Services: {db.query(Service).count()}")
print(f"Testimonials: {db.query(Testimonial).count()}")

# Show recent bookings
bookings = db.query(Booking).order_by(Booking.created_at.desc()).limit(3).all()
print("\n=== Recent Bookings ===")
for b in bookings:
    print(f"ID: {b.id}, Client: {b.client_name}, Event: {b.event_name}")

db.close()