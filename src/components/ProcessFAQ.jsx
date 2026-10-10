import { Link } from "react-router-dom";
import "./process-faq.css";

const STEPS = [
  ["01", "Nos contás qué necesitás", "Puede ser una web, una campaña, un sistema o una idea todavía medio desordenada."],
  ["02", "Te proponemos un camino", "Definimos qué conviene hacer, con qué alcance y por dónde empezar."],
  ["03", "Lo ponemos en marcha", "Diseñamos, desarrollamos, medimos y ajustamos con una dirección clara."],
];

const FAQS = [
  ["¿Puedo contratar solo marketing o solo desarrollo?", "Sí. Las dos áreas pueden trabajar juntas o por separado, según lo que necesite tu negocio."],
  ["¿Marketing se trabaja mensual o por trabajo puntual?", "Las dos opciones existen. Podemos pensar un plan mensual o resolver una necesidad concreta como campaña, reel, diseño o producción."],
  ["¿Desarrollo siempre implica hacer algo a medida?", "No. A veces conviene una página con plantilla, una plataforma existente o una integración simple. Lo definimos según el objetivo y el presupuesto."],
  ["¿Qué diferencia hay entre una página con plantilla y una a medida?", "La plantilla parte de una base profesional y es más accesible. La web a medida se piensa desde cero para tu marca, objetivos y funciones."],
  ["¿Trabajan con emprendimientos y empresas?", "Sí, pero buscamos proyectos donde podamos aportar algo real. Si todavía no es el momento, también te lo vamos a decir."],
  ["¿Tengo que saber exactamente qué necesito?", "No. Con que sepas qué querés lograr, podemos ayudarte a ordenar el camino."],
];

export default function ProcessFAQ() {
  return (
    <section className="pf-section" id="nosotros" aria-label="Cómo trabajamos y preguntas frecuentes">
      <div className="pf-inner">
        <div className="pf-process">
          <span className="pf-eyebrow">Cómo trabajamos</span>
          <h2>No necesitás tener todo resuelto para empezar.</h2>
          <div className="pf-steps">
            {STEPS.map(([num, title, text]) => (
              <article key={num} className="pf-step">
                <span>{num}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="pf-faq">
          <span className="pf-eyebrow">Preguntas frecuentes</span>
          <h2>Dudas normales antes de escribirnos.</h2>
          <div className="pf-faq__list">
            {FAQS.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
          <Link to="/aplicar" className="pf-cta">
            <span>Contanos qué necesitás</span>
            <Arrow />
          </Link>
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
