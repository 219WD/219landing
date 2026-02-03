// hooks/useSmoothScroll.js
import { useEffect } from 'react';
import { gsap } from 'gsap';

export const useSmoothScroll = () => {
  useEffect(() => {
    console.log('Configurando smooth scroll...');
    
    let scrollTimeout;
    let isScrolling = false;
    
    const handleWheel = (e) => {
      if (isScrolling) return;
      
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        const delta = Math.sign(e.deltaY);
        const scrollAmount = window.innerHeight * 0.5 * delta;
        
        isScrolling = true;
        
        gsap.to(window, {
          scrollTo: window.pageYOffset + scrollAmount,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            isScrolling = false;
          },
          onInterrupt: () => {
            isScrolling = false;
          }
        });
      }, 100);
    };

    // Solo activar en desktop
    if (window.innerWidth > 768) {
      window.addEventListener('wheel', handleWheel, { passive: false });
    }

    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      const handleScrollClick = () => {
        gsap.to(window, {
          scrollTo: window.innerHeight,
          duration: 1.2,
          ease: 'power3.inOut',
        });
      };
      
      scrollIndicator.addEventListener('click', handleScrollClick);
      
      return () => {
        window.removeEventListener('wheel', handleWheel);
        scrollIndicator.removeEventListener('click', handleScrollClick);
        clearTimeout(scrollTimeout);
      };
    }

    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, []);
};