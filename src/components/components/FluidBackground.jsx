import { useLiquidEther } from '../hooks/useLiquidEther';
import { FLUID_CONFIG, FLUID_COLORS } from '../constants/theme';

export default function FluidBackground() {
  const ref = useLiquidEther({ ...FLUID_CONFIG, colors: FLUID_COLORS });

  return (
    <div
      ref={ref}
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