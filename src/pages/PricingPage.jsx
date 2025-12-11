import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  X, 
  Sparkles,
  Star,
  Zap,
  Crown
} from 'lucide-react';
import CTAButton from '../components/Shared/CTAButton';

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('one-time');

  const packages = [
    {
      name: 'Starter',
      icon: Sparkles,
      price: '80,000',
      period: 'one-time',
      description: 'Perfect for intimate gatherings and small celebrations',
      features: [
        'Up to 5-minute display',
        'Basic fireworks selection',
        'Safety setup included',
        'On-site technician',
        'Venue survey',
        'Basic synchronization'
      ],
      notIncluded: [
        'Custom colors',
        'Music synchronization',
        'Extended duration',
        'Large shells'
      ],
      bestFor: 'Birthdays, anniversaries, small parties'
    },
    {
      name: 'Premium',
      icon: Star,
      price: '250,000',
      period: 'one-time',
      description: 'Our most popular package for memorable events',
      features: [
        '10-15 minute display',
        'Wide fireworks selection',
        'Custom colors available',
        'Music synchronization',
        'Two technicians',
        'Advanced planning',
        'Weather insurance',
        'Backup equipment'
      ],
      notIncluded: [
        'Extremely large shells',
        'Multiple launch points',
        'Full-day operation'
      ],
      bestFor: 'Weddings, corporate events, medium festivals',
      popular: true
    },
    {
      name: 'Platinum',
      icon: Crown,
      price: '500,000+',
      period: 'one-time',
      description: 'Ultimate experience for large-scale spectaculars',
      features: [
        '20-30 minute spectacular',
        'Full custom design',
        'Multiple launch points',
        'Professional choreography',
        'Dedicated project manager',
        'Full crew (5+ technicians)',
        'Premium fireworks only',
        '24/7 support',
        'Drone show option',
        'Brand integration'
      ],
      notIncluded: [],
      bestFor: 'Large festivals, concerts, major corporate events'
    }
  ];

  const addons = [
    { name: 'Music Synchronization', price: '15,000' },
    { name: 'Custom Colors', price: '20,000' },
    { name: 'Extended Duration (per 5min)', price: '30,000' },
    { name: 'Drone Light Show', price: '100,000' },
    { name: 'Indoor Pyrotechnics', price: '25,000' },
    { name: 'Same-day Setup', price: '40,000' }
  ];

  const faqs = [
    {
      question: 'What factors affect pricing?',
      answer: 'Duration, complexity, location, type of fireworks, crew size, and special requirements like music synchronization or custom colors.'
    },
    {
      question: 'Do you offer discounts for non-profits?',
      answer: 'Yes, we offer special rates for registered non-profit organizations and charitable events.'
    },
    {
      question: 'Is there a minimum booking amount?',
      answer: 'Our Starter package starts at KES 80,000 for basic displays.'
    },
    {
      question: 'How far in advance should I book?',
      answer: 'We recommend booking at least 1-2 months in advance, especially for wedding seasons and holidays.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Pricing | IGNUX - Transparent Packages</title>
        <meta name="description" content="Transparent pricing packages for fireworks displays and stage FX services in Kenya. Starting from KES 80,000." />
      </Helmet>

      {/* Hero */}
      <section className="pricing-hero">
        <div className="container">
          <h1 className="section-title">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h1>
          <p className="section-subtitle">
            Choose the perfect package for your event. All prices include safety setup and professional execution.
          </p>
          
          {/* Billing Toggle */}
          <div className="billing-toggle">
            <div className="toggle-container">
              <span className={`toggle-option ${billingPeriod === 'one-time' ? 'active' : ''}`}>
                One-Time Event
              </span>
              <span className={`toggle-option ${billingPeriod === 'recurring' ? 'active' : ''}`}>
                Recurring Events
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section">
        <div className="container">
          <div className="packages-grid">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                className={`package-card ${pkg.popular ? 'popular' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {pkg.popular && (
                  <div className="popular-badge">Most Popular</div>
                )}
                
                <div className="package-header">
                  <pkg.icon className="package-icon" />
                  <h3>{pkg.name}</h3>
                  <div className="package-price">
                    <span className="currency">KES</span>
                    <span className="amount">{pkg.price}</span>
                    {pkg.name !== 'Platinum' && (
                      <span className="period">/one-time</span>
                    )}
                  </div>
                  <p className="package-description">{pkg.description}</p>
                </div>

                <div className="package-features">
                  <h4>What's Included:</h4>
                  <ul>
                    {pkg.features.map((feature, idx) => (
                      <li key={idx}>
                        <Check className="feature-check" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {pkg.notIncluded.length > 0 && (
                    <>
                      <h4>Not Included:</h4>
                      <ul className="not-included">
                        {pkg.notIncluded.map((item, idx) => (
                          <li key={idx}>
                            <X className="feature-x" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <div className="best-for">
                    <Zap className="best-for-icon" />
                    <span><strong>Best for:</strong> {pkg.bestFor}</span>
                  </div>
                </div>

                <div className="package-cta">
                  <CTAButton
                    text={pkg.name === 'Platinum' ? 'Get Custom Quote' : 'Select Package'}
                    variant={pkg.popular ? 'primary' : 'outline'}
                    size="large"
                    href="/contact"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Addons */}
      <section className="section addons-section">
        <div className="container">
          <h2 className="section-title">
            Additional <span className="gradient-text">Add-ons</span>
          </h2>
          <p className="section-subtitle">
            Enhance your package with these optional features
          </p>
          <div className="addons-grid">
            {addons.map((addon, index) => (
              <div key={index} className="addon-card">
                <h4>{addon.name}</h4>
                <div className="addon-price">KES {addon.price}</div>
                <button className="addon-button">
                  Add to Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section faq-section">
        <div className="container">
          <h2 className="section-title">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Quote CTA */}
      <section className="section custom-quote-section">
        <div className="container">
          <div className="custom-quote-card">
            <h2>Need a Custom Quote?</h2>
            <p>
              Contact us for personalized pricing for unique requirements, 
              multiple events, or special circumstances.
            </p>
            <div className="quote-buttons">
              <CTAButton
                text="Request Custom Quote"
                variant="primary"
                size="large"
                href="/contact"
              />
              <CTAButton
                text="Call for Immediate Quote"
                variant="outline"
                size="large"
                href="tel:+254750077424"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PricingPage;