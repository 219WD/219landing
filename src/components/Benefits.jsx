import { useRef } from "react";
import { Link } from "react-router-dom";
import mockup from "../assets/mockup1-cutout.png";
import AmbientOrb from "./AmbientOrb";
import { useBenefitsAnimations } from "../hooks/useBenefitsAnimations.js";
import "./benefits.css";

const BENEFITS = [
  {
    id: "01",
    text: "Que más personas entiendan qué ofrecés",
    detail:
      "Una comunicación más clara hace que tu negocio deje de depender de explicaciones eternas por mensaje.",
    cta: "Ordenar mi comunicación",
    href: "/marketing",
  },
  {
    id: "02",
    text: "Recibir consultas con una web preparada",
    detail:
      "Una página bien hecha muestra servicios, genera confianza y deja listo el próximo paso.",
    cta: "Quiero una web",
    href: "/desarrollo/paginas-web-landing-pages",
  },
  {
    id: "03",
    text: "Tener campañas y contenido con dirección",
    detail:
      "No se trata de subir cosas por subir. Se trata de publicar, medir y mejorar con un objetivo.",
    cta: "Mejorar mi marketing",
    href: "/marketing",
  },
  {
    id: "04",
    text: "Crear herramientas para trabajar mejor",
    detail:
      "Si tu operación necesita un sistema propio, lo podemos diseñar alrededor de tus procesos reales.",
    cta: "Desarrollar mi sistema",
    href: "/desarrollo/software-a-medida",
  },
];

export default function Benefits() {
  const sectionRef = useRef(null);
  useBenefitsAnimations(sectionRef);

  return (
    <section className="bn-section" ref={sectionRef} aria-label="Beneficios">
      {/* Background layers */}
      <div className="bn-bg" aria-hidden="true">
        <div className="bn-bg__gradient" />
        <div className="bn-bg__grain" />
      </div>

      {/* Ambient orb — right side, different top than Services (left) */}
      <AmbientOrb
        side="right"
        top="10%"
        parallaxY={24}
        size="clamp(300px, 40vw, 560px)"
      />

      <div className="bn-inner">
        {/* ── left column: text ── */}
        <div className="bn-content">
          <span className="bn-eyebrow">Beneficios</span>
          <h2 className="bn-title">
            Con 219Labs
            <br />
            tu negocio <em className="bn-title__accent">ordena y avanza.</em>
          </h2>
          <ul className="bn-list" aria-label="Beneficios del sistema">
            {BENEFITS.map((b) => (
              <li key={b.id} className="bn-item">
                <div className="bn-item__left">
                  <span className="bn-item__num" aria-hidden="true">
                    {b.id}
                  </span>
                  <span className="bn-item__bar" aria-hidden="true" />
                </div>
                <div className="bn-item__right">
                  <p className="bn-item__text">{b.text}</p>
                  <p className="bn-item__detail">{b.detail}</p>
                  <Link to={b.href} className="bn-item__cta">
                    {b.cta}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 11L11 1M11 1H4M11 1V8"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ── right column: floating mockup ── */}
        <div className="bn-visual" aria-hidden="true">
          <div className="bn-visual__glow" />
          <div className="bn-mockup-wrapper">
            <img
              src={mockup}
              alt="Mockup de página web en una notebook"
              className="bn-mockup"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
