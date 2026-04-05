import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollOrb
 * Attaches a parallax + morphing orb to the right side of a section.
 *
 * @param {React.RefObject} sectionRef  — the section to pin against
 * @returns {React.RefObject}           — attach to the orb wrapper div
 */
export function useScrollOrb(sectionRef) {
  const orbRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const orb     = orbRef.current;
    if (!section || !orb) return;

    const ctx = gsap.context(() => {
      // ── Parallax: orb moves DOWN with scroll ─────────────────────────
      gsap.to(orb, {
        y: '32vh',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end:   'bottom top',
          scrub: 1.4,
        },
      });

      // ── Scale pulse tied to scroll progress ───────────────────────────────
      gsap.fromTo(
        orb,
        { scale: 0.72, opacity: 0 },
        {
          scale: 1.08,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            end:   'center center',
            scrub: 1.8,
          },
        }
      );

      // ── Slight rotation drift ─────────────────────────────────────────────
      gsap.to(orb, {
        rotate: 220,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end:   'bottom top',
          scrub: 2.2,
        },
      });

      // ── Inner blobs counter-rotate for fluid feel ─────────────────────────
      const blobs = orb.querySelectorAll('.orb__blob');
      blobs.forEach((blob, i) => {
        gsap.to(blob, {
          rotate: i % 2 === 0 ? -160 : 160,
          scale:  i % 2 === 0 ? 1.15 : 0.88,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end:   'bottom top',
            scrub: 1.6 + i * 0.3,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [sectionRef]);

  return orbRef;
}