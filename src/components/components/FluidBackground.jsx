import { useLiquidEther } from '../hooks/useLiquidEther';
import {
  FLUID_CONFIG,
  FLUID_COLORS,
  FLUID_MOBILE_CONFIG,
  FLUID_MOBILE_COLORS,
} from '../constants/theme';

export default function FluidBackground() {
  const isMobile = typeof window !== 'undefined'
    && window.matchMedia('(max-width: 760px)').matches;
  const ref = useLiquidEther({
    ...FLUID_CONFIG,
    ...(isMobile ? FLUID_MOBILE_CONFIG : {}),
    colors: isMobile ? FLUID_MOBILE_COLORS : FLUID_COLORS,
    preferHalfFloat: isMobile,
  });

  return (
    <div
      ref={ref}
      className="hero-fluid"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    />
  );
}
