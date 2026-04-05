import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger);

// DrawSVGPlugin is a Club GSAP plugin. If you don't have it,
// we fall back to manual stroke-dashoffset animation (included below).
try { gsap.registerPlugin(DrawSVGPlugin); } catch (_) {}

/**
 * useProblemSolutionAnimations
 * Wires up all scroll-triggered entrance animations for the
 * ProblemSolution section.
 *
 * @param {React.RefObject} sectionRef
 */
export function useProblemSolutionAnimations(sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {

      // ── Helper: make a trigger scoped to this section ────────────────────
      const trig = (el, extra = {}) => ({
        trigger: el,
        start:   'top 88%',
        end:     'bottom 20%',
        toggleActions: 'play none none none',
        ...extra,
      });

      // ── Eyebrows: slide in from left ─────────────────────────────────────
      gsap.utils.toArray('.ps-eyebrow', section).forEach((el) => {
        gsap.from(el, {
          x: -28, opacity: 0, duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: trig(el),
        });
      });

      // ── Section headings: clip-path reveal ───────────────────────────────
      gsap.utils.toArray('.ps-heading', section).forEach((el) => {
        gsap.from(el, {
          clipPath: 'inset(0 100% 0 0)',
          opacity: 0,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: trig(el),
        });
        // Underline bar draws in after heading
        const bar = el.querySelector('.ps-heading__underline');
        if (bar) {
          gsap.from(bar, {
            scaleX: 0, transformOrigin: 'left',
            duration: 0.5, delay: 0.5,
            ease: 'power2.out',
            scrollTrigger: trig(el),
          });
        }
      });

      // ── Problem list items: staggered slide-up + fade ────────────────────
      const listItems = gsap.utils.toArray('.ps-list__item', section);
      if (listItems.length) {
        gsap.from(listItems, {
          y: 22, opacity: 0,
          duration: 0.55,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: trig(listItems[0]),
        });
        // Bullet dots: pop in with scale
        gsap.from(
          listItems.map(li => li.querySelector('.ps-list__bullet')),
          {
            scale: 0, opacity: 0,
            duration: 0.35,
            stagger: 0.12,
            ease: 'back.out(2)',
            scrollTrigger: trig(listItems[0]),
          }
        );
      }

      // ── Consequence block: slide from right ───────────────────────────────
      const consequence = section.querySelector('.ps-consequence');
      if (consequence) {
        gsap.from(consequence, {
          x: 32, opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: trig(consequence),
        });
      }

      // ── Divider: line expands outward from center dot ─────────────────────
      const divider = section.querySelector('.ps-divider');
      if (divider) {
        const lines = divider.querySelectorAll('.ps-divider__line');
        const dot   = divider.querySelector('.ps-divider__dot');
        gsap.from(dot,   { scale: 0, opacity: 0, duration: 0.4, ease: 'back.out(3)', scrollTrigger: trig(divider) });
        gsap.from(lines, { scaleX: 0, transformOrigin: 'center', duration: 0.6, delay: 0.15, stagger: 0.0, ease: 'power3.out', scrollTrigger: trig(divider) });
      }

      // ── Timeline SVG path: stroke-dashoffset draw ─────────────────────────
      const svgPath = section.querySelector('.ps-timeline-path');
      if (svgPath) {
        const len = svgPath.getTotalLength();
        gsap.set(svgPath, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(svgPath, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section.querySelector('.ps-steps'),
            start: 'top 80%',
            end:   'bottom 60%',
            scrub: 1,
          },
        });
      }

      // ── Step nodes: pop in as the line reaches them ───────────────────────
      const stepNodes = gsap.utils.toArray('.ps-step-node', section);
      stepNodes.forEach((node, i) => {
        gsap.from(node, {
          scale: 0, opacity: 0,
          duration: 0.45,
          ease: 'back.out(2.5)',
          scrollTrigger: {
            trigger: node,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        });
      });

      // ── Steps: alternate slide left/right ────────────────────────────────
      gsap.utils.toArray('.ps-step', section).forEach((step, i) => {
        gsap.from(step, {
          x: i % 2 === 0 ? -24 : 24,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 84%',
            toggleActions: 'play none none none',
          },
        });
      });

      // ── Closing line: slide up + color flash ──────────────────────────────
      const closing = section.querySelector('.ps-closing');
      if (closing) {
        gsap.from(closing, {
          y: 20, opacity: 0,
          duration: 0.65,
          ease: 'power3.out',
          scrollTrigger: trig(closing),
        });
        // border-left flash
        gsap.from(closing, {
          borderLeftColor: 'transparent',
          duration: 0.4,
          delay: 0.4,
          ease: 'none',
          scrollTrigger: trig(closing),
        });
      }

    }, section);

    return () => ctx.revert();
  }, [sectionRef]);
}