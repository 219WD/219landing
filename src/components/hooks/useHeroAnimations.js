import { useEffect } from 'react';
import gsap from 'gsap';

/**
 * useHeroAnimations
 * Cinematic GSAP entrance for Hero219Labs.
 *
 * Timeline order:
 *  0.00  — Logo SVG paths: stroke draw (dashoffset) → fill fade in
 *  0.60  — Logo labels slide up
 *  0.70  — Nav links stagger from top
 *  0.90  — Headline clip-path reveal word by word
 *  1.30  — Descriptor fade + slide
 *  1.55  — CTA scale pop + slide
 */
export function useHeroAnimations() {
  useEffect(() => {
    const ctx = gsap.context(() => {

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // ── 1. SVG Logo paths ────────────────────────────────────────────────
      // Each <path> gets a stroke-dasharray equal to its own length,
      // then dashoffset animates from full-length → 0 (draw effect),
      // while fill opacity goes 0 → 1 slightly after.
      const logoPaths = gsap.utils.toArray('.hero-logo svg path');

      logoPaths.forEach((path) => {
        const len = path.getTotalLength?.() ?? 800;
        gsap.set(path, {
          strokeDasharray: len,
          strokeDashoffset: len,
          stroke: 'rgba(240,240,240,0.7)',
          strokeWidth: 0.8,
          fill: 'rgba(240,240,240,0)',
        });
      });

      gsap.set('.hero-cta', { opacity: 0, y: 18, scale: 0.94 });
      gsap.set('.hero-cta__arrow', { opacity: 0, x: -8 });

      tl.to(logoPaths, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
        stagger: 0.06,
      }, 0)
        .to(logoPaths, {
          fill: 'rgba(240,240,240,1)',
          stroke: 'rgba(240,240,240,0)',
          duration: 0.5,
          stagger: 0.05,
        }, 0.7);

      // ── 2. Logo labels ───────────────────────────────────────────────────
      tl.from('.hero__logo-labels span', {
        y: 10,
        opacity: 0,
        duration: 0.45,
        stagger: 0.1,
      }, 0.65);

      // ── 3. Nav links ─────────────────────────────────────────────────────
      tl.from('.hero-nav__link', {
        y: -16,
        opacity: 0,
        duration: 0.4,
        stagger: 0.07,
      }, 0.75);

      // ── 4. Headline ──────────────────────────────────────────────────────
      // Clip-path sweeps left → right revealing the text
      tl.from('.hero-headline', {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0,
        duration: 1.05,
        ease: 'power4.out',
      }, 0.95);

      // Accent em punches in with a slight scale
      tl.from('.hero-headline__accent', {
        scale: 0.92,
        opacity: 0,
        duration: 0.55,
        ease: 'back.out(1.6)',
      }, 1.55);

      // ── 5. Descriptor ────────────────────────────────────────────────────
      tl.from('.hero-descriptor', {
        y: 20,
        opacity: 0,
        duration: 0.6,
      }, 1.35);

      // ── 6. CTA ───────────────────────────────────────────────────────────
      tl.from('.hero-cta', {
        y: 18,
        opacity: 0,
        scale: 0.94,
        duration: 0.55,
        ease: 'back.out(1.4)',
      }, 2.0);

      // CTA arrow slides in from left after button appears
      tl.from('.hero-cta__arrow', {
        x: -8,
        opacity: 0,
        duration: 0.3,
      }, 2.3);

    }); // end gsap.context

    return () => ctx.revert();
  }, []);
}