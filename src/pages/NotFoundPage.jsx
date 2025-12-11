// src/pages/NotFoundPage.jsx
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Home, Search, Sparkles } from 'lucide-react';
import CTAButton from '../components/Shared/CTAButton';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | IGNUX</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>

      <section className="not-found-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="not-found-content"
          >
            <div className="not-found-icon">
              <Sparkles className="sparkle-icon" />
              <div className="number-404">404</div>
            </div>
            
            <h1 className="not-found-title">Page Not Found</h1>
            
            <p className="not-found-description">
              The page you're looking for doesn't exist or has been moved. 
              Let's get you back on track!
            </p>

            <div className="suggestions">
              <div className="suggestion-item">
                <Search size={20} />
                <span>Check the URL for typos</span>
              </div>
              <div className="suggestion-item">
                <Home size={20} />
                <span>Return to our homepage</span>
              </div>
            </div>

            <div className="not-found-actions">
              <CTAButton
                text="Back to Home"
                variant="primary"
                size="large"
                href="/"
                icon="home"
              />
              <CTAButton
                text="View Our Services"
                variant="outline"
                size="large"
                href="/services"
                icon="sparkles"
              />
            </div>

            <div className="quick-links">
              <h4>Quick Links:</h4>
              <div className="links-grid">
                <a href="/services" className="quick-link">Services</a>
                <a href="/portfolio" className="quick-link">Portfolio</a>
                <a href="/pricing" className="quick-link">Pricing</a>
                <a href="/contact" className="quick-link">Contact</a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default NotFoundPage;