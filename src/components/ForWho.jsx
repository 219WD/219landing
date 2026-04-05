import { useRef } from 'react';
import AmbientOrb from './AmbientOrb';
import { useForWhoAnimations } from '../hooks/useForWhoAnimations.js';
import './for-who.css';

const WP_URL = 'https://wa.me/5493816671884?text=Hola%2C%20quiero%20implementar%20el%20sistema';

const PROFILES = [
  {
    id: '01',
    label: 'Empresas',
    text: 'Empresas que quieren vender más online',
    cta: 'Quiero vender más',
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
    cta: 'Quiero atraer clientes',
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
    cta: 'Quiero escalar',
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
      <div className="fw-bg" aria-hidden="true" />
      <AmbientOrb
        side="left"
        top="55%"
        parallaxY={20}
        size="clamp(240px, 32vw, 440px)"
      />

      <div className="fw-inner">

        <div className="fw-header">
          <span className="fw-eyebrow">Para quién es</span>
          <h2 className="fw-title">
            Este sistema es <em className="fw-title__accent">ideal para</em>
          </h2>
        </div>

        <div className="fw-cards">
          {PROFILES.map((p) => (
            <div key={p.id} className="fw-card">
              <div className="fw-card__num" aria-hidden="true">{p.id}</div>
              <div className="fw-card__icon">{p.icon}</div>
              <p className="fw-card__label">{p.label}</p>
              <p className="fw-card__text">{p.text}</p>
              <a
                href={WP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="fw-card__cta"
              >
                {p.cta}
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor"
                    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <div className="fw-card__corner" aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="fw-closing-wrap">
          <p className="fw-closing">
            Si tu negocio necesita clientes,<br />
            <strong>este sistema es para vos.</strong>
          </p>
          <a
            href={WP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="fw-cta"
          >
            <span>Quiero implementar este sistema</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor"
                strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}