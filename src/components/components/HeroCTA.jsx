import { COPY } from "../constants/theme";
import { Link } from "react-router-dom";

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
    <div className="hero-choice" style={{ opacity: 0 }}>
      <Link to="/desarrollo" className="hero-choice__card hero-choice__card--primary">
        <span className="hero-choice__eyebrow">Desarrollo y tecnología</span>
        <strong>Necesito una web o un sistema</strong>
        <small>Webs, tiendas online, software y plataformas.</small>
        <span className="hero-choice__arrow"><ArrowDiagonal /></span>
      </Link>

      <Link to="/marketing" className="hero-choice__card">
        <span className="hero-choice__eyebrow">Marketing y contenido</span>
        <strong>Quiero conseguir más clientes</strong>
        <small>Publicidad, redes, contenido y estrategia.</small>
        <span className="hero-choice__arrow"><ArrowDiagonal /></span>
      </Link>

      <button onClick={onWhatsAppClick} className="hero-cta hero-choice__direct" type="button">
        <span className="hero-cta__label">{COPY.cta}</span>
        <span className="hero-cta__arrow">
          <ArrowDiagonal />
        </span>
      </button>
    </div>
  );
}
