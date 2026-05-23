import { useRef } from 'react';
import AmbientOrb from './AmbientOrb';
import { useFinalCTAAnimations } from '../hooks/useFinalCTAAnimations.js';
import './final-cta.css';

const AUDIT_POINTS = [
  'Qué está frenando tus ventas online',
  'Qué oportunidades estás perdiendo',
  'Qué sistema podrías implementar para crecer',
];

const ApplyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M14 3v5h5M9.5 14l2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function FinalCTA({ onWhatsAppClick }) {
  const sectionRef = useRef(null);
  useFinalCTAAnimations(sectionRef);

  return (
    <section
      className="fc-section"
      ref={sectionRef}
      aria-label="Sección final de contacto"
    >
      {/* Scrolling grid background */}
      <div className="fc-bg" aria-hidden="true" />

      {/* Central radial glow */}
      <div className="fc-glow" aria-hidden="true" />

      {/* Orb — left side, low */}
      <AmbientOrb
        side="left"
        top="30%"
        parallaxY={22}
        size="clamp(240px, 30vw, 420px)"
      />

      <div className="fc-inner">

        {/* Divider — animated line that draws across */}
        <div className="fc-divider" aria-hidden="true" />

        {/* ── Two column layout ── */}
        <div className="fc-grid">

          {/* LEFT — Audit offer */}
          <div className="fc-audit">
            <span className="fc-audit__eyebrow">Gratis</span>

            <h2 className="fc-audit__title">
              Auditoría<br />
              <em className="fc-audit__title-accent">gratuita</em>
            </h2>

            <p className="fc-audit__intro">
              Analizamos tu negocio y te mostramos:
            </p>

            <ul className="fc-audit__list" aria-label="Qué incluye la auditoría">
              {AUDIT_POINTS.map((point, i) => (
                <li key={i} className="fc-audit__bullet">
                  <span className="fc-audit__dash" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>

            <p className="fc-audit__note">
              Sin compromiso. Sin costo. Solo claridad.
            </p>
          </div>

          {/* Vertical separator */}
          <div className="fc-vsep" aria-hidden="true" />

          {/* RIGHT — Main CTA */}
          <div className="fc-cta">
            <h3 className="fc-cta__headline">
              Tu negocio puede vender
              <em className="fc-cta__headline-accent"> mucho más online.</em>
            </h3>

            <p className="fc-cta__body">
              Si querés entender qué está frenando el crecimiento de tu empresa y cómo solucionarlo, podemos analizar tu caso.
            </p>

            <button
              className="fc-cta__btn"
              onClick={onWhatsAppClick}
              aria-label="Aplicar para que revisen mi negocio"
            >
              <ApplyIcon />
              <span>Quiero que revisen mi negocio</span>
            </button>

            <p className="fc-cta__sub">
              Respondemos en menos de 24&nbsp;hs.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
