import { useState } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    message: '',
    budget: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        formData,
        'YOUR_PUBLIC_KEY'
      );
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventType: '',
        eventDate: '',
        message: '',
        budget: ''
      });
      
      // Track conversion
      window.gtag('event', 'contact_form_submit', {
        event_category: 'Contact',
        event_label: 'Form Submission'
      });
      
    } catch (error) {
      setSubmitStatus('error');
      console.error('Email send failed:', error);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.form 
      className="contact-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
    >
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
          />
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="+254 7XX XXX XXX"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="eventType">Event Type *</label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
          >
            <option value="">Select event type</option>
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate Event</option>
            <option value="festival">Festival/Concert</option>
            <option value="private">Private Party</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="eventDate">Event Date</label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="budget">Estimated Budget (KES)</label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
          >
            <option value="">Select budget range</option>
            <option value="50000-100000">50,000 - 100,000</option>
            <option value="100000-250000">100,000 - 250,000</option>
            <option value="250000-500000">250,000 - 500,000</option>
            <option value="500000+">500,000+</option>
            <option value="custom">Custom Quote</option>
          </select>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="message">Event Details & Requirements</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="5"
          placeholder="Tell us about your event, venue, specific requirements..."
        />
      </div>
      
      <div className="form-footer">
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Sending...
            </>
          ) : (
            'Get Your Free Quote'
          )}
        </button>
        
        {submitStatus === 'success' && (
          <div className="success-message">
            ✓ Thank you! We'll contact you within 24 hours.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="error-message">
            ✗ Something went wrong. Please try again or contact us directly.
          </div>
        )}
      </div>
    </motion.form>
  );
};

export default ContactForm;