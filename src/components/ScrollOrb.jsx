/**
 * ScrollOrb
 * Empty div container — the WebGL fluid canvas is injected
 * directly into this element by useOrbFluid.
 */
export default function ScrollOrb({ orbRef }) {
  return (
    <div
      className="orb-wrap"
      ref={orbRef}
      aria-hidden="true"
    />
  );
}