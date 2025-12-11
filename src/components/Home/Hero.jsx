import { motion } from 'framer-motion';
import CTAButton from '../Shared/CTAButton';

const Hero = () => {
  return (
    <section className="hero-section">
      {/* Video Background */}
      <div className="video-background">
        <video autoPlay muted loop playsInline>
          <source src="/videos/fireworks-hero.mp4" type="video/mp4" />
          <source src="/videos/fireworks-hero.webm" type="video/webm" />
          {/* Fallback image */}
          <img src="/images/hero-fallback.jpg" alt="Fireworks Display" />
        </video>
        <div className="video-overlay"></div>
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-text"
        >
          <h1 className="hero-title">
            <span className="gradient-text">IGNITING</span> UNFORGETTABLE
            <br />
            <span className="accent-text">EXPERIENCES</span>
          </h1>
          <p className="hero-subtitle">
            Professional fireworks and stage FX for weddings, corporate events,
            and festivals across Kenya
          </p>
          
          <div className="hero-cta-group">
            <CTAButton 
              text="Book a Show" 
              variant="primary" 
              size="large"
              icon="sparkles"
            />
            <CTAButton 
              text="View Portfolio" 
              variant="outline" 
              size="large"
              href="/portfolio"
            />
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div 
          className="stats-bar"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
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
  );
};

export default Hero;