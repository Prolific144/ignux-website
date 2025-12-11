import { Phone } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = '+254750077424';
  const message = "Hello IGNUX! I'm interested in your fireworks services.";
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
      aria-label="Contact on WhatsApp"
    >
      <Phone className="whatsapp-icon" />
      <span className="whatsapp-text">Chat on WhatsApp</span>
      <span className="whatsapp-badge">Fast Response</span>
    </a>
  );
};

export default WhatsAppButton;