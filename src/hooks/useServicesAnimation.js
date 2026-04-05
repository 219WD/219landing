import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useServicesAnimations
 * GSAP scroll-driven entrance animations for the Services section.
 * Replaces the CSS IntersectionObserver approach with pro motion.
 */
export function useServicesAnimations(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      // ── Eyebrow: slide from left ────────────────────────────────────────
      gsap.from('.sv-eyebrow', {
        x: -24, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '.sv-header', start: 'top 88%', toggleActions: 'play none none none' },
      });

      // ── Title: clip-path reveal word by word ────────────────────────────
      gsap.from('.sv-title', {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: '.sv-title', start: 'top 88%', toggleActions: 'play none none none' },
      });

      // ── Subtitle: fade up ───────────────────────────────────────────────
      gsap.from('.sv-subtitle', {
        y: 16, opacity: 0, duration: 0.6, delay: 0.3, ease: 'power3.out',
        scrollTrigger: { trigger: '.sv-subtitle', start: 'top 88%', toggleActions: 'play none none none' },
      });

      // ── Cards: staggered entrance with alternating directions ───────────
      const cards = gsap.utils.toArray('.sv-card', section);
      cards.forEach((card, i) => {
        const col   = i % 3;           // 0=left 1=center 2=right
        const fromX = col === 0 ? -32 : col === 2 ? 32 : 0;
        const fromY = col === 1 ? 32 : 16;

        gsap.from(card, {
          x: fromX, y: fromY,
          opacity: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          delay: (i % 3) * 0.08,
        });

        // Ghost number rises from below on scroll entry
        const bgNum = card.querySelector('.sv-card__bg-num');
        if (bgNum) {
          gsap.from(bgNum, {
            y: 20, opacity: 0, duration: 0.5, delay: 0.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          });
        }

        // CTA button pops in last
        const cta = card.querySelector('.sv-card__cta');
        if (cta) {
          gsap.from(cta, {
            scale: 0.85, opacity: 0, duration: 0.4, delay: 0.3,
            ease: 'back.out(1.8)',
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          });
        }
      });

      // ── Closing line: slide up ──────────────────────────────────────────
      gsap.from('.sv-closing', {
        y: 20, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '.sv-closing', start: 'top 92%', toggleActions: 'play none none none' },
      });

    }, section);

    return () => ctx.revert();
  }, [sectionRef]);
}