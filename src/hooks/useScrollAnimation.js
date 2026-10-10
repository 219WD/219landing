import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = (sectionRefs) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return undefined;

    const ctx = gsap.context(() => {
      ScrollTrigger.config({
        autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load'
      });

      // Animaciones del Hero
      const heroTitle = document.querySelector('.hero-title');
      const heroSubtitle = document.querySelector('.hero-subtitle');
      const heroCta = document.querySelector('.hero-cta');
      const heroStats = document.querySelectorAll('.stat-item');
      const heroBadge = document.querySelector('.hero-badge');
      
      if (heroBadge) gsap.from(heroBadge, { y: -20, opacity: 0, duration: 0.6, delay: 0 });
      if (heroTitle) gsap.from(heroTitle, { y: 80, opacity: 0, duration: 1.2, delay: 0.2 });
      if (heroSubtitle) gsap.from(heroSubtitle, { y: 40, opacity: 0, duration: 1, delay: 0.5 });
      if (heroCta) gsap.from(heroCta, { y: 40, opacity: 0, duration: 0.8, delay: 0.8 });
      if (heroStats.length > 0) {
        gsap.from(heroStats, {
          scale: 0.8,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          delay: 1
        });
      }

      const triggers = [];
      
      sectionRefs.forEach((ref, index) => {
        if (!ref || !ref.current || index === 0) return;
        
        const section = ref.current;
        
        // Animar sección
        triggers.push(
          ScrollTrigger.create({
            trigger: section,
            start: 'top 85%',
            onEnter: () => gsap.from(section, { y: 60, opacity: 0, duration: 1 })
          })
        );

        // Animar cards
        const cards = section.querySelectorAll('.benefit-card, .testimonial-card, .price-container, .bonus-container');
        if (cards.length > 0) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: 'top 75%',
              onEnter: () => gsap.from(cards, { y: 50, opacity: 0, duration: 0.8, stagger: 0.15 })
            })
          );
        }
      });

      // WhatsApp flotante
      const floatingWhatsapp = document.querySelector('.floating-whatsapp');
      if (floatingWhatsapp) {
        gsap.from(floatingWhatsapp, { scale: 0, opacity: 0, duration: 0.6, delay: 1.5 });
        gsap.to(floatingWhatsapp, {
          y: -10,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      return () => {
        triggers.forEach(t => t && t.kill());
      };
    });

    return () => ctx.revert();
  }, [sectionRefs]);
};
