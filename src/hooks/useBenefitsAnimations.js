import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useBenefitsAnimations
 * GSAP scroll-driven entrance for the Benefits section.
 *
 * Timeline order (all triggered by scroll):
 *  — Eyebrow:   slide from left
 *  — Title:     clip-path reveal
 *  — Items:     stagger slide up, each with counter number pop
 *  — Mockup:    slides in from right + continuous float wave
 *  — Glow:      pulses in sync with mockup
 */
export function useBenefitsAnimations(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      // ── Eyebrow ────────────────────────────────────────────────────────
      gsap.from('.bn-eyebrow', {
        x: -28,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.bn-eyebrow',
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });

      // ── Title clip-path reveal ─────────────────────────────────────────
      gsap.from('.bn-title', {
        clipPath: 'inset(0 100% 0 0)',
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.bn-title',
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });

      // Accent word pops in after title reveals
      gsap.from('.bn-title__accent', {
        scale: 0.88,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.8)',
        scrollTrigger: {
          trigger: '.bn-title',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        delay: 0.55,
      });

      // ── Benefit items stagger ──────────────────────────────────────────
      const items = gsap.utils.toArray('.bn-item', section);
      items.forEach((item, i) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });

        // Item slides up
        tl.from(item, {
          y: 24,
          opacity: 0,
          duration: 0.55,
          ease: 'power3.out',
          delay: i * 0.08,
        });

        // Number pops
        tl.from(item.querySelector('.bn-item__num'), {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'back.out(2)',
        }, '<0.15');

        // Bar grows down
        tl.from(item.querySelector('.bn-item__bar'), {
          scaleY: 0,
          transformOrigin: 'top center',
          duration: 0.4,
          ease: 'power2.out',
        }, '<0.05');
      });

      // ── Mockup: entrance from right ────────────────────────────────────
      gsap.from('.bn-visual', {
        x: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.bn-visual',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });

      // Mockup wave — overrides the CSS animation with a GSAP one
      // so it plays smoothly after the entrance finishes
      ScrollTrigger.create({
        trigger: '.bn-visual',
        start: 'top 85%',
        onEnter: () => {
          gsap.to('.bn-mockup', {
            y: -14,
            rotation: 0.5,
            duration: 2.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: 0.8,
          });
        },
      });

      // Glow pulses in
      gsap.from('.bn-visual__glow', {
        scale: 0.5,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.bn-visual',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        delay: 0.3,
      });

    }, section);

    return () => ctx.revert();
  }, [sectionRef]);
}