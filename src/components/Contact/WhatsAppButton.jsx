import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, X } from 'lucide-react';

const WhatsAppButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const phoneNumber = '+254750077424';
  const defaultMessage = "Hello IGNUX! I'm interested in your fireworks services.";
  const [customMessage, setCustomMessage] = useState('');
  
  useEffect(() => {
    // Auto-expand after 30 seconds of page load for first-time visitors
    const timer = setTimeout(() => {
      if (!localStorage.getItem('whatsappExpandedShown')) {
        setIsExpanded(true);
        localStorage.setItem('whatsappExpandedShown', 'true');
      }
    }, 30000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    if (isExpanded) {
      // Auto-collapse after 15 seconds if not interacted with
      const collapseTimer = setTimeout(() => {
        if (!isHovered) {
          setIsExpanded(false);
        }
      }, 15000);
      
      return () => clearTimeout(collapseTimer);
    }
  }, [isExpanded, isHovered]);
  
  const handleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else {
      const message = customMessage.trim() || defaultMessage;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      // Show success notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isExpanded && customMessage.trim()) {
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMessage)}`;
      window.open(whatsappUrl, '_blank');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      setCustomMessage('');
    }
  };
  
  const quickMessages = [
    "I need a quote for a wedding",
    "Looking for corporate event fireworks",
    "Private party inquiry",
    "Festival fireworks consultation"
  ];
  
  return (
    <>
      <motion.div
        className="whatsapp-container"
        initial={false}
        animate={{ 
          width: isExpanded ? '320px' : '60px',
          height: isExpanded ? 'auto' : '60px'
        }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25 
        }}
        style={{
          position: 'fixed',
          bottom: 'var(--spacing-8)',
          right: 'var(--spacing-8)',
          zIndex: 'var(--z-fixed)'
        }}
      >
        <motion.div
          className="whatsapp-button-expanded"
          initial={false}
          animate={{ 
            borderRadius: isExpanded ? 'var(--radius-2xl)' : 'var(--radius-full)',
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25 
          }}
          style={{
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            boxShadow: 'var(--shadow-2xl)',
            overflow: 'hidden',
            position: 'relative'
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Circular State */}
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              <motion.button
                key="circular"
                className="whatsapp-button-circular"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                exit={{ scale: 0, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15 
                }}
                onClick={handleClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Open WhatsApp chat"
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: 'var(--radius-full)',
                  background: 'transparent',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative'
                }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <MessageCircle 
                    size={28} 
                    style={{ 
                      color: 'white',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                    }} 
                  />
                </motion.div>
                
                {/* Pulsing ring effect */}
                <motion.div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: 'var(--radius-full)',
                    border: '2px solid rgba(37, 211, 102, 0.4)'
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
                
                {/* Notification dot */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '12px',
                    height: '12px',
                    borderRadius: 'var(--radius-full)',
                    background: '#FF6B00',
                    border: '2px solid white'
                  }}
                />
              </motion.button>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ padding: 'var(--spacing-4)' }}
              >
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 'var(--spacing-4)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-full)',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <MessageCircle size={24} style={{ color: '#25D366' }} />
                    </div>
                    <div>
                      <h4 style={{ 
                        fontSize: 'var(--font-size-sm)', 
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'white',
                        margin: 0 
                      }}>
                        Chat with us
                      </h4>
                      <p style={{ 
                        fontSize: 'var(--font-size-xs)', 
                        color: 'rgba(255,255,255,0.8)',
                        margin: 0 
                      }}>
                        Usually replies in 5 mins
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsExpanded(false)}
                    aria-label="Close chat"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      padding: 'var(--spacing-1)',
                      borderRadius: 'var(--radius-full)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Quick Messages */}
                <div style={{ marginBottom: 'var(--spacing-4)' }}>
                  <p style={{ 
                    fontSize: 'var(--font-size-xs)', 
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: 'var(--spacing-2)' 
                  }}>
                    Quick messages:
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 'var(--spacing-2)' 
                  }}>
                    {quickMessages.map((msg, index) => (
                      <motion.button
                        key={index}
                        onClick={() => {
                          const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
                          window.open(whatsappUrl, '_blank');
                          setShowNotification(true);
                          setTimeout(() => setShowNotification(false), 3000);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                          background: 'rgba(255,255,255,0.15)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: 'var(--radius-lg)',
                          padding: 'var(--spacing-2) var(--spacing-3)',
                          fontSize: 'var(--font-size-xs)',
                          color: 'white',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                      >
                        {msg}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {/* Custom Message Input */}
                <div style={{ marginBottom: 'var(--spacing-4)' }}>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    rows="2"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--spacing-3)',
                      fontSize: 'var(--font-size-sm)',
                      color: '#333',
                      resize: 'none',
                      fontFamily: 'var(--font-secondary)'
                    }}
                  />
                </div>
                
                {/* Send Button */}
                <motion.button
                  onClick={handleClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: '100%',
                    background: 'white',
                    color: '#25D366',
                    border: 'none',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-3)',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-semibold)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 'var(--spacing-2)'
                  }}
                >
                  <Phone size={16} />
                  Send via WhatsApp
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Success Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              bottom: '140px',
              right: 'var(--spacing-8)',
              background: 'white',
              color: '#25D366',
              padding: 'var(--spacing-3) var(--spacing-4)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-2xl)',
              zIndex: 'var(--z-fixed)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              maxWidth: '300px'
            }}
          >
            <MessageCircle size={18} />
            <div>
              <p style={{ 
                fontSize: 'var(--font-size-sm)', 
                fontWeight: 'var(--font-weight-semibold)',
                margin: 0 
              }}>
                Message sent!
              </p>
              <p style={{ 
                fontSize: 'var(--font-size-xs)', 
                color: 'var(--color-text-secondary)',
                margin: 0 
              }}>
                Check WhatsApp for reply
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhatsAppButton;