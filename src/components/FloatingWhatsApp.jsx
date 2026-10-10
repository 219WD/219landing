import React from 'react';

const FloatingWhatsApp = ({ onWhatsAppClick }) => {
  return (
    <button 
      className="floating-whatsapp"
      onClick={onWhatsAppClick}
      aria-label="Contanos qué necesitás"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4.5 6.8C4.5 4.9 6.05 3.5 8 3.5h8c1.95 0 3.5 1.4 3.5 3.3v5.4c0 1.9-1.55 3.3-3.5 3.3h-4.1L7 20.2v-4.7c-1.42-.36-2.5-1.61-2.5-3.3V6.8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8.5 8.5h7M8.5 11.5h4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
};

export default FloatingWhatsApp;
