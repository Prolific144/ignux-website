import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  Music,
  Building,
  Sparkles,
  CheckCircle,
  Star
} from 'lucide-react';

const ServicesPage = () => {
  const allServices = [
    {
      category: 'weddings',
      title: 'Wedding Pyrotechnics',
      description: 'Create magical moments with breathtaking fireworks displays for your special day.',
      features: [
        'Grand finale displays',
        'Sparkler send-offs',
        'Indoor pyrotechnics',
        'Custom colors matching theme',
        'Synchronized to first dance',
        'Photo-friendly timing'
      ],
      startingPrice: '150,000'
    },
    {
      category: 'corporate',
      title: 'Corporate Events',
      description: 'Make your product launches, galas, and celebrations unforgettable.',
      features: [
        'Brand-colored displays',
        'Synchronized shows',
        'Stage pyro effects',
        'LED wall integration',
        'Company logo reveals',
        'Team building activities'
      ],
      startingPrice: '250,000'
    },
    {
      category: 'festivals',
      title: 'Festivals & Concerts',
      description: 'Large-scale pyrotechnic shows that wow crowds and create viral moments.',
      features: [
        'High-altitude shells',
        'Synchronized to music',
        'Multi-point firing',
        'Professional planning',
        'Crowd safety management',
        'Weather contingency'
      ],
      startingPrice: '500,000'
    },
    {
      category: 'private',
      title: 'Private Parties',
      description: 'Intimate displays for birthdays, anniversaries, and special celebrations.',
      features: [
        'Small-scale displays',
        'Garden fireworks',
        'Cake sparklers',
        'Personalized shows',
        'Quiet options available',
        'Quick setup'
      ],
      startingPrice: '80,000'
    }
  ];

  const processSteps = [
    {
      icon: Calendar,
      title: 'Consultation',
      description: 'We discuss your vision, venue, and requirements'
    },
    {
      icon: MapPin,
      title: 'Site Survey',
      description: 'Our team visits the venue for safety assessment'
    },
    {
      icon: Clock,
      title: 'Planning',
      description: 'Custom design and timeline creation'
    },
    {
      icon: Users,
      title: 'Execution',
      description: 'Professional setup and flawless show delivery'
    }
  ];

  const additionalServices = [
    {
      icon: Music,
      title: 'Music Synchronization',
      description: 'Fireworks perfectly timed to your soundtrack'
    },
    {
      icon: Building,
      title: 'Indoor Pyrotechnics',
      description: 'Safe indoor effects for venue celebrations'
    },
    {
      icon: Users,
      title: 'Training & Workshops',
      description: 'Pyrotechnic safety and operation training'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Services | IGNUX - Fireworks & Stage FX</title>
        <meta name="description" content="Complete pyrotechnic services for weddings, corporate events, festivals, and private parties across Kenya." />
      </Helmet>

      {/* Hero */}
      <section className="section services-hero" style={{
        background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.1) 0%, rgba(0, 180, 255, 0.1) 100%)',
        paddingTop: 'var(--spacing-20)',
        paddingBottom: 'var(--spacing-12)'
      }}>
        <div className="container">
          <h1 className="section-title">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="section-subtitle" style={{
            maxWidth: '800px',
            margin: '0 auto',
            fontSize: 'var(--font-size-xl)',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6'
          }}>
            From intimate celebrations to large-scale festivals, we provide 
            professional pyrotechnic solutions tailored to your event.
          </p>
        </div>
      </section>

      {/* All Services */}
      <section className="section">
        <div className="container">
          <h2 className="section-title mb-12">
            Complete <span className="gradient-text">Service Portfolio</span>
          </h2>
          
          <div className="services-grid">
            {allServices.map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="service-icon-wrapper" style={{ marginBottom: 'var(--spacing-6)' }}>
                  <Sparkles className="service-icon" />
                </div>
                
                <div style={{
                  display: 'inline-block',
                  background: 'var(--spark-gradient)',
                  padding: 'var(--spacing-1) var(--spacing-3)',
                  borderRadius: 'var(--radius-full)',
                  marginBottom: 'var(--spacing-4)'
                }}>
                  <span style={{
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-text-inverse)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {service.category}
                  </span>
                </div>
                
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                
                <div className="service-features" style={{ margin: 'var(--spacing-6) 0' }}>
                  <h4 style={{
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-semibold)',
                    marginBottom: 'var(--spacing-3)',
                    color: 'var(--color-text-primary)'
                  }}>
                    What's Included:
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="feature-item">
                        <CheckCircle size={16} className="feature-check" />
                        <span style={{ fontSize: 'var(--font-size-sm)' }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="service-footer">
                  <div className="starting-price">
                    <span style={{ fontSize: 'var(--font-size-sm)' }}>Starting from</span>
                    <div className="price">KES {service.startingPrice}</div>
                  </div>
                  <button 
                    className="inquiry-button"
                    onClick={() => window.location.href = `/contact?service=${service.category}`}
                  >
                    Get Quote
                    <span className="button-arrow">→</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section process-section" style={{
        background: 'var(--color-surface)'
      }}>
        <div className="container">
          <h2 className="section-title">
            Our <span className="gradient-text">Process</span>
          </h2>
          <p className="text-center mb-12" style={{
            maxWidth: '700px',
            margin: '0 auto',
            fontSize: 'var(--font-size-lg)',
            color: 'var(--color-text-secondary)'
          }}>
            From initial consultation to final execution, we ensure a seamless experience
          </p>
          
          <div className="process-steps" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-8)',
            marginTop: 'var(--spacing-12)'
          }}>
            {processSteps.map((step, index) => (
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
                  position: 'relative',
                  width: '80px',
                  height: '80px',
                  margin: '0 auto var(--spacing-6)'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '40px',
                    height: '40px',
                    background: 'var(--spark-gradient)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-inverse)',
                    fontWeight: 'var(--font-weight-bold)',
                    fontSize: 'var(--font-size-xl)'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    background: 'var(--color-surface-alt)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <step.icon className="service-icon" style={{ color: 'var(--color-accent-orange)' }} />
                  </div>
                </div>
                
                <h3 className="service-title" style={{ fontSize: 'var(--font-size-xl)' }}>
                  {step.title}
                </h3>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-sm)',
                  marginTop: 'var(--spacing-2)'
                }}>
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">
            Additional <span className="gradient-text">Offerings</span>
          </h2>
          
          <div className="additional-services" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--spacing-8)',
            marginTop: 'var(--spacing-12)'
          }}>
            {additionalServices.map((service, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'var(--spark-gradient)',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--spacing-4)'
                }}>
                  <service.icon className="service-icon" style={{ color: 'var(--color-text-inverse)' }} />
                </div>
                
                <h3 style={{
                  fontSize: 'var(--font-size-xl)',
                  textAlign: 'center',
                  marginBottom: 'var(--spacing-3)'
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: 'var(--color-text-secondary)',
                  textAlign: 'center',
                  fontSize: 'var(--font-size-sm)',
                  marginBottom: 0
                }}>
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, rgba(0, 180, 255, 0.05) 0%, rgba(255, 107, 0, 0.05) 100%)'
      }}>
        <div className="container">
          <h2 className="section-title">
            Why <span className="gradient-text">Choose IGNUX</span>
          </h2>
          
          <div className="features-grid" style={{ marginTop: 'var(--spacing-12)' }}>
            {[
              {
                icon: '🛡️',
                title: '100% Safety First',
                description: 'Licensed professionals with comprehensive insurance'
              },
              {
                icon: '🎯',
                title: 'Precision Timing',
                description: 'Flawless execution with perfect synchronization'
              },
              {
                icon: '🎨',
                title: 'Custom Designs',
                description: 'Tailored displays to match your event theme'
              },
              {
                icon: '⏱️',
                title: 'On-Time Delivery',
                description: 'Never miss a beat with our punctual service'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="feature-icon" style={{ fontSize: '3rem' }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Stats Bar */}
          <motion.div 
            className="stats-bar"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginTop: 'var(--spacing-16)' }}
          >
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">Events</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Safety Record</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">
            Ready to Plan Your Spectacular Event?
          </h2>
          <p className="cta-subtitle">
            Get a personalized quote for your specific needs.
          </p>
          <div className="cta-buttons">
            <button 
              className="cta-button cta-button-primary cta-button-large"
              onClick={() => window.location.href = '/contact'}
            >
              <Calendar size={20} />
              Request Quote
            </button>
            <a 
              href="tel:+254750077424"
              className="cta-button cta-button-outline cta-button-large"
            >
              <Star size={20} />
              Call: +254 750 077 424
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;