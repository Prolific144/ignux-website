// src/components/Shared/LoadingSpinner.jsx
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  size = 'medium',
  text = 'Loading...',
  showText = true,
  variant = 'sparkles', // 'sparkles', 'minimal', 'pulse'
  fullScreen = false,
  className = ''
}) => {
  const [dots, setDots] = useState('');

  // Animate loading dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-20 h-20'
  };

  const iconSizes = {
    small: 16,
    medium: 24,
    large: 32,
    xlarge: 40
  };

  const variants = {
    sparkles: (
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { 
            duration: 2, 
            repeat: Infinity, 
            ease: "linear" 
          },
          scale: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
        className={`${sizeClasses[size]} relative`}
      >
        {/* Outer ring with gradient */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)'
          }}
        />
        
        {/* Inner ring with blur effect */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-2 rounded-full border border-white/20 backdrop-blur-sm"
        />
        
        {/* Sparkles icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles 
            className="text-blue-400 drop-shadow-lg" 
            size={iconSizes[size]}
          />
        </div>
        
        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-300 rounded-full"
            animate={{
              y: [0, -15, 0],
              x: [0, Math.sin(i) * 10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${30 + i * 20}%`,
              top: '20%'
            }}
          />
        ))}
      </motion.div>
    ),
    
    minimal: (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className={`${sizeClasses[size]} border-2 border-blue-500 border-t-transparent rounded-full`}
      />
    ),
    
    pulse: (
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          duration: 1.5, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className={`${sizeClasses[size]} flex items-center justify-center`}
      >
        <Loader2 className="text-blue-500" size={iconSizes[size]} />
      </motion.div>
    )
  };

  const content = (
    <div className={`loading-spinner-container ${className}`}>
      <div className="loading-spinner flex flex-col items-center justify-center">
        {variants[variant]}
        
        {showText && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mt-4 text-center"
          >
            <p className="text-gray-600 dark:text-gray-300 font-medium">
              {text}
              <span className="inline-block min-w-[1ch]">{dots}</span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div 
        className="fixed inset-0 bg-gradient-to-br from-white/80 to-gray-100/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm z-50 flex items-center justify-center"
        role="status"
        aria-label="Loading"
      >
        {content}
      </div>
    );
  }

  return content;
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  text: PropTypes.string,
  showText: PropTypes.bool,
  variant: PropTypes.oneOf(['sparkles', 'minimal', 'pulse']),
  fullScreen: PropTypes.bool,
  className: PropTypes.string
};

export default LoadingSpinner;