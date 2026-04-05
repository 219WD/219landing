import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useTestimonialsAnimations
 * — Eyebrow pill: scale from 0
 * — Title: clip-path reveal
 * — Cards: stagger with featured card popping last
 * — Metrics: count-up feel with scale
 * — CTA block: slide up
 */
export function useTestimonialsAnimations(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      // ── Eyebrow pill ────────────────────────────────────────────────────
      gsap.from('.tm-eyebrow', {
        scale: 0.7, opacity: 0, duration: 0.5, ease: 'back.out(2)',
        scrollTrigger: { trigger: '.tm-eyebrow', start: 'top 88%', toggleActions: 'play none none none' },
      });

      // ── Title ───────────────────────────────────────────────────────────
      gsap.from('.tm-title', {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: '.tm-title', start: 'top 88%', toggleActions: 'play none none none' },
      });

      // ── Cards stagger ───────────────────────────────────────────────────
      const cards = gsap.utils.toArray('.tm-card', section);
      cards.forEach((card, i) => {
        const isFeatured = card.classList.contains('tm-card--featured');

        gsap.from(card, {
          y: isFeatured ? 48 : 36,
          scale: isFeatured ? 0.93 : 0.96,
          opacity: 0,
          duration: isFeatured ? 0.85 : 0.65,
          ease: isFeatured ? 'power4.out' : 'power3.out',
          delay: i * 0.12,
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
        });

        // Avatar pops in
        const avatar = card.querySelector('.tm-avatar');
        if (avatar) {
          gsap.from(avatar, {
            scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(2.5)',
            delay: 0.2 + i * 0.12,
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          });
        }

        // Metrics: each value pops in with scale
        const metrics = card.querySelectorAll('.tm-metric__value');
        if (metrics.length) {
          gsap.from(metrics, {
            scale: 0.5, opacity: 0, duration: 0.4,
            stagger: 0.1, ease: 'back.out(2)',
            delay: 0.35 + i * 0.12,
            scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' },
          });
        }

        // Quote border-left draws in
        const quote = card.querySelector('.tm-quote');
        if (quote) {
          gsap.from(quote, {
            borderLeftColor: 'transparent',
            paddingLeft: 0,
            duration: 0.5, delay: 0.3,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          });
        }
      });

      // ── CTA block ───────────────────────────────────────────────────────
      gsap.from('.tm-cta', {
        y: 28, opacity: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.tm-cta', start: 'top 90%', toggleActions: 'play none none none' },
      });

    }, section);

    return () => ctx.revert();
  }, [sectionRef]);
}