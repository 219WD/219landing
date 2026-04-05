import { useAmbientOrb } from '../hooks/useAmbientOrb.js';

/**
 * AmbientOrb
 * Drop-in floating fluid orb. Place inside any section with
 * `position: relative; overflow: hidden`.
 *
 * Props:
 *  side       'left' | 'right'   default 'left'
 *  top        CSS string          default '15%'
 *  parallaxY  number (vh)         default 28
 *  size       CSS string          default 'clamp(260px, 36vw, 500px)'
 */
export default function AmbientOrb({
  side      = 'left',
  top       = '15%',
  parallaxY = 28,
  size      = 'clamp(260px, 36vw, 500px)',
}) {
  const ref = useAmbientOrb({ side, topOffset: top, parallaxY });

  const posStyle = side === 'left'
    ? { left: '-80px' }
    : { right: '-80px' };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top,
        ...posStyle,
        width: size,
        aspectRatio: '1',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0,                    // GSAP fades in
        maskImage: `radial-gradient(
          ellipse 70% 70% at ${side === 'left' ? '30%' : '70%'} 45%,
          black 25%,
          rgba(0,0,0,0.5) 52%,
          transparent 78%
        )`,
        WebkitMaskImage: `radial-gradient(
          ellipse 70% 70% at ${side === 'left' ? '30%' : '70%'} 45%,
          black 25%,
          rgba(0,0,0,0.5) 52%,
          transparent 78%
        )`,
      }}
    />
  );
}