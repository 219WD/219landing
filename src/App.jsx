// App.js
import React, { useRef } from 'react';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import TestimonialsSection from './components/TestimonialsSection';
import OfferSection from './components/OfferSection';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import './App.css';

// Importar hooks condicionalmente
let useScrollAnimation, useSmoothScroll;

try {
  const hooks = require('./hooks/useScrollAnimation');
  useScrollAnimation = hooks.useScrollAnimation;
} catch (error) {
  console.warn('useScrollAnimation hook no disponible:', error);
  useScrollAnimation = () => {}; // Hook vacío como fallback
}

try {
  const hooks = require('./hooks/useSmoothScroll');
  useSmoothScroll = hooks.useSmoothScroll;
} catch (error) {
  console.warn('useSmoothScroll hook no disponible:', error);
  useSmoothScroll = () => {}; // Hook vacío como fallback
}

const WHATSAPP_NUMBER = '5493816671884';
const WHATSAPP_MESSAGE = encodeURIComponent('¡Hola 219Labs! Me interesa conocer más sobre sus servicios de Landing Pages y Meta Ads.');

const App = () => {
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const offerRef = useRef(null);

  // Usar hooks solo si están disponibles
  React.useEffect(() => {
    if (useScrollAnimation) {
      useScrollAnimation([heroRef, benefitsRef, testimonialsRef, offerRef]);
    }
  }, []);

  React.useEffect(() => {
    if (useSmoothScroll) {
      useSmoothScroll();
    }
  }, []);

  const handleWhatsAppClick = (section) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
    window.open(url, '_blank');
    
    if (window.gtag) {
      window.gtag('event', 'cta_click', {
        section: section,
        method: 'whatsapp'
      });
    }
  };

  return (
    <div className="app">
      <HeroSection ref={heroRef} onWhatsAppClick={() => handleWhatsAppClick('hero')} />
      <BenefitsSection ref={benefitsRef} onWhatsAppClick={handleWhatsAppClick} />
      <TestimonialsSection ref={testimonialsRef} onWhatsAppClick={() => handleWhatsAppClick('testimonials')} />
      <OfferSection ref={offerRef} onWhatsAppClick={handleWhatsAppClick} />
      <Footer onWhatsAppClick={() => handleWhatsAppClick('footer')} />
      <FloatingWhatsApp onWhatsAppClick={() => handleWhatsAppClick('floating')} />
    </div>
  );
};

export default App;