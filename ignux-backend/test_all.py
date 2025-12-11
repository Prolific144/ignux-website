# test_all.py
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def print_test_result(name, success, details=""):
    icon = "✅" if success else "❌"
    print(f"{icon} {name}: {details}")

print("=" * 60)
print("COMPREHENSIVE IGNUX API TEST")
print("=" * 60)

# 1. Test root endpoint
print("\n1. Basic Endpoints:")
response = requests.get(f"{BASE_URL}/")
print_test_result("Root endpoint", response.status_code == 200, f"Status: {response.status_code}")

response = requests.get(f"{BASE_URL}/health")
print_test_result("Health check", response.status_code == 200, f"Status: {response.status_code}")

# 2. Test services
print("\n2. Services:")
response = requests.get(f"{BASE_URL}/api/v1/services/")
services = response.json()
print_test_result("Get services", response.status_code == 200, f"Status: {response.status_code}, Found: {len(services)} services")

# 3. Test bookings
print("\n3. Bookings:")
response = requests.get(f"{BASE_URL}/api/v1/bookings/")
bookings = response.json()
print_test_result("Get bookings", response.status_code == 200, f"Status: {response.status_code}, Found: {len(bookings)} bookings")

# Get specific booking
if bookings:
    booking_id = bookings[0]['id']
    response = requests.get(f"{BASE_URL}/api/v1/bookings/{booking_id}")
    print_test_result(f"Get booking #{booking_id}", response.status_code == 200, f"Status: {response.status_code}")

# 4. Test contacts
print("\n4. Contact Messages:")
contact_data = {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+254712345678",
    "event_type": "Corporate",
    "message": "Testing the contact form API"
}
response = requests.post(f"{BASE_URL}/api/v1/contacts/", json=contact_data)
if response.status_code == 200:
    contact_id = response.json()['id']
    print_test_result("Create contact", True, f"Created message ID: {contact_id}")
else:
    print_test_result("Create contact", False, f"Status: {response.status_code}")

response = requests.get(f"{BASE_URL}/api/v1/contacts/")
contacts = response.json()
print_test_result("Get contacts", response.status_code == 200, f"Status: {response.status_code}, Found: {len(contacts)} messages")

# 5. Test testimonials
print("\n5. Testimonials:")
testimonial_data = {
    "client_name": "Happy Client",
    "event_type": "Wedding",
    "rating": 5,
    "testimonial": "Amazing fireworks display! Everything was perfect."
}
response = requests.post(f"{BASE_URL}/api/v1/services/testimonials/", json=testimonial_data)
print_test_result("Create testimonial", response.status_code == 200, f"Status: {response.status_code}")

response = requests.get(f"{BASE_URL}/api/v1/services/testimonials/")
testimonials = response.json()
print_test_result("Get testimonials", response.status_code == 200, f"Status: {response.status_code}, Found: {len(testimonials)} testimonials")

# 6. Test newsletter
print("\n6. Newsletter:")
newsletter_data = {
    "email": "subscriber@example.com",
    "name": "Newsletter Subscriber"
}
response = requests.post(f"{BASE_URL}/api/v1/services/newsletter/subscribe", json=newsletter_data)
print_test_result("Subscribe newsletter", response.status_code == 200, f"Status: {response.status_code}")

# 7. Test admin stats
print("\n7. Admin Dashboard:")
response = requests.get(f"{BASE_URL}/api/v1/admin/stats/")
if response.status_code == 200:
    stats = response.json()
    print_test_result("Get admin stats", True, f"Status: {response.status_code}")
    print(f"   📊 Stats:")
    print(f"   - Total bookings: {stats['total_bookings']}")
    print(f"   - Pending bookings: {stats['pending_bookings']}")
    print(f"   - Completed events: {stats['completed_events']}")
    print(f"   - Total revenue: KES {stats['total_revenue']:,.2f}")
    print(f"   - Services: {stats['services_count']}")
    print(f"   - Testimonials: {stats['testimonials_count']}")
    print(f"   - Subscribers: {stats['newsletter_subscribers']}")
else:
    print_test_result("Get admin stats", False, f"Status: {response.status_code}")

# 8. Test WhatsApp endpoint
print("\n8. WhatsApp Integration:")
whatsapp_data = {
    "phone": "+254712345678",
    "message": "Hello IGNUX, I need information about wedding fireworks packages.",
    "template": "service_inquiry"
}
response = requests.post(f"{BASE_URL}/api/v1/contacts/whatsapp", json=whatsapp_data)
print_test_result("WhatsApp message", response.status_code == 200, f"Status: {response.status_code}")

print("\n" + "=" * 60)
print("TEST COMPLETE!")
print("=" * 60)