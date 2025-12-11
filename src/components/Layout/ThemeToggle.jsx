// src/components/Layout/ThemeToggle.jsx
import { useState, useEffect } from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <button 
        className="theme-toggle"
        aria-label="Theme toggle"
      >
        <div className="theme-toggle-inner" />
      </button>
    );
  }

  return (
    <motion.div
      className="theme-toggle-wrapper"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        data-theme={theme}
      >
        <div className="theme-toggle-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="theme-icon"
            >
              {theme === 'light' ? (
                <Moon size={20} className="theme-icon-svg" />
              ) : (
                <Sun size={20} className="theme-icon-svg" />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="theme-tooltip"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              Switch to {theme === 'light' ? 'dark' : 'light'} mode
              {theme === 'light' && (
                <Sparkles size={12} className="sparkle-icon" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
};

export default ThemeToggle;