import { useRef } from 'react';
import AmbientOrb from './AmbientOrb';
import { useForWhoAnimations } from '../hooks/useForWhoAnimations.js';
import './for-who.css';

const PROFILES = [
  {
    id: '01',
    label: 'Empresas',
    text: 'Empresas que quieren vender más online',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="7" width="16" height="11" rx="1" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M6 7V5a4 4 0 018 0v2" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="10" cy="13" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: '02',
    label: 'Negocios',
    text: 'Negocios que quieren atraer clientes nuevos',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 8.5L10 3l7 5.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V8.5z" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M7 18v-6h6v6" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    id: '03',
    label: 'Emprendedores',
    text: 'Emprendedores que quieren escalar su negocio',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.5 7.5H18L13.5 11l2 6L10 14l-5.5 3 2-6L2 7.5h5.5L10 2z"
          stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function ForWho() {
  const sectionRef = useRef(null);
  useForWhoAnimations(sectionRef);

  return (
    <section className="fw-section" ref={sectionRef} aria-label="Para quién es este servicio">

      {/* Diagonal animated background */}
      <div className="fw-bg" aria-hidden="true" />

      {/* Orb — bottom-left, low position so it peeks from below the cards */}
      <AmbientOrb
        side="left"
        top="55%"
        parallaxY={20}
        size="clamp(240px, 32vw, 440px)"
      />

      <div className="fw-inner">

        {/* ── centred header ── */}
        <div className="fw-header">
          <span className="fw-eyebrow">Para quién es</span>
          <h2 className="fw-title">
            Este sistema es <em className="fw-title__accent">ideal para</em>
          </h2>
        </div>

        {/* ── cards ── */}
        <div className="fw-cards">
          {PROFILES.map((p, i) => (
            <div key={p.id} className="fw-card">
              <div className="fw-card__num" aria-hidden="true">{p.id}</div>
              <div className="fw-card__icon">{p.icon}</div>
              <p className="fw-card__label">{p.label}</p>
              <p className="fw-card__text">{p.text}</p>
              <div className="fw-card__corner" aria-hidden="true" />
            </div>
          ))}
        </div>

        {/* ── closing line ── */}
        <p className="fw-closing">
          Si tu negocio necesita clientes,<br />
          <strong>este sistema es para vos.</strong>
        </p>

      </div>
    </section>
  );
}