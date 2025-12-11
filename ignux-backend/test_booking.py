# test_booking.py
import requests
import json

BASE_URL = "http://localhost:8000"

# Correct booking data that matches the schema
booking_data = {
    "client_name": "John Doe",
    "client_email": "john@example.com",
    "client_phone": "+254712345678",
    "client_address": "Nairobi, Kenya",
    "event_type": "wedding",
    "event_name": "John & Jane Wedding",
    "event_date": "2024-12-25",
    "event_time": "18:00",
    "event_location": "Nairobi Garden Hotel",
    "venue_type": "outdoor",  # Must be: indoor, outdoor, or mixed
    "expected_guests": 200,
    "service_type": "wedding",
    "service_package": "premium",
    "additional_services": [],
    "display_duration": "15 minutes",
    "display_type": "mixed",  # Must be: ground, aerial, or mixed
    "colors_requested": "Red, Gold, White",
    "music_sync": True,
    "special_effects": None,
    "base_price": 75000.0,
    "additional_charges": 5000.0,
    "discount": 5000.0,
    "total_price": 75000.0,
    "special_instructions": "Please arrive 2 hours before",
    "emergency_contact": "+254712345679",
    "insurance_required": True
}

print("Testing booking creation...")
print("=" * 50)

try:
    response = requests.post(f"{BASE_URL}/api/v1/bookings/", json=booking_data)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        print("✅ Booking created successfully!")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    elif response.status_code == 422:
        print("❌ Validation Error!")
        print(f"Error details: {json.dumps(response.json(), indent=2)}")
    else:
        print(f"Unexpected status: {response.status_code}")
        print(f"Response: {response.text}")
        
except Exception as e:
    print(f"Error: {e}")