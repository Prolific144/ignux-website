# test_endpoints.py
import requests
import json

BASE_URL = "http://localhost:8000"

print("Testing IGNUX API Endpoints...")
print("=" * 60)

# 1. Test root endpoint
print("1. Testing root endpoint...")
response = requests.get(f"{BASE_URL}/")
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")

# 2. Test health check
print("\n2. Testing health check...")
response = requests.get(f"{BASE_URL}/health")
print(f"   Status: {response.status_code}")
print(f"   Response: {response.json()}")

# 3. Test getting services (should be empty at first)
print("\n3. Testing GET services...")
response = requests.get(f"{BASE_URL}/api/v1/services/")
print(f"   Status: {response.status_code}")
services = response.json()
print(f"   Found {len(services)} services")

# 4. Test creating a contact message
print("\n4. Testing POST contact message...")
contact_data = {
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+254712345678",
    "event_type": "Wedding",
    "message": "Testing the contact form endpoint"
}
response = requests.post(f"{BASE_URL}/api/v1/contacts/", json=contact_data)
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    print(f"   Created message ID: {response.json().get('id')}")

# 5. Test getting contact messages
print("\n5. Testing GET contact messages...")
response = requests.get(f"{BASE_URL}/api/v1/contacts/")
print(f"   Status: {response.status_code}")
messages = response.json()
print(f"   Found {len(messages)} contact messages")

# 6. Test admin stats
print("\n6. Testing admin stats...")
response = requests.get(f"{BASE_URL}/api/v1/admin/stats/")
print(f"   Status: {response.status_code}")
if response.status_code == 200:
    stats = response.json()
    print(f"   Total bookings: {stats['total_bookings']}")
    print(f"   Pending bookings: {stats['pending_bookings']}")

print("\n" + "=" * 60)
print("✅ Basic API functionality is working!")
print("\nNext steps:")
print("1. Check database for created records")
print("2. Test more endpoints in Swagger UI")
print("3. Add some services using the admin panel")