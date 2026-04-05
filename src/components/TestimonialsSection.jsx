import { useRef } from 'react';
import AmbientOrb from './AmbientOrb';
import { useTestimonialsAnimations } from '../hooks/useTestimonialsAnimations.js';
import ColorUva from '../assets/coloruva.jpg';
import Albiero  from '../assets/albiero.png';
import Canepa   from '../assets/aclogo.png';
import './testimonials.css';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Maria Emilia',
    role: 'CEO, ColorUva',
    quote: 'Empezamos de cero sin ventas en la web y ahora facturamos de forma estable. Ordenaron nuestro contenido y nos guiaron paso a paso. Son muy atentos de todo lo que pasa en mi local.',
    metrics: [
      { value: '68%',  label: 'Tasa Conv.' },
      { value: '5.8x', label: 'ROAS'       },
    ],
    logo: ColorUva,
    logoAlt: 'ColorUva',
    placeholder: 'ME',
    url: 'https://coloruva.com.ar/',
    urlLabel: 'Visitar sitio web',
    urlIcon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    ),
    featured: false,
  },
  {
    id: 2,
    name: 'Alejandro Zambrizzi',
    role: 'Director, Albiero Seguridad',
    quote: 'Nuestra presencia online se transformó completamente. Pasamos de recibir apenas 10 consultas a más de 300 leads mensuales. El crecimiento ha sido exponencial y constante cada mes.',
    metrics: [
      { value: '+2900%',   label: 'Leads'        },
      { value: '10 → 300', label: 'Mensajes/Mes'  },
    ],
    logo: Albiero,
    logoAlt: 'Albiero Seguridad',
    placeholder: 'AZ',
    url: 'https://www.instagram.com/albieroseguridad.tuc/',
    urlLabel: 'Ver Instagram',
    urlIcon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    featured: true,
  },
  {
    id: 3,
    name: 'Alejandro Canepa',
    role: 'Dueño, Canepa Peluquería',
    quote: 'Creamos contenido desde cero logrando una presencia online sólida. Los resultados son claros: pasamos de cero a generar entre 250 y 350 mensajes de clientas de calidad.',
    metrics: [
      { value: '250-350', label: 'Mensajes/Mes' },
      { value: 'Desde 0', label: 'Inicio'        },
    ],
    logo: Canepa,
    logoAlt: 'Canepa Peluquería',
    placeholder: 'AC',
    url: 'https://www.facebook.com/alejandrocanepapeluqueria1',
    urlLabel: 'Visitar Facebook',
    urlIcon: (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
    featured: false,
  },
];

const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const ArrowDiag = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Testimonials({ onWhatsAppClick }) {
  const sectionRef = useRef(null);
  useTestimonialsAnimations(sectionRef);

  return (
    <section
      className="tm-section"
      ref={sectionRef}
      aria-label="Casos de éxito"
    >
      {/* Background gradient */}
      <div className="tm-bg" aria-hidden="true" />

      {/* Orb — right side, upper area */}
      <AmbientOrb
        side="right"
        top="5%"
        parallaxY={30}
        size="clamp(260px, 34vw, 480px)"
      />

      <div className="tm-inner">

        {/* ── Header ── */}
        <div className="tm-header">
          <span className="tm-eyebrow">Casos de éxito</span>
          <h2 className="tm-title">
            Resultados que<br />
            <em className="tm-title__accent">hablan por sí mismos.</em>
          </h2>
        </div>

        {/* ── Cards ── */}
        <div className="tm-grid">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.id}
              className={`tm-card${t.featured ? ' tm-card--featured' : ''}`}
              aria-label={`Testimonio de ${t.name}`}
            >
              {t.featured && (
                <div className="tm-card__badge" aria-label="Caso destacado">
                  ★ Destacado
                </div>
              )}

              {/* Header row */}
              <div className="tm-card__head">
                <div className="tm-avatar">
                  <img
                    src={t.logo}
                    alt={t.logoAlt}
                    className="tm-avatar__img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `<span class="tm-avatar__fallback">${t.placeholder}</span>`;
                    }}
                  />
                </div>
                <div className="tm-card__info">
                  <p className="tm-card__name">{t.name}</p>
                  <p className="tm-card__role">{t.role}</p>
                </div>
                <div className="tm-card__stars" aria-label="5 estrellas">★★★★★</div>
              </div>

              {/* Quote */}
              <blockquote className="tm-quote">"{t.quote}"</blockquote>

              {/* Metrics */}
              <div className="tm-metrics" aria-label="Resultados">
                {t.metrics.map((m, mi) => (
                  <div key={mi} className="tm-metric">
                    <span className="tm-metric__value">{m.value}</span>
                    <span className="tm-metric__label">{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Link */}
              <a
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tm-card__link"
                aria-label={t.urlLabel}
              >
                {t.urlIcon}
                <span>{t.urlLabel}</span>
                <ArrowDiag />
              </a>

              {/* Accent bottom line */}
              <div className="tm-card__line" aria-hidden="true" />
            </article>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="tm-cta">
          <p className="tm-cta__text">¿Listo para resultados como estos?</p>
          <button className="tm-cta__btn" onClick={onWhatsAppClick} aria-label="Contactar por WhatsApp">
            <WaIcon />
            <span>Sí, quiero estos resultados</span>
          </button>
        </div>

      </div>
    </section>
  );
}