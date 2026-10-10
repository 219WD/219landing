import { Link } from "react-router-dom";
import AmbientOrb from "./AmbientOrb";
import "./landing-options.css";

const OPTIONS = [
  {
    id: "01",
    eyebrow: "Presencia digital",
    title: "Necesito una página que explique bien mi negocio.",
    text: "Para presentar servicios, mostrar confianza y recibir consultas sin depender de explicaciones eternas por mensaje.",
    primary: "Ver páginas web",
    href: "/desarrollo/paginas-web-landing-pages",
    items: ["Landing pages", "Sitios institucionales", "Plantilla o a medida"],
  },
  {
    id: "02",
    eyebrow: "Venta online",
    title: "Quiero vender o mostrar productos de forma más ordenada.",
    text: "Tiendas online, catálogos y plataformas comerciales para que el cliente entienda qué comprás, cómo consulta y cómo avanza.",
    primary: "Ver tiendas",
    href: "/desarrollo/tiendas-online-plataformas",
    items: ["Productos", "Pedidos", "Pagos y envíos"],
  },
  {
    id: "03",
    eyebrow: "Operación",
    title: "Hay tareas que mi equipo repite todos los días.",
    text: "Automatizaciones e integraciones para ordenar consultas, datos, avisos y procesos que hoy se hacen a mano.",
    primary: "Ver automatizaciones",
    href: "/desarrollo/automatizaciones",
    items: ["Formularios", "Avisos", "Datos conectados"],
  },
];

export default function LandingOptions() {
  return (
    <section className="lo-section" id="servicios-destacados" aria-label="Servicios destacados">
      <AmbientOrb side="right" top="20%" parallaxY={26} size="clamp(260px, 34vw, 500px)" />
      <div className="lo-inner">
        <div className="lo-header">
          <span className="lo-eyebrow">Atajos concretos</span>
          <h2 className="lo-title">
            Si ya sabés el problema, entrá <em>por ahí.</em>
          </h2>
          <p>
            No todos llegan con la misma necesidad. Algunos necesitan vender mejor, otros ordenar la operación y otros empezar por una web clara.
          </p>
        </div>

        <div className="lo-grid">
          {OPTIONS.map((option) => (
            <article className="lo-card" key={option.id}>
              <span className="lo-card__num" aria-hidden="true">{option.id}</span>
              <p className="lo-card__eyebrow">{option.eyebrow}</p>
              <h3>{option.title}</h3>
              <p>{option.text}</p>
              <ul>
                {option.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link to={option.href} className="lo-card__cta">
                <span>{option.primary}</span>
                <Arrow />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
