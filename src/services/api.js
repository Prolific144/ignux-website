// src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

class IGNUXApi {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Contact endpoints
  async submitContact(formData) {
    const response = await fetch(`${this.baseURL}/contacts/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit contact form');
    }
    
    return await response.json();
  }

  // Booking endpoints
  async createBooking(bookingData) {
    const response = await fetch(`${this.baseURL}/bookings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create booking');
    }
    
    return await response.json();
  }

  async getBookings(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/bookings/?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }
    
    return await response.json();
  }

  // Services endpoints
  async getServices(category = null) {
    const params = category ? `?category=${category}` : '';
    const response = await fetch(`${this.baseURL}/services/${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    
    return await response.json();
  }

  async getTestimonials(featured = false) {
    const params = featured ? '?featured_only=true' : '';
    const response = await fetch(`${this.baseURL}/services/testimonials/${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch testimonials');
    }
    
    return await response.json();
  }

  // WhatsApp
  generateWhatsAppLink(phone, message, template = null) {
    const data = {
      phone: phone || '+254750077424',
      message: message || "Hello IGNUX! I'm interested in your fireworks services.",
      template: template
    };
    
    return fetch(`${this.baseURL}/contacts/whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => data.data.whatsapp_url);
  }

  // Quick quote
  async requestQuote(quoteData) {
    const response = await fetch(`${this.baseURL}/contacts/quick-quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quoteData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit quote request');
    }
    
    return await response.json();
  }

  // Newsletter
  async subscribeNewsletter(email, name = '') {
    const response = await fetch(`${this.baseURL}/services/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, source: 'website' }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to subscribe to newsletter');
    }
    
    return await response.json();
  }
}

export default new IGNUXApi();