import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTAButton = ({ 
  text, 
  variant = 'primary', 
  size = 'medium', 
  icon,
  href,
  onClick,
  className = ''
}) => {
  const buttonClass = `cta-button cta-button-${variant} cta-button-${size} ${className}`;
  
  const IconComponent = icon === 'sparkles' ? Sparkles : 
                       icon === 'arrow' ? ArrowRight : null;

  const content = (
    <>
      {IconComponent && <IconComponent className="button-icon-left" />}
      <span>{text}</span>
      {variant === 'outline' && <ArrowRight className="button-icon-right" />}
    </>
  );

  if (href) {
    if (href.startsWith('http')) {
      return (
        <motion.a
          href={href}
          className={buttonClass}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {content}
        </motion.a>
      );
    }
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to={href} className={buttonClass}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      className={buttonClass}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {content}
    </motion.button>
  );
};

export default CTAButton;