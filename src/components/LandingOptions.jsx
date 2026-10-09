import { Link } from "react-router-dom";
import AmbientOrb from "./AmbientOrb";
import "./landing-options.css";

const OPTIONS = [
  {
    id: "01",
    eyebrow: "Páginas web",
    title: "Una buena página web no tiene por qué estar fuera de tu presupuesto.",
    text: "Podemos partir de una base profesional y adaptarla a tu negocio, o crear una web completamente a medida si necesitás algo más específico.",
    primary: "Ver opciones de páginas",
    href: "/landing-pages",
    items: ["Con plantilla", "A medida", "Lista para recibir consultas"],
  },
  {
    id: "02",
    eyebrow: "Marketing",
    title: "Publicar por publicar no es una estrategia.",
    text: "Creamos contenido, campañas y mensajes pensados para llegar a las personas correctas y convertir interés en oportunidades comerciales.",
    primary: "Explorar marketing",
    href: "/marketing",
    items: ["Publicidad", "Contenido", "Medición"],
  },
];

export default function LandingOptions() {
  return (
    <section className="lo-section" id="servicios" aria-label="Servicios destacados">
      <AmbientOrb side="right" top="20%" parallaxY={26} size="clamp(260px, 34vw, 500px)" />
      <div className="lo-inner">
        <div className="lo-header">
          <span className="lo-eyebrow">Servicios clave</span>
          <h2 className="lo-title">
            Entrá por donde tu negocio <em>más lo necesita.</em>
          </h2>
          <p>
            La home no tiene que explicarte veinte cosas juntas. Tiene que ayudarte a elegir el camino correcto.
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
