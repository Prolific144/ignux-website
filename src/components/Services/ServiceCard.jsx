import { motion } from 'framer-motion';
import { Sparkles, Calendar, Users, Building } from 'lucide-react';

const ServiceCard = ({ service }) => {
  const icons = {
    weddings: Sparkles,
    corporate: Building,
    festivals: Users,
    private: Calendar,
  };
  
  const Icon = icons[service.category];
  
  return (
    <motion.div 
      className="service-card"
      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(255, 107, 0, 0.2)' }}
      transition={{ duration: 0.3 }}
    >
      <div className="service-icon-wrapper">
        <Icon className="service-icon" />
      </div>
      
      <h3 className="service-title">{service.title}</h3>
      <p className="service-description">{service.description}</p>
      
      <ul className="service-features">
        {service.features.map((feature, index) => (
          <li key={index} className="feature-item">
            <span className="feature-check">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      
      <div className="service-footer">
        <span className="starting-price">
          Starting from <span className="price">KES {service.startingPrice}</span>
        </span>
        <button className="inquiry-button">
          Inquire Now
          <span className="button-arrow">→</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ServiceCard;