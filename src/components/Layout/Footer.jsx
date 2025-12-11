// src/components/Layout/Footer.jsx
import { Link } from 'react-router-dom';
import { 
  Instagram, 
  Youtube, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin,
  Sparkles 
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleSocialClick = (platform) => {
    // Add your social media URLs here
    const socialUrls = {
      instagram: '#',
      youtube: '#',
      tiktok: '#'
    };
    
    if (socialUrls[platform]) {
      window.open(socialUrls[platform], '_blank');
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    // Add your newsletter subscription logic here
    console.log('Subscribing email:', email);
    e.target.reset();
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
          
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <Sparkles className="footer-logo-icon" />
              <div>
                <h3 className="footer-logo-text">IGNUX</h3>
                <p className="footer-tagline">Igniting Unforgettable Experiences</p>
              </div>
            </div>
            <p className="footer-description">
              Professional fireworks and stage FX services for events across Kenya.
              Creating spectacular moments with safety and creativity.
            </p>
            
            <div className="social-links">
              <button 
                className="social-link" 
                aria-label="Instagram"
                onClick={() => handleSocialClick('instagram')}
              >
                <Instagram size={20} />
              </button>
              <button 
                className="social-link" 
                aria-label="YouTube"
                onClick={() => handleSocialClick('youtube')}
              >
                <Youtube size={20} />
              </button>
              <button 
                className="social-link" 
                aria-label="TikTok"
                onClick={() => handleSocialClick('tiktok')}
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/services" className="footer-link">Services</Link></li>
              <li><Link to="/portfolio" className="footer-link">Portfolio</Link></li>
              <li><Link to="/pricing" className="footer-link">Pricing</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-heading">Our Services</h4>
            <ul className="footer-links">
              <li className="footer-service">Wedding Pyrotechnics</li>
              <li className="footer-service">Corporate Events</li>
              <li className="footer-service">Festivals & Concerts</li>
              <li className="footer-service">Private Parties</li>
              <li className="footer-service">Stage FX</li>
              <li className="footer-service">Custom Displays</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-heading">Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Phone size={18} />
                <a href="tel:+254750077424" className="contact-link">+254 750 077 424</a>
              </div>
              <div className="contact-item">
                <Mail size={18} />
                <a href="mailto:info@ignux.com" className="contact-link">info@ignux.com</a>
              </div>
              <div className="contact-item">
                <MapPin size={18} />
                <span className="contact-text">Nairobi, Kenya</span>
              </div>
            </div>
            
            <div className="newsletter">
              <h5 className="newsletter-title">Stay Updated</h5>
              <p className="newsletter-text">Get news on upcoming shows and offers</p>
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Your email address" 
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-button">Subscribe</button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="copyright">
              © {currentYear} Build By SnooG Analytics | IGNUX. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <Link to="/privacy" className="bottom-link">Privacy Policy</Link>
              <Link to="/terms" className="bottom-link">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;