import { useEffect, useRef } from 'react';

export const useTextFloat = (options = {}) => {
  const {
    animationDuration = 1,
    ease = 'back.inOut(2)',
    scrollStart = 'center bottom+=50%',
    scrollEnd = 'bottom bottom-=40%',
    stagger = 0.03,
    scrub = true
  } = options;

  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Variable para GSAP
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
        console.log('✅ TextFloat con GSAP');
      }
    } catch (error) {
      console.warn('⚠️ TextFloat usando CSS fallback');
      hasGSAP = false;
    }

    // ============================================
    // SPLIT TEXT - Separar en caracteres
    // ============================================
    const originalText = element.textContent;
    
    // Crear spans para cada carácter
    element.innerHTML = originalText
      .split('')
      .map(char => {
        const displayChar = char === ' ' ? '&nbsp;' : char;
        return `<span class="char-float" style="display: inline-block;">${displayChar}</span>`;
      })
      .join('');

    const chars = element.querySelectorAll('.char-float');

    // ============================================
    // ANIMACIÓN CON GSAP
    // ============================================
    if (hasGSAP && gsap && ScrollTrigger) {
      // Configurar estado inicial y animación
      gsap.fromTo(
        chars,
        {
          willChange: 'opacity, transform',
          opacity: 0,
          yPercent: 120,
          scaleY: 2.3,
          scaleX: 0.7,
          transformOrigin: '50% 0%'
        },
        {
          duration: animationDuration,
          ease: ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: stagger,
          scrollTrigger: {
            trigger: element,
            start: scrollStart,
            end: scrollEnd,
            scrub: scrub,
            // markers: true, // Descomentar para debugging
          }
        }
      );

      // Cleanup
      return () => {
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.trigger === element) {
            trigger.kill();
          }
        });
        element.textContent = originalText;
      };
    }

    // ============================================
    // FALLBACK CON CSS + INTERSECTION OBSERVER
    // ============================================
    else {
      // Estilo inicial
      chars.forEach(char => {
        char.style.opacity = '0';
        char.style.transform = 'translateY(100%) scaleY(2) scaleX(0.7)';
        char.style.transition = `all ${animationDuration}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
      });

      // Observer para detectar cuando entra en viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              chars.forEach((char, index) => {
                setTimeout(() => {
                  char.style.opacity = '1';
                  char.style.transform = 'translateY(0) scaleY(1) scaleX(1)';
                }, index * (stagger * 1000));
              });
              observer.unobserve(element);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: '0px 0px -15% 0px'
        }
      );

      observer.observe(element);

      // Cleanup
      return () => {
        observer.disconnect();
        element.textContent = originalText;
      };
    }
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger, scrub]);

  return elementRef;
};