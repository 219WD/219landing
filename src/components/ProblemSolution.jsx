import { useRef } from "react";
import ScrollOrb from "./ScrollOrb";
import { useOrbFluid } from "../hooks/useOrbFluid.js";
import { useProblemSolutionAnimations } from "../hooks/useProblemSolutionAnimations.js";
import "./problem-solution.css";

const problems = [
  "Recomendaciones boca a boca",
  "Clientes que pasan por el local",
  "Publicaciones en redes que no venden",
];

const steps = [
  { n: "01", text: "Personas interesadas encuentran tu negocio online" },
  { n: "02", text: "Llegan a una página diseñada para convencer" },
  { n: "03", text: "Un mensaje claro explica por qué elegirte" },
  { n: "04", text: "El visitante se transforma en cliente" },
];

// SVG timeline dimensions
const TL_X = 24; // x center of the vertical line
const STEP_H = 88; // vertical gap between nodes
const TL_TOP = 0;
const TL_BOTTOM = TL_TOP + (steps.length - 1) * STEP_H;
const SVG_W = 56;
const SVG_H = TL_BOTTOM + 1;

const WP_URL =
  "https://wa.me/TU_NUMERO?text=Hola%2C%20quiero%20implementar%20el%20sistema";

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
            La mayoría de los negocios dependen&nbsp;de
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
              Eso hace que las ventas sean&nbsp;<em>impredecibles.</em>
            </p>
            <div className="ps-month-toggle" aria-hidden="true">
              <span className="ps-month ps-month--good">
                Un mes vendés bien.
              </span>
              <span className="ps-month ps-month--bad">Otro mes&nbsp;no.</span>
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
            Un sistema digital que atrae clientes
            <em className="ps-heading__accent"> de forma constante.</em>
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
            Todo el sistema está diseñado para convertir&nbsp;
            <strong>visitas en ventas.</strong>
          </p>

          <a
            href={WP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ps-cta"
          >
            <span className="ps-cta__label">
              Quiero implementar este sistema
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
          </a>
        </div>
      </div>
    </section>
  );
}
