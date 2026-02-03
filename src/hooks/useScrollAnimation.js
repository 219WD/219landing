// hooks/useScrollAnimation.js
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const useScrollAnimation = (sectionRefs) => {
  useEffect(() => {
    // Registrar ScrollTrigger solo si existe
    if (typeof gsap !== 'undefined' && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    } else {
      console.warn('GSAP no está disponible');
      return; // Salir si GSAP no está disponible
    }

    // Verificar que sectionRefs sea un array válido
    if (!Array.isArray(sectionRefs)) {
      console.warn('sectionRefs no es un array válido');
      return;
    }

    console.log('Iniciando animaciones...', sectionRefs.length);

    // ANIMACIONES DEL HERO (sin ScrollTrigger)
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    const heroStats = document.querySelectorAll('.stat-item');
    
    if (heroTitle) {
      gsap.from(heroTitle, {
        y: 80,
        opacity: 0,
        duration: 1.4,
        ease: 'power4.out',
        delay: 0.3,
      });
    }
    
    if (heroSubtitle) {
      gsap.from(heroSubtitle, {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.6,
      });
    }
    
    if (heroCta) {
      gsap.from(heroCta, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        delay: 0.9,
      });
    }
    
    if (heroStats.length > 0) {
      gsap.from(heroStats, {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)',
        delay: 1.2,
      });
    }

    // ANIMACIONES DE LAS SECCIONES (con ScrollTrigger)
    sectionRefs.forEach((ref, index) => {
      if (!ref || !ref.current) {
        console.warn(`Referencia ${index} no válida`);
        return;
      }
      
      // Solo animar secciones que no sean el hero
      if (index > 0) {
        gsap.from(ref.current, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse',
            markers: false,
          },
        });
      }

      // Animaciones para cards
      const cards = ref.current.querySelectorAll('.benefit-card, .testimonial-card, .price-container, .bonus-container');
      
      if (cards.length > 0) {
        gsap.from(cards, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
            markers: false,
          },
        });
      }
    });

    // Animación del floating WhatsApp
    const floatingWhatsapp = document.querySelector('.floating-whatsapp');
    if (floatingWhatsapp) {
      gsap.from(floatingWhatsapp, {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(2)',
        delay: 1.5,
      });

      // Animación de flotación
      gsap.to(floatingWhatsapp, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }

    // Limpiar cuando el componente se desmonte
    return () => {
      console.log('Limpiando animaciones...');
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [sectionRefs]);
};