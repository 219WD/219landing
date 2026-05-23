import React from 'react';

const FloatingWhatsApp = ({ onWhatsAppClick }) => {
  return (
    <button 
      className="floating-whatsapp"
      onClick={onWhatsAppClick}
      aria-label="Aplicar para trabajar juntos"
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M14 3v5h5M9.5 14l2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

export default FloatingWhatsApp;
