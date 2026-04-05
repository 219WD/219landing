import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useForWhoAnimations
 * — Header: eyebrow slide + title clip-path reveal
 * — Cards: stagger from bottom with icon pop and corner line draw
 * — Diagonal lines: animate via CSS custom property driven by GSAP scrub
 * — Closing: scale up from 0.9
 */
export function useForWhoAnimations(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      // ── Eyebrow ──────────────────────────────────────────────────────────
      gsap.from('.fw-eyebrow', {
        x: -24, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '.fw-eyebrow', start: 'top 88%', toggleActions: 'play none none none' },
      });

      // ── Title clip-path ───────────────────────────────────────────────────
      gsap.from('.fw-title', {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0, duration: 1, ease: 'power4.out',
        scrollTrigger: { trigger: '.fw-title', start: 'top 88%', toggleActions: 'play none none none' },
      });

      // ── Cards: stagger with alternating x ────────────────────────────────
      const cards = gsap.utils.toArray('.fw-card', section);
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 36, x: i === 0 ? -20 : i === 2 ? 20 : 0,
          opacity: 0, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
          delay: i * 0.1,
        });

        // Icon border flashes in
        gsap.from(card.querySelector('.fw-card__icon'), {
          scale: 0.6, opacity: 0, duration: 0.4, ease: 'back.out(2)',
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          delay: 0.2 + i * 0.1,
        });

        // Ghost number drifts up
        gsap.from(card.querySelector('.fw-card__num'), {
          y: 20, opacity: 0, duration: 0.5, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
          delay: 0.15 + i * 0.1,
        });
      });

      // ── Diagonal lines: scrub their offset with scroll ────────────────────
      // We animate a CSS variable on the section that shifts the bg-position
      // of the repeating-linear-gradient, making the lines "slide" as you scroll.
      gsap.to(section, {
        '--fw-line-offset': '60px',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // ── Closing: scale + fade ─────────────────────────────────────────────
      gsap.from('.fw-closing', {
        scale: 0.88, opacity: 0, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: '.fw-closing', start: 'top 90%', toggleActions: 'play none none none' },
      });

    }, section);

    return () => ctx.revert();
  }, [sectionRef]);
}