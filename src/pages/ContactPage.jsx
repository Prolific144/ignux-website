import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ContactForm from '../components/Contact/ContactForm';
import WhatsAppButton from '../components/Contact/WhatsAppButton';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageSquare,
  Calendar
} from 'lucide-react';

const ContactPage = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+254 750 077 424', '+254 722 123 456'],
      action: 'tel:+254750077424'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['info@ignux.com', 'bookings@ignux.com'],
      action: 'mailto:info@ignux.com'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['Nairobi Office', 'By appointment only'],
      action: 'https://maps.google.com'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Fri: 8:00 AM - 6:00 PM', 'Sat: 9:00 AM - 4:00 PM', 'Emergency: 24/7']
    }
  ];

  const quickQuestions = [
    {
      question: 'How soon should I book?',
      answer: 'At least 1 month in advance for best availability.'
    },
    {
      question: 'Do you travel outside Nairobi?',
      answer: 'Yes, we serve all major cities in Kenya.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'Bank transfer, M-Pesa, and credit cards.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us | IGNUX - Get a Quote</title>
        <meta name="description" content="Contact IGNUX for fireworks and stage FX services in Kenya. Get a free quote for your event today." />
      </Helmet>

      {/* Hero */}
      <section className="contact-hero">
        <div className="container">
          <h1 className="section-title">
            Let's Create <span className="gradient-text">Magic</span> Together
          </h1>
          <p className="section-subtitle">
            Get in touch for a free consultation and quote. We respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <h2>Send us a Message</h2>
              <p>Fill out the form and we'll get back to you promptly.</p>
              <ContactForm onSuccess={() => setFormSubmitted(true)} />
              
              {formSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="success-message"
                >
                  <MessageSquare className="success-icon" />
                  <div>
                    <h3>Thank You!</h3>
                    <p>We've received your message and will contact you within 24 hours.</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              <h2>Get in Touch</h2>
              
              {/* Contact Cards */}
              <div className="contact-cards">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.action}
                    className="contact-card"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    target={info.action?.startsWith('http') ? '_blank' : undefined}
                    rel={info.action?.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <info.icon className="contact-card-icon" />
                    <div>
                      <h3>{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx}>{detail}</p>
                      ))}
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="whatsapp-cta">
                <WhatsAppButton />
                <p className="whatsapp-note">
                  <strong>Prefer instant chat?</strong> Click above to message us directly on WhatsApp. 
                  Average response time: 5 minutes.
                </p>
              </div>

              {/* Quick Questions */}
              <div className="quick-questions">
                <h3>Quick Questions</h3>
                {quickQuestions.map((item, index) => (
                  <div key={index} className="question-item">
                    <h4>{item.question}</h4>
                    <p>{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Process */}
      <section className="section booking-process">
        <div className="container">
          <h2 className="section-title">
            Our Booking <span className="gradient-text">Process</span>
          </h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <Calendar className="step-icon" />
              <h3>Initial Consultation</h3>
              <p>We discuss your vision, venue, and requirements</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <MapPin className="step-icon" />
              <h3>Site Survey</h3>
              <p>Venue assessment and safety planning</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <MessageSquare className="step-icon" />
              <h3>Quote & Planning</h3>
              <p>Detailed proposal and timeline</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <Clock className="step-icon" />
              <h3>Execution</h3>
              <p>Flawless show delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="section map-section">
        <div className="container">
          <h2 className="section-title">Our Location</h2>
          <div className="map-placeholder">
            <div className="map-content">
              <MapPin className="map-icon" />
              <h3>Nairobi Office</h3>
              <p>By appointment only</p>
              <p>Contact us to schedule a visit</p>
              <button className="map-button">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;