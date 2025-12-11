// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('ignux-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return savedTheme || (prefersDark ? 'dark' : 'light');
    }
    return 'dark';
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    
    // Set theme attribute
    root.setAttribute('data-theme', theme);
    localStorage.setItem('ignux-theme', theme);
    
    // Add class for smooth transitions
    if (isInitialized) {
      root.classList.add('theme-changing');
      setTimeout(() => {
        root.classList.remove('theme-changing');
      }, 300);
    } else {
      setIsInitialized(true);
    }

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
  }, [theme, isInitialized]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem('ignux-theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};