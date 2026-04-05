import { COPY } from "../constants/theme";

function ArrowDiagonal() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M1 11L11 1M11 1H4M11 1V8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HeroCTA({ onWhatsAppClick }) {
  return (
    <button
      onClick={onWhatsAppClick}
      className="hero-cta"
      role="button"
      style={{ opacity: 0 }}
    >
      <span className="hero-cta__label">{COPY.cta}</span>
      <span className="hero-cta__arrow">
        <ArrowDiagonal />
      </span>
    </button>
  );
}