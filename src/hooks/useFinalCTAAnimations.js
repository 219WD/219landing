import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useFinalCTAAnimations
 * — Audit block: slides in from left
 * — Bullet points: stagger with leading dash draw
 * — CTA block: slides in from right
 * — Headline: clip-path reveal
 * — Button: scale pop
 * — Background grid lines: scrub with scroll
 */
export function useFinalCTAAnimations(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      // ── Audit block: slide from left ─────────────────────────────────────
      gsap.from('.fc-audit', {
        x: -48, opacity: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: '.fc-audit', start: 'top 85%', toggleActions: 'play none none none' },
      });

      // Audit eyebrow
      gsap.from('.fc-audit__eyebrow', {
        x: -20, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '.fc-audit', start: 'top 85%', toggleActions: 'play none none none' },
        delay: 0.1,
      });

      // Audit title
      gsap.from('.fc-audit__title', {
        clipPath: 'inset(0 100% 0 0)', opacity: 0, duration: 0.9, ease: 'power4.out',
        scrollTrigger: { trigger: '.fc-audit', start: 'top 85%', toggleActions: 'play none none none' },
        delay: 0.15,
      });

      // Bullets stagger
      const bullets = gsap.utils.toArray('.fc-audit__bullet', section);
      bullets.forEach((b, i) => {
        gsap.from(b, {
          x: -20, opacity: 0, duration: 0.5, ease: 'power3.out',
          delay: 0.3 + i * 0.12,
          scrollTrigger: { trigger: '.fc-audit', start: 'top 85%', toggleActions: 'play none none none' },
        });
        // The dash marker pops in separately
        const dash = b.querySelector('.fc-audit__dash');
        if (dash) {
          gsap.from(dash, {
            scaleX: 0, transformOrigin: 'left', duration: 0.3, ease: 'power2.out',
            delay: 0.35 + i * 0.12,
            scrollTrigger: { trigger: '.fc-audit', start: 'top 85%', toggleActions: 'play none none none' },
          });
        }
      });

      // Audit note
      gsap.from('.fc-audit__note', {
        y: 12, opacity: 0, duration: 0.5, ease: 'power3.out',
        delay: 0.65,
        scrollTrigger: { trigger: '.fc-audit', start: 'top 85%', toggleActions: 'play none none none' },
      });

      // ── CTA block: slide from right ──────────────────────────────────────
      gsap.from('.fc-cta', {
        x: 48, opacity: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: '.fc-cta', start: 'top 85%', toggleActions: 'play none none none' },
      });

      // Headline
      gsap.from('.fc-cta__headline', {
        clipPath: 'inset(0 100% 0 0)', opacity: 0, duration: 1, ease: 'power4.out',
        delay: 0.1,
        scrollTrigger: { trigger: '.fc-cta', start: 'top 85%', toggleActions: 'play none none none' },
      });

      // Body
      gsap.from('.fc-cta__body', {
        y: 16, opacity: 0, duration: 0.55, ease: 'power3.out',
        delay: 0.4,
        scrollTrigger: { trigger: '.fc-cta', start: 'top 85%', toggleActions: 'play none none none' },
      });

      // Button: pop in with scale
      gsap.from('.fc-cta__btn', {
        scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(2)',
        delay: 0.55,
        scrollTrigger: { trigger: '.fc-cta', start: 'top 85%', toggleActions: 'play none none none' },
      });

      // ── Divider line draws across ────────────────────────────────────────
      gsap.from('.fc-divider', {
        scaleX: 0, transformOrigin: 'left', duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.fc-divider', start: 'top 88%', toggleActions: 'play none none none' },
      });

      // ── Background: shift grid with scroll ───────────────────────────────
      gsap.to(section, {
        '--fc-grid-offset': '40px',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

    }, section);

    return () => ctx.revert();
  }, [sectionRef]);
}