import { useRef } from 'react';
import AmbientOrb from './AmbientOrb';
import { useServicesAnimations } from '../hooks/useServicesAnimation.js';
import './services.css';

const SERVICES = [
  {
    id: '01',
    title: 'Sistemas de Captación de Clientes',
    function: 'Estrategias digitales y campañas publicitarias para atraer personas interesadas y convertirlas en clientes. Incluye contenido, publicidad, páginas web, embudos y tiendas online.',
    tag: 'Captación',
    cta: 'Quiero más clientes',
    href: '#contacto',
  },
  {
    id: '02',
    title: 'Desarrollo de Software a Medida',
    function: 'Si tu negocio necesita una herramienta específica, la creamos. Gestión de clientes, plataformas internas, sistemas de reservas y herramientas digitales diseñadas exactamente para vos.',
    tag: 'Software',
    cta: 'Desarrollar mi sistema',
    href: '#contacto',
  },
  {
    id: '03',
    title: 'Automatizaciones con IA',
    function: 'Automatizamos tareas para que tu empresa trabaje de forma más eficiente. Respuestas automáticas, clasificación de consultas, procesos de ventas y tareas repetitivas.',
    tag: 'Automatización',
    cta: 'Automatizar mi negocio',
    href: '#contacto',
  },
  {
    id: '04',
    title: 'Creación de Contenido con IA',
    function: 'Contenido digital optimizado para redes sociales, campañas y páginas web usando IA. Producción más rápida, presencia constante y mensajes optimizados para captar clientes.',
    tag: 'Contenido IA',
    cta: 'Crear contenido',
    href: '#contacto',
  },
  {
    id: '05',
    title: 'Contenido Real',
    function: 'Equipo de marketing que produce contenido real para empresas en Tucumán. Grabación de videos, fotografía profesional y piezas humanizadas para redes y campañas.',
    tag: 'Tucumán',
    cta: 'Quiero contenido real',
    href: '#contacto',
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
    <section className="sv-section" ref={sectionRef} aria-label="Qué incluye el servicio">

      {/* Ambient orb — left side, different position from the PS orb */}
      <AmbientOrb side="left" top="20%" parallaxY={32} size="clamp(280px, 38vw, 520px)" />

      <div className="sv-header">
        <span className="sv-eyebrow">Lo que hacemos</span>
        <h2 className="sv-title">
          Soluciones digitales que<br />
          <em className="sv-title__accent">generan resultados.</em>
        </h2>
        <p className="sv-subtitle">
          Trabajamos con negocios que quieren crecer online — desde captar clientes hasta automatizar procesos.
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

            <a href={s.href} className="sv-card__cta" tabIndex={-1} aria-label={s.cta}>
              <span>{s.cta}</span>
              <ArrowRight />
            </a>

            <div className="sv-card__line" aria-hidden="true" />
          </article>
        ))}
      </div>

      <p className="sv-closing">
        Cada servicio está diseñado para que <strong>tu negocio venda más</strong>.
      </p>
    </section>
  );
}