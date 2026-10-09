import { useRef } from "react";
import { Link } from "react-router-dom";
import ScrollOrb from "./ScrollOrb";
import { useOrbFluid } from "../hooks/useOrbFluid.js";
import { useProblemSolutionAnimations } from "../hooks/useProblemSolutionAnimations.js";
import "./problem-solution.css";

const problems = [
  "Redes que no traen consultas",
  "Páginas que no explican bien lo que vendés",
  "Procesos internos que dependen de mil cosas manuales",
];

const steps = [
  { n: "01", text: "Entendemos qué necesita lograr tu negocio" },
  { n: "02", text: "Definimos si conviene marketing, desarrollo o ambas cosas" },
  { n: "03", text: "Creamos las piezas, campañas o herramientas necesarias" },
  { n: "04", text: "Medimos, ajustamos y seguimos mejorando" },
];

// SVG timeline dimensions
const TL_X = 24; // x center of the vertical line
const STEP_H = 88; // vertical gap between nodes
const TL_TOP = 0;
const TL_BOTTOM = TL_TOP + (steps.length - 1) * STEP_H;
const SVG_W = 56;
const SVG_H = TL_BOTTOM + 1;

export default function ProblemSolution() {
  const sectionRef = useRef(null);
  const orbRef = useOrbFluid(sectionRef);
  useProblemSolutionAnimations(sectionRef);

  return (
    <section
      className="ps-section"
      ref={sectionRef}
      aria-label="El problema y la solución"
    >
      {/* ── parallax orb ── */}
      <ScrollOrb orbRef={orbRef} />

      {/* ── vertical accent rail ── */}
      <div className="ps-rail" aria-hidden="true" />

      <div className="ps-inner">
        {/* ════ PROBLEMA ════ */}
        <div className="ps-block">
          <span className="ps-eyebrow">El problema</span>

          <h2 className="ps-heading">
            Muchos negocios tienen potencial, pero todo está&nbsp;desordenado.
            <span className="ps-heading__underline" aria-hidden="true" />
          </h2>

          <ul className="ps-list" aria-label="Fuentes de clientes comunes">
            {problems.map((p, i) => (
              <li key={i} className="ps-list__item">
                <span className="ps-list__bullet" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>

          <div className="ps-consequence">
            <p className="ps-consequence__main">
              Entonces crecer se vuelve&nbsp;<em>más difícil de lo necesario.</em>
            </p>
            <div className="ps-month-toggle" aria-hidden="true">
              <span className="ps-month ps-month--good">
                Un mes aparece trabajo.
              </span>
              <span className="ps-month ps-month--bad">Otro mes hay que salir a perseguirlo.</span>
            </div>
          </div>
        </div>

        {/* ── divider ── */}
        <div className="ps-divider" aria-hidden="true">
          <span className="ps-divider__line" />
          <span className="ps-divider__dot" />
          <span className="ps-divider__line" />
        </div>

        {/* ════ SOLUCIÓN ════ */}
        <div className="ps-block">
          <span className="ps-eyebrow ps-eyebrow--accent">La solución</span>

          <h2 className="ps-heading">
            Una estrategia clara con tecnología,
            <em className="ps-heading__accent"> marketing y ejecución.</em>
          </h2>

          <p className="ps-body">El proceso funciona así:</p>

          {/* ── Steps with SVG timeline ── */}
          <div className="ps-steps-wrap">
            {/* Animated SVG path running behind the steps */}
            <svg
              className="ps-timeline-svg"
              width={SVG_W}
              height={SVG_H}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              aria-hidden="true"
            >
              {/* The line that gets drawn by scroll */}
              <path
                className="ps-timeline-path"
                d={`M${TL_X} ${TL_TOP} L${TL_X} ${TL_BOTTOM}`}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
              {/* Step node circles */}
              {steps.map((_, i) => (
                <circle
                  key={i}
                  className="ps-step-node"
                  cx={TL_X}
                  cy={TL_TOP + i * STEP_H}
                  r="4"
                  fill="var(--c-accent, #ff3e7f)"
                  opacity="0.9"
                />
              ))}
            </svg>

            {/* Step items aligned to the right of the SVG */}
            <ol className="ps-steps" aria-label="Cómo funciona el sistema">
              {steps.map((s, i) => (
                <li key={i} className="ps-step">
                  <span className="ps-step__num" aria-hidden="true">
                    {s.n}
                  </span>
                  <p className="ps-step__text">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <p className="ps-closing">
            No vendemos piezas sueltas. Armamos lo que tu negocio necesita para&nbsp;
            <strong>moverse mejor.</strong>
          </p>

          <Link to="/aplicar" className="ps-cta">
            <span className="ps-cta__label">
              Contanos qué necesitás
            </span>
            <svg
              width="12"
              height="12"
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
      </div>
    </section>
  );
}
