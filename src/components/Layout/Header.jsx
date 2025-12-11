// src/components/Layout/Header.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Phone } from 'lucide-react';

const Header = ({ scrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleBookNow = () => {
    window.open('https://wa.me/254750077424', '_blank');
  };

  const handleMenuLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={handleMenuLinkClick}>
          <Sparkles className="logo-icon" />
          <div className="logo-text">
            <span className="logo-primary">IGNUX</span>
            <span className="logo-subtitle">Igniting Experiences</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
          <button 
            className="cta-button cta-button-primary cta-button-medium"
            onClick={handleBookNow}
          >
            <Phone size={18} />
            Book Now
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="menu-button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <div className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
          <div className="mobile-nav-header">
            <Link to="/" className="logo" onClick={handleMenuLinkClick}>
              <Sparkles className="logo-icon" />
              <div className="logo-text">
                <span className="logo-primary">IGNUX</span>
              </div>
            </Link>
            <button 
              className="close-button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="mobile-nav-links">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={handleMenuLinkClick}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <button 
            className="cta-button cta-button-primary cta-button-large"
            onClick={() => {
              handleBookNow();
              setIsMenuOpen(false);
            }}
            style={{ marginTop: 'var(--spacing-8)' }}
          >
            <Phone size={20} />
            Book Now
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;