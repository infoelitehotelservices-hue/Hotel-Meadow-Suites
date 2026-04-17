import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import '../styles/WhatsAppFloat.css';

const WhatsAppFloat = () => {
  const phoneNumber = '923711098946'; // Replace with your WhatsApp number (with country code, no + or spaces)
  const message = 'Hello! I would like to inquire about your services.'; // Default message
  
  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="whatsapp-float" onClick={handleClick}>
      <FaWhatsapp className="whatsapp-icon" />
    </div>
  );
};

export default WhatsAppFloat;
