import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    if (!prefersReducedMotion) {
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
    chars.forEach(char => {
      char.style.opacity = '1';
      char.style.transform = 'none';
    });

    return () => {
      element.textContent = originalText;
    };
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger, scrub]);

  return elementRef;
};
