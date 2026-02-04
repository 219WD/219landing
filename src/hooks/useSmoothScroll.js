import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    console.log('🖱️ Configurando smooth scroll...');

    // Detectar tipo de dispositivo
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isDesktop = window.innerWidth > 1024 && !isMobile;

    console.log(`📱 Dispositivo: ${isDesktop ? 'Desktop' : 'Mobile/Tablet'}`);

    // ============================================
    // SCROLL INDICATOR
    // ============================================
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    const handleScrollClick = () => {
      console.log('🖱️ Scroll indicator clicked');
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    };
    
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', handleScrollClick);
      
      // Ocultar después de scroll
      const hideOnScroll = () => {
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
              behavior: 'smooth',
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
      console.log('🧹 Limpiando smooth scroll...');
      
      if (scrollIndicator) {
        scrollIndicator.removeEventListener('click', handleScrollClick);
      }
      
      linkHandlers.forEach(({ link, handler }) => {
        link.removeEventListener('click', handler);
      });
    };
  }, []);
};