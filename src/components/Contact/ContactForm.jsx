
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const ContactForm = ({ onSuccess }) => {
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
    setSubmitStatus(null);
    
    try {
      // Replace with your actual EmailJS credentials
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        onSuccess?.();
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          message: '',
          budget: ''
        });
        
        // Analytics tracking
        if (window.gtag) {
          window.gtag('event', 'contact_form_submit', {
            event_category: 'Contact',
            event_label: 'Form Submission'
          });
        }
      } else {
        throw new Error('Submission failed');
      }
      
    } catch (error) {
      setSubmitStatus('error');
      console.error('Form submission failed:', error);
    } finally {
      setIsSubmitting(false);
      // Auto-clear success/error messages after 5 seconds
      if (submitStatus) {
        setTimeout(() => setSubmitStatus(null), 5000);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhoneInput = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    
    if (value.length > 0) {
      formattedValue = '+254 ';
      if (value.length > 3) {
        formattedValue += value.slice(3, 6) + ' ';
        if (value.length > 6) {
          formattedValue += value.slice(6, 9) + ' ';
          if (value.length > 9) {
            formattedValue += value.slice(9, 12);
          } else {
            formattedValue += value.slice(6);
          }
        } else {
          formattedValue += value.slice(3);
        }
      } else {
        formattedValue += value.slice(3);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      phone: formattedValue
    }));
  };

  const eventTypes = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'corporate', label: 'Corporate Event' },
    { value: 'festival', label: 'Festival / Concert' },
    { value: 'private', label: 'Private Party' },
    { value: 'birthday', label: 'Birthday Celebration' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'launch', label: 'Product Launch' },
    { value: 'other', label: 'Other' }
  ];

  const budgetRanges = [
    { value: '50000-100000', label: 'KES 50,000 - 100,000' },
    { value: '100000-250000', label: 'KES 100,000 - 250,000' },
    { value: '250000-500000', label: 'KES 250,000 - 500,000' },
    { value: '500000-1000000', label: 'KES 500,000 - 1,000,000' },
    { value: '1000000+', label: 'KES 1,000,000+' },
    { value: 'custom', label: 'Need Custom Quote' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="feature-card" style={{ marginBottom: 'var(--spacing-4)' }}>
        <h3 className="service-title mb-2">Get Your Free Quote</h3>
        <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
          Fill out the form below and we'll get back to you within 24 hours
        </p>
      </div>

      <form 
        className="contact-form"
        onSubmit={handleSubmit}
      >
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="form-input"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className="form-input"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="phone" className="form-label">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneInput}
              required
              placeholder="+254 7XX XXX XXX"
              className="form-input"
              disabled={isSubmitting}
              pattern="^\+254\s[0-9]{3}\s[0-9]{3}\s[0-9]{3}$"
            />
            <small className="form-hint">
              Enter in format: +254 7XX XXX XXX
            </small>
          </div>
          
          <div className="form-group">
            <label htmlFor="eventType" className="form-label">
              Event Type *
            </label>
            <select
              id="eventType"
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
              className="form-select"
              disabled={isSubmitting}
            >
              <option value="">Select event type</option>
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="eventDate" className="form-label">
              Event Date
            </label>
            <input
              type="date"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className="form-input"
              disabled={isSubmitting}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="budget" className="form-label">
              Estimated Budget
            </label>
            <select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              className="form-select"
              disabled={isSubmitting}
            >
              <option value="">Select budget range</option>
              {budgetRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Event Details & Requirements *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Tell us about your event, venue, specific requirements, theme, number of guests, and any special requests..."
            className="form-textarea"
            disabled={isSubmitting}
          />
          <small className="form-hint">
            Please include venue location, number of guests, and any specific fireworks effects you're interested in.
          </small>
        </div>

        {/* Form Footer */}
        <div className="form-footer">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <Send size={18} />
                Get Your Free Quote
              </>
            )}
          </button>
          
          <p className="form-disclaimer" style={{ 
            fontSize: 'var(--font-size-xs)', 
            color: 'var(--color-text-tertiary)',
            marginTop: 'var(--spacing-3)',
            textAlign: 'center'
          }}>
            By submitting, you agree to our <a href="/privacy" style={{ color: 'var(--color-accent-orange)' }}>Privacy Policy</a>.
            We'll never share your information with third parties.
          </p>
        </div>
      </form>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="success-message"
        >
          <CheckCircle className="mr-3" size={24} />
          <div>
            <h4 style={{ marginBottom: 'var(--spacing-1)' }}>Thank You!</h4>
            <p style={{ marginBottom: 0 }}>
              We've received your inquiry and will contact you within 24 hours.
              Check your email for confirmation.
            </p>
          </div>
        </motion.div>
      )}
      
      {submitStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="error-message"
        >
          <AlertCircle className="mr-3" size={24} />
          <div>
            <h4 style={{ marginBottom: 'var(--spacing-1)' }}>Submission Failed</h4>
            <p style={{ marginBottom: 0 }}>
              Please try again or contact us directly at info@ignux.com
            </p>
          </div>
        </motion.div>
      )}

      {/* Trust Indicators */}
      <div className="trust-indicators" style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--spacing-4)',
        marginTop: 'var(--spacing-8)',
        padding: 'var(--spacing-4)',
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-light)'
      }}>
        <div className="trust-item" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: 'var(--color-accent-gold)',
            borderRadius: '50%'
          }}></div>
          <span style={{ fontSize: 'var(--font-size-xs)' }}>24-Hour Response</span>
        </div>
        <div className="trust-item" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: 'var(--color-accent-gold)',
            borderRadius: '50%'
          }}></div>
          <span style={{ fontSize: 'var(--font-size-xs)' }}>No Spam, Ever</span>
        </div>
        <div className="trust-item" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            background: 'var(--color-accent-gold)',
            borderRadius: '50%'
          }}></div>
          <span style={{ fontSize: 'var(--font-size-xs)' }}>Free Consultation</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactForm;