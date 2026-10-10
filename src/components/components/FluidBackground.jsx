import { useLiquidEther } from '../hooks/useLiquidEther';
import { FLUID_CONFIG, FLUID_COLORS } from '../constants/theme';

export default function FluidBackground() {
  const isMobile = typeof window !== 'undefined'
    && window.matchMedia('(max-width: 760px)').matches;
  if (isMobile) return null;

  return <DesktopFluidBackground />;
}

function DesktopFluidBackground() {
  const ref = useLiquidEther({
    ...FLUID_CONFIG,
    colors: FLUID_COLORS,
    preferHalfFloat: false,
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
