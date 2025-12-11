import { Helmet } from 'react-helmet-async';
import ServiceCard from '../components/Services/ServiceCard';
import CTAButton from '../components/Shared/CTAButton';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  Music,
  Building
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

  return (
    <>
      <Helmet>
        <title>Services | IGNUX - Fireworks & Stage FX</title>
        <meta name="description" content="Complete pyrotechnic services for weddings, corporate events, festivals, and private parties across Kenya." />
      </Helmet>

      {/* Hero */}
      <section className="services-hero">
        <div className="container">
          <h1 className="section-title">
            Our <span className="gradient-text">Services</span>
          </h1>
          <p className="section-subtitle">
            From intimate celebrations to large-scale festivals, we provide 
            professional pyrotechnic solutions tailored to your event.
          </p>
        </div>
      </section>

      {/* All Services */}
      <section className="section">
        <div className="container">
          <div className="services-grid">
            {allServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section process-section">
        <div className="container">
          <h2 className="section-title">
            Our <span className="gradient-text">Process</span>
          </h2>
          <div className="process-steps">
            {processSteps.map((step, index) => (
              <div key={index} className="process-step">
                <div className="step-number">{index + 1}</div>
                <div className="step-icon-wrapper">
                  <step.icon className="step-icon" />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
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
          <div className="additional-services">
            <div className="additional-service">
              <Music className="service-icon" />
              <h3>Music Synchronization</h3>
              <p>Fireworks perfectly timed to your soundtrack</p>
            </div>
            <div className="additional-service">
              <Building className="service-icon" />
              <h3>Indoor Pyrotechnics</h3>
              <p>Safe indoor effects for venue celebrations</p>
            </div>
            <div className="additional-service">
              <Users className="service-icon" />
              <h3>Training & Workshops</h3>
              <p>Pyrotechnic safety and operation training</p>
            </div>
          </div>
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
            <CTAButton 
              text="Request Quote" 
              variant="primary" 
              size="large"
              href="/contact"
            />
            <CTAButton 
              text="Call: +254 750 077 424" 
              variant="outline"
              size="large"
              href="tel:+254750077424"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;