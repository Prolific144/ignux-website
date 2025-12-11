import ServiceCard from '../Services/ServiceCard';
import CTAButton from '../Shared/CTAButton';

const services = [
  {
    category: 'weddings',
    title: 'Wedding Pyrotechnics',
    description: 'Create magical moments with breathtaking fireworks displays for your special day.',
    features: ['Grand finale displays', 'Sparkler send-offs', 'Indoor pyrotechnics', 'Custom colors'],
    startingPrice: '150,000'
  },
  {
    category: 'corporate',
    title: 'Corporate Events',
    description: 'Make your product launches, galas, and celebrations unforgettable.',
    features: ['Brand-colored displays', 'Synchronized shows', 'Stage pyro effects', 'LED wall integration'],
    startingPrice: '250,000'
  },
  {
    category: 'festivals',
    title: 'Festivals & Concerts',
    description: 'Large-scale pyrotechnic shows that wow crowds and create viral moments.',
    features: ['High-altitude shells', 'Synchronized to music', 'Multi-point firing', 'Professional planning'],
    startingPrice: '500,000'
  }
];

const ServicesPreview = () => {
  return (
    <section className="section">
      <div className="container">
        <h2 className="section-title">
          Our <span className="gradient-text">Services</span>
        </h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
        <div className="text-center mt-12">
          <CTAButton 
            text="View All Services" 
            variant="outline" 
            size="large"
            href="/services"
            icon="arrow"
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;