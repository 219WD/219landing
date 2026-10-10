import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ============================================
    // SCROLL INDICATOR
    // ============================================
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let hideOnScroll = null;
    
    const handleScrollClick = () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    };
    
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', handleScrollClick);
      
      // Ocultar después de scroll
      hideOnScroll = () => {
        if (window.pageYOffset > 100) {
          scrollIndicator.style.transition = 'opacity 0.3s ease';
          scrollIndicator.style.opacity = '0';
          window.removeEventListener('scroll', hideOnScroll);
        }
      };
      
      window.addEventListener('scroll', hideOnScroll, { passive: true });
    }

    // ============================================
    // SMOOTH SCROLL PARA LINKS INTERNOS
    // ============================================
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    const linkHandlers = [];

    internalLinks.forEach(link => {
      const handler = (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId !== '#') {
          e.preventDefault();
          const target = document.querySelector(targetId);
          if (target) {
            target.scrollIntoView({
              behavior: prefersReducedMotion ? 'auto' : 'smooth',
              block: 'start'
            });
          }
        }
      };
      
      link.addEventListener('click', handler);
      linkHandlers.push({ link, handler });
    });

    // ============================================
    // CLEANUP
    // ============================================
    return () => {
      if (scrollIndicator) {
        scrollIndicator.removeEventListener('click', handleScrollClick);
      }

      if (hideOnScroll) {
        window.removeEventListener('scroll', hideOnScroll);
      }
      
      linkHandlers.forEach(({ link, handler }) => {
        link.removeEventListener('click', handler);
      });
    };
  }, []);
};
