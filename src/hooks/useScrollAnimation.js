import { useEffect } from 'react';

export const useScrollAnimation = (sectionRefs) => {
  useEffect(() => {
    console.log('🎬 Iniciando animaciones...');

    // Variable para verificar si GSAP está disponible
    let gsap = null;
    let ScrollTrigger = null;
    let hasGSAP = false;

    // Intentar cargar GSAP
    try {
      gsap = require('gsap').gsap;
      ScrollTrigger = require('gsap/ScrollTrigger').ScrollTrigger;
      
      if (gsap && ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        hasGSAP = true;
        console.log('✅ GSAP cargado correctamente');
      }
    } catch (error) {
      console.warn('⚠️ GSAP no disponible, usando CSS fallback:', error.message);
      hasGSAP = false;
    }

    // ============================================
    // OPCIÓN 1: CON GSAP (si está disponible)
    // ============================================
    if (hasGSAP && gsap && ScrollTrigger) {
      console.log('🎨 Usando animaciones GSAP');

      // Configuración
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

      // Animaciones de secciones
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

      // Cleanup
      return () => {
        triggers.forEach(t => t && t.kill());
        ScrollTrigger.getAll().forEach(t => t.kill());
        gsap.killTweensOf('*');
      };
    }

    // ============================================
    // OPCIÓN 2: SIN GSAP (CSS Fallback)
    // ============================================
    else {
      console.log('🎨 Usando animaciones CSS (fallback)');

      // Agregar clase de animación a todos los elementos
      const animateElements = () => {
        // Hero elements
        const heroElements = document.querySelectorAll(
          '.hero-badge, .hero-title, .hero-subtitle, .hero-cta, .stat-item'
        );
        
        heroElements.forEach((el, index) => {
          setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            requestAnimationFrame(() => {
              el.style.opacity = '1';
              el.style.transform = 'translateY(0)';
            });
          }, index * 150);
        });

        // WhatsApp flotante
        const floatingWhatsapp = document.querySelector('.floating-whatsapp');
        if (floatingWhatsapp) {
          floatingWhatsapp.style.opacity = '0';
          floatingWhatsapp.style.transform = 'scale(0)';
          floatingWhatsapp.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
          
          setTimeout(() => {
            floatingWhatsapp.style.opacity = '1';
            floatingWhatsapp.style.transform = 'scale(1)';
          }, 1500);

          // Animación de flotación con CSS
          floatingWhatsapp.style.animation = 'float 2s ease-in-out infinite';
        }

        // Intersection Observer para secciones
        const observerOptions = {
          threshold: 0.1,
          rootMargin: '0px 0px -15% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
              
              // Animar hijos (cards)
              const cards = entry.target.querySelectorAll(
                '.benefit-card, .testimonial-card, .price-container, .bonus-container'
              );
              
              cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
                
                setTimeout(() => {
                  card.style.opacity = '1';
                  card.style.transform = 'translateY(0)';
                }, 50);
              });
            }
          });
        }, observerOptions);

        // Observar secciones
        sectionRefs.forEach((ref, index) => {
          if (ref && ref.current && index > 0) {
            const section = ref.current;
            section.style.opacity = '0';
            section.style.transform = 'translateY(40px)';
            section.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(section);
          }
        });

        return () => observer.disconnect();
      };

      // Agregar keyframes para float
      const style = document.createElement('style');
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1); }
        }
      `;
      document.head.appendChild(style);

      const cleanup = animateElements();

      return () => {
        if (cleanup) cleanup();
        document.head.removeChild(style);
      };
    }

  }, [sectionRefs]);
};