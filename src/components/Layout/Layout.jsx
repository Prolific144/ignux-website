// src/components/Layout/Layout.jsx
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../Contact/WhatsAppButton';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="layout">
      <Header scrolled={isScrolled} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <ThemeToggle />
    </div>
  );
};

export default Layout;
