import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * useHeroAnimations
 * Solo anima los elementos UI del hero.
 * Se llama DESPUÉS de que el preloader terminó,
 * recibiendo la señal via el prop `ready`.
 */
export function useHeroAnimations(ready) {
  useEffect(() => {
    if (!ready) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Asegurarse de que todo arranca invisible
      gsap.set([
        '.hero-nav__link',
        '.hero-headline',
        '.hero-headline__accent',
        '.hero-descriptor',
        '.hero-cta',
        '.hero__logo-labels span',
        '.hero-logo',
      ], { opacity: 0 });

      // Logo del hero (el que queda en la esquina) — fade in simple
      tl.to('.hero-logo', {
        opacity: 1,
        duration: 0.4,
      }, 0);

      tl.to('.hero__logo-labels span', {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.08,
      }, 0.1);

      // Nav
      tl.fromTo('.hero-nav__link',
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.07 },
        0.05
      );

      // Headline
      tl.fromTo('.hero-headline',
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 0.9, ease: 'power4.out' },
        0.15
      );

      tl.fromTo('.hero-headline__accent',
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.6)' },
        0.85
      );

      // Descriptor
      tl.fromTo('.hero-descriptor',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.35
      );

      // CTA
      tl.fromTo('.hero-cta',
        { y: 14, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' },
        0.5
      );
    });

    return () => ctx.revert();
  }, [ready]);
}