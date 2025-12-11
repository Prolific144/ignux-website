import Hero from '../components/Home/Hero';
import ServicesPreview from '../components/Home/ServicesPreview';
import PortfolioPreview from '../components/Home/PortfolioPreview';
import CTAButton from '../components/Shared/CTAButton';

const HomePage = () => {
  return (
    <>
      <Hero />
      
      <section className="section">
        <div className="container">
          <h2 className="section-title">
            Why Choose <span className="gradient-text">IGNUX</span>
          </h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎆</div>
              <h3>Professional Displays</h3>
              <p>Licensed and experienced pyrotechnicians</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>100% Safety</h3>
              <p>Comprehensive safety protocols and insurance</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Custom Designs</h3>
              <p>Tailored displays to match your event theme</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⏱️</div>
              <h3>On-Time Delivery</h3>
              <p>Precise timing and flawless execution</p>
            </div>
          </div>
        </div>
      </section>

      <ServicesPreview />
      <PortfolioPreview />

      {/* Final CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">
            Ready to Ignite Your Event?
          </h2>
          <p className="cta-subtitle">
            Contact us today for a free consultation and quote
          </p>
          <div className="cta-buttons">
            <CTAButton 
              text="Get Free Quote" 
              variant="primary" 
              size="large"
              href="/contact"
            />
            <CTAButton 
              text="Call Now: +254 750 077 424" 
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

export default HomePage;