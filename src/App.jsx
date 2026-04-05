import React, { useRef, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import Benefits from './components/Benefits';
import TestimonialsSection from './components/TestimonialsSection';
import OfferSection from './components/OfferSection';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ProblemSolution from './components/ProblemSolution';
import Services from './components/Services';
import ForWho from './components/ForWho';
import FinalCTA from './components/FinalCTA';
import { useScrollAnimation } from './hooks/useScrollAnimation';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import './App.css';

// Configuración de WhatsApp
const WHATSAPP_NUMBER = '5493816671884';
const WHATSAPP_MESSAGE = encodeURIComponent('¡Hola 219Labs! Me interesa conocer más sobre sus servicios de Landing Pages y Meta Ads.');

const App = () => {
  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const offerRef = useRef(null);

  // Log inicial
  useEffect(() => {
    console.log('🚀 App montada - 219Labs Landing Page');
    console.log('📱 User Agent:', navigator.userAgent);
    console.log('📐 Viewport:', window.innerWidth, 'x', window.innerHeight);
  }, []);

  // Aplicar animaciones de scroll
  useScrollAnimation([heroRef, benefitsRef, testimonialsRef, offerRef]);

  // Aplicar smooth scroll
  useSmoothScroll();

  // Manejo de clics en WhatsApp
  const handleWhatsAppClick = (section) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
    
    console.log(`📱 WhatsApp click desde: ${section}`);
    
    // Abrir WhatsApp
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Google Analytics event (si está configurado)
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'cta_click', {
        event_category: 'engagement',
        event_label: section,
        method: 'whatsapp'
      });
    }

    // Facebook Pixel event (si está configurado)
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Contact', {
        content_name: section,
        content_category: 'whatsapp_click'
      });
    }
  };

  return (
    <div className="app">
      <HeroSection 
        ref={heroRef} 
        onWhatsAppClick={() => handleWhatsAppClick('hero')} 
      />
      <ProblemSolution />
      <Services />
      <Benefits 
        ref={benefitsRef} 
        onWhatsAppClick={handleWhatsAppClick} 
      />
      <ForWho />
      <TestimonialsSection 
        ref={testimonialsRef} 
        onWhatsAppClick={() => handleWhatsAppClick('testimonials')} 
      />
      {/* <OfferSection 
        ref={offerRef} 
        onWhatsAppClick={handleWhatsAppClick} 
      /> */}
      <FinalCTA />

      <Footer 
        onWhatsAppClick={() => handleWhatsAppClick('footer')} 
      />
      <FloatingWhatsApp 
        onWhatsAppClick={() => handleWhatsAppClick('floating')} 
      />
    </div>
  );
};

export default App;