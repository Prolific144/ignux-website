# test_functionality.py
import requests
import json

BASE_URL = "http://localhost:8000"

print("Testing specific functionality...")
print("=" * 50)

# 1. Update booking status
print("\n1. Update booking status:")
response = requests.get(f"{BASE_URL}/api/v1/bookings/")
if response.status_code == 200 and response.json():
    booking_id = response.json()[0]['id']
    
    # Update to confirmed
    update_url = f"{BASE_URL}/api/v1/bookings/{booking_id}/status?status_update=confirmed"
    response = requests.patch(update_url)
    print(f"   Update to 'confirmed': Status {response.status_code}")
    
    # Check updated booking
    response = requests.get(f"{BASE_URL}/api/v1/bookings/{booking_id}")
    if response.status_code == 200:
        booking = response.json()
        print(f"   Booking status now: {booking['booking_status']}")
        print(f"   Confirmed at: {booking['confirmed_at']}")

# 2. Add payment to booking
print("\n2. Add payment to booking:")
if 'booking_id' in locals():
    payment_url = f"{BASE_URL}/api/v1/bookings/{booking_id}/payment?amount=25000"
    response = requests.post(payment_url)
    print(f"   Add KES 25,000 payment: Status {response.status_code}")
    
    # Check updated booking
    response = requests.get(f"{BASE_URL}/api/v1/bookings/{booking_id}")
    if response.status_code == 200:
        booking = response.json()
        print(f"   Deposit paid: KES {booking['deposit_paid']:,.2f}")
        print(f"   Balance due: KES {booking['balance_due']:,.2f}")
        print(f"   Payment status: {booking['payment_status']}")

# 3. Mark contact as read
print("\n3. Manage contact messages:")
response = requests.get(f"{BASE_URL}/api/v1/contacts/")
if response.status_code == 200 and response.json():
    message_id = response.json()[0]['id']
    
    # Mark as read
    read_url = f"{BASE_URL}/api/v1/contacts/{message_id}/mark-read"
    response = requests.post(read_url)
    print(f"   Mark message #{message_id} as read: Status {response.status_code}")
    
    # Add notes
    notes_url = f"{BASE_URL}/api/v1/contacts/{message_id}/notes?notes=Customer%20called%20and%20confirmed%20interest"
    response = requests.post(notes_url)
    print(f"   Add notes to message: Status {response.status_code}")

# 4. Test quick quote
print("\n4. Request quick quote:")
quote_data = {
    "service_type": "wedding",
    "event_date": "2024-12-31",
    "guest_count": 300,
    "location": "Mombasa Beach Resort",
    "duration": "20 minutes",
    "special_requests": "New Year's Eve countdown display",
    "contact_email": "quote@example.com",
    "contact_phone": "+254712345678"
}
response = requests.post(f"{BASE_URL}/api/v1/contacts/quick-quote", json=quote_data)
print(f"   Quick quote request: Status {response.status_code}")

print("\n" + "=" * 50)
print("✅ Functionality tests complete!")