import { useRef } from "react";
import mockup from "../assets/mockup1.png";
import AmbientOrb from "./AmbientOrb";
import { useBenefitsAnimations } from "../hooks/useBenefitsAnimations.js";
import "./benefits.css";

const WP_URL =
  "https://wa.me/5493816671884?text=Hola%2C%20quiero%20implementar%20el%20sistema";

const BENEFITS = [
  {
    id: "01",
    text: "Atraer más clientes",
    detail:
      "Tu negocio aparece donde tu cliente ya está buscando. Sin esperar, sin depender del algoritmo de turno.",
    cta: "Quiero más clientes",
  },
  {
    id: "02",
    text: "Vender cuando el local está cerrado",
    detail:
      "El sistema trabaja 24/7. A las 2am, un domingo, en feriado. Vos no tenés que estar presente para cerrar una venta.",
    cta: "Quiero vender sin parar",
  },
  {
    id: "03",
    text: "Flujo de consultas constante",
    detail:
      "Nada de meses buenos y meses muertos. Un sistema predecible que trae consultas todos los días.",
    cta: "Quiero consistencia",
  },
  {
    id: "04",
    text: "Dejar de depender del boca a boca",
    detail:
      "Crecé sin esperar que alguien te recomiende. Tomá el control de cómo y cuántos clientes entran a tu negocio.",
    cta: "Quiero tomar el control",
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
            Con este sistema
            <br />
            tu negocio <em className="bn-title__accent">puede.</em>
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
                  <a
                    href={WP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bn-item__cta"
                  >
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
                  </a>
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
