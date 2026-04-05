import { useRef } from 'react';
import AmbientOrb from './AmbientOrb';
import { useFinalCTAAnimations } from '../hooks/useFinalCTAAnimations.js';
import './final-cta.css';

const AUDIT_POINTS = [
  'Qué está frenando tus ventas online',
  'Qué oportunidades estás perdiendo',
  'Qué sistema podrías implementar para crecer',
];

const WaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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
              aria-label="Hablar con un especialista por WhatsApp"
            >
              <WaIcon />
              <span>Quiero hablar con un especialista</span>
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