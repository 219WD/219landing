import { useRef } from 'react';
import { Link } from 'react-router-dom';
import AmbientOrb from './AmbientOrb';
import { useTestimonialsAnimations } from '../hooks/useTestimonialsAnimations.js';
import ColorUva from '../assets/coloruva.jpg';
import Albiero  from '../assets/albiero.png';
import Canepa   from '../assets/aclogo.png';
import { trackEvent } from '../utils/analytics.js';
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

const DEVELOPMENT_PROOF = [
  {
    label: 'Producto propio',
    title: '219Shops',
    text: 'Tienda online y plataforma comercial propia para productos, pedidos, stock, cobros, envíos y clientes.',
    href: 'https://www.219shops.com.ar/',
    cta: 'Visitar plataforma',
  },
  {
    label: 'Diseños navegables',
    title: 'Catálogo 219Shops',
    text: 'Referencias reales por rubro para que un cliente pueda ver una base de página antes de pedir presupuesto.',
    href: 'https://www.219shops.com.ar/disenos',
    cta: 'Ver diseños',
  },
  {
    label: 'Desarrollo a medida',
    title: 'Sistemas y automatizaciones',
    text: 'Trabajo técnico orientado a resolver procesos internos, integraciones y herramientas que acompañan la operación.',
    href: '/desarrollo/software-a-medida',
    cta: 'Ver desarrollo',
    internal: true,
  },
];

const ApplyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M7 3h7l4 4v14H7V3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M14 3v5h5M9.5 14l2 2 4-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
      id="casos"
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
                onClick={() => trackEvent('product_outbound_click', {
                  label: t.urlLabel,
                  href: t.url,
                  source: 'testimonial',
                })}
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

        <div className="tm-development" aria-label="Evidencia de desarrollo">
          <div className="tm-development__head">
            <span className="tm-eyebrow">Desarrollo comprobable</span>
            <h3>Además de campañas, también construimos producto y tecnología propia.</h3>
            <p>
              Estos no son testimonios inventados: son accesos a plataformas, diseños y líneas de desarrollo que muestran cómo trabaja 219Labs cuando el problema es técnico y operativo.
            </p>
          </div>
          <div className="tm-development__grid">
            {DEVELOPMENT_PROOF.map((item) => {
              const trackProofClick = () => trackEvent('product_outbound_click', {
                label: item.title,
                href: item.href,
                source: 'development_proof',
                external: !item.internal,
              });

              const content = (
                <>
                  <span>{item.label}</span>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                  <strong>
                    {item.cta}
                    <ArrowDiag />
                  </strong>
                </>
              );

              if (item.internal) {
                return (
                  <Link
                    className="tm-development__card"
                    key={item.title}
                    to={item.href}
                    onClick={trackProofClick}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <a
                  className="tm-development__card"
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackProofClick}
                >
                  {content}
                </a>
              );
            })}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="tm-cta">
          <p className="tm-cta__text">¿Querés ordenar marketing, desarrollo o las dos cosas?</p>
          <button className="tm-cta__btn" onClick={onWhatsAppClick} aria-label="Contar qué necesita mi negocio">
            <ApplyIcon />
            <span>Quiero hablar con 219Labs</span>
          </button>
        </div>

      </div>
    </section>
  );
}
