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
  Calendar,
  Sparkles,
  CheckCircle,
  Navigation,
  Star
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
      <section className="section contact-hero">
        <div className="container">
          <h1 className="section-title">
            Let's Create <span className="gradient-text">Magic</span> Together
          </h1>
          <p className="section-subtitle mb-16">
            Get in touch for a free consultation and quote. We respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section">
        <div className="container">
          <div className="contact-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: 'var(--spacing-12)',
            alignItems: 'start' 
          }}>
            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="feature-card" style={{ marginBottom: 'var(--spacing-8)' }}>
                <h2 className="mb-4">Send us a Message</h2>
                <p className="mb-8 text-left">Fill out the form and we'll get back to you promptly.</p>
                <ContactForm />
              </div>
              
              {formSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="success-message"
                >
                  <MessageSquare className="mr-3" />
                  <div>
                    <h3>Thank You!</h3>
                    <p>We've received your message and will contact you within 24 hours.</p>
                  </div>
                </motion.div>
              )}

              {/* WhatsApp CTA Card */}
              <div className="feature-card mt-8">
                <h3 className="mb-4">Instant Response</h3>
                <p className="mb-6">Need a quick answer? Chat with us on WhatsApp.</p>
                <WhatsAppButton />
                <p className="mt-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <strong>Fast Response:</strong> Average response time: 5 minutes.
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="contact-info-section">
              <h2 className="mb-8">Get in Touch</h2>
              
              {/* Contact Cards */}
              <div className="contact-cards mb-12" style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 'var(--spacing-6)' 
              }}>
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.action}
                    className="service-card"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    target={info.action?.startsWith('http') ? '_blank' : undefined}
                    rel={info.action?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    style={{ 
                      textDecoration: 'none',
                      display: 'block',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="service-icon-wrapper" style={{ marginBottom: 'var(--spacing-4)' }}>
                      <info.icon className="service-icon" />
                    </div>
                    <h3 className="service-title" style={{ fontSize: 'var(--font-size-lg)' }}>
                      {info.title}
                    </h3>
                    {info.details.map((detail, idx) => (
                      <p key={idx} style={{ 
                        fontSize: 'var(--font-size-sm)', 
                        marginBottom: 'var(--spacing-2)',
                        color: 'var(--color-text-secondary)'
                      }}>
                        {detail}
                      </p>
                    ))}
                  </motion.a>
                ))}
              </div>

              {/* Quick Questions */}
              <div className="quick-questions feature-card">
                <h3 className="mb-6">Quick Questions</h3>
                {quickQuestions.map((item, index) => (
                  <div key={index} className="question-item mb-6" style={{
                    borderBottom: '1px solid var(--color-border-light)',
                    paddingBottom: 'var(--spacing-4)'
                  }}>
                    <h4 style={{ 
                      fontSize: 'var(--font-size-base)', 
                      marginBottom: 'var(--spacing-2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)'
                    }}>
                      <CheckCircle size={16} style={{ color: 'var(--color-accent-gold)' }} />
                      {item.question}
                    </h4>
                    <p style={{ 
                      fontSize: 'var(--font-size-sm)', 
                      color: 'var(--color-text-secondary)',
                      marginLeft: 'var(--spacing-6)'
                    }}>
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Trust Signals */}
              <div className="trust-signals mt-8 p-4" style={{
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-border-light)'
              }}>
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles style={{ color: 'var(--color-accent-gold)' }} />
                  <h4 style={{ fontSize: 'var(--font-size-base)' }}>Why Clients Trust Us</h4>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                  <span style={{ 
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-1)'
                  }}>
                    <Star size={12} style={{ color: 'var(--color-accent-gold)' }} />
                    200+ Events
                  </span>
                  <span style={{ 
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-1)'
                  }}>
                    <Star size={12} style={{ color: 'var(--color-accent-gold)' }} />
                    5-Star Reviews
                  </span>
                  <span style={{ 
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-1)'
                  }}>
                    <Star size={12} style={{ color: 'var(--color-accent-gold)' }} />
                    Licensed & Insured
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Process */}
      <section className="section booking-process" style={{ background: 'var(--color-surface)' }}>
        <div className="container">
          <h2 className="section-title">
            Our Booking <span className="gradient-text">Process</span>
          </h2>
          <div className="process-steps" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-8)',
            marginTop: 'var(--spacing-12)'
          }}>
            {[
              {
                number: '1',
                icon: Calendar,
                title: 'Initial Consultation',
                description: 'We discuss your vision, venue, and requirements'
              },
              {
                number: '2',
                icon: MapPin,
                title: 'Site Survey',
                description: 'Venue assessment and safety planning'
              },
              {
                number: '3',
                icon: MessageSquare,
                title: 'Quote & Planning',
                description: 'Detailed proposal and timeline'
              },
              {
                number: '4',
                icon: Clock,
                title: 'Execution',
                description: 'Flawless show delivery'
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="service-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--spark-gradient)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-inverse)',
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-bold)',
                  margin: '0 auto var(--spacing-4)'
                }}>
                  {step.number}
                </div>
                <step.icon className="service-icon" style={{ 
                  color: 'var(--color-accent-orange)',
                  margin: '0 auto var(--spacing-4)'
                }} />
                <h3 className="service-title">{step.title}</h3>
                <p style={{ 
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)'
                }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section map-section">
        <div className="container">
          <h2 className="section-title mb-12">Our Location</h2>
          <div className="service-card" style={{ 
            maxWidth: '600px', 
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <div className="service-icon-wrapper" style={{ margin: '0 auto var(--spacing-6)' }}>
              <Navigation className="service-icon" />
            </div>
            <h3 className="service-title mb-4">Nairobi Office</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2)' }}>
              By appointment only
            </p>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-6)' }}>
              Contact us to schedule a visit
            </p>
            <a 
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button cta-button-outline cta-button-medium"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-2)' }}
            >
              <MapPin size={18} />
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">
            Ready to Discuss Your Event?
          </h2>
          <p className="cta-subtitle">
            Contact us today for a free, no-obligation consultation
          </p>
          <div className="cta-buttons">
            <button 
              onClick={() => window.open('tel:+254750077424')}
              className="cta-button cta-button-primary cta-button-large"
            >
              <Phone size={20} />
              Call Now
            </button>
            <a 
              href="mailto:info@ignux.com"
              className="cta-button cta-button-outline cta-button-large"
            >
              <Mail size={20} />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;