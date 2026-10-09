import { useRef } from 'react';
import { Link } from 'react-router-dom';
import AmbientOrb from './AmbientOrb';
import { useServicesAnimations } from '../hooks/useServicesAnimation.js';
import './services.css';

const SERVICES = [
  {
    id: '01',
    title: 'Marketing y Contenido',
    function: 'Publicidad, redes sociales, reels, diseño y mensajes claros para que más personas conozcan tu negocio y entiendan por qué elegirte.',
    tag: 'Marketing',
    cta: 'Ver marketing',
    href: '/marketing',
  },
  {
    id: '02',
    title: 'Desarrollo y Tecnología',
    function: 'Páginas web, tiendas online, sistemas internos y herramientas digitales creadas para la forma real en la que trabaja tu empresa.',
    tag: 'Desarrollo',
    cta: 'Ver desarrollo',
    href: '/desarrollo',
  },
  {
    id: '03',
    title: 'Landing Pages',
    function: 'Páginas pensadas para presentar tu negocio, explicar tu oferta y recibir consultas. Con plantilla o totalmente a medida.',
    tag: 'Webs',
    cta: 'Ver opciones',
    href: '/landing-pages',
  },
  {
    id: '04',
    title: 'Software a Medida',
    function: 'Cuando necesitás una herramienta que no existe lista para usar, la pensamos y la desarrollamos con el alcance justo.',
    tag: 'Sistemas',
    cta: 'Hablar de mi sistema',
    href: '/desarrollo',
  },
  {
    id: '05',
    title: 'Plataformas Propias',
    function: '219Shops, 219Meds y nuevos productos creados por nuestro equipo para resolver problemas concretos de distintos negocios.',
    tag: 'Productos',
    cta: 'Ver productos',
    href: '/productos',
  },
];

function ArrowRight() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
      <path d="M1 10L10 1M10 1H3.5M10 1V7.5"
        stroke="currentColor" strokeWidth="1.6"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Services() {
  const sectionRef = useRef(null);
  useServicesAnimations(sectionRef);

  return (
    <section className="sv-section" id="servicios" ref={sectionRef} aria-label="Qué hace 219Labs">

      {/* Ambient orb — left side, different position from the PS orb */}
      <AmbientOrb side="left" top="20%" parallaxY={32} size="clamp(280px, 38vw, 520px)" />

      <div className="sv-header">
        <span className="sv-eyebrow">Lo que hacemos</span>
        <h2 className="sv-title">
          Dos especialidades.<br />
          <em className="sv-title__accent">Un mismo objetivo.</em>
        </h2>
        <p className="sv-subtitle">
          Hay empresas que necesitan vender más. Otras necesitan organizar mejor su trabajo. Muchas necesitan las dos cosas.
        </p>
      </div>

      <div className="sv-grid">
        {SERVICES.map((s) => (
          <article
            key={s.id}
            className="sv-card"
            tabIndex={0}
            aria-label={s.title}
          >
            <span className="sv-card__bg-num" aria-hidden="true">{s.id}</span>

            <div className="sv-card__top">
              <span className="sv-card__tag">{s.tag}</span>
              <span className="sv-card__id" aria-hidden="true">{s.id}</span>
            </div>

            <h3 className="sv-card__title">{s.title}</h3>
            <p className="sv-card__function">{s.function}</p>

            <Link to={s.href} className="sv-card__cta" tabIndex={-1} aria-label={s.cta}>
              <span>{s.cta}</span>
              <ArrowRight />
            </Link>

            <div className="sv-card__line" aria-hidden="true" />
          </article>
        ))}
      </div>

      <p className="sv-closing">
        Todo se ordena alrededor de algo simple: <strong>que tu negocio avance.</strong>
      </p>
    </section>
  );
}
