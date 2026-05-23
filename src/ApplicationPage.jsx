import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LogoFooter from "./assets/logo-blanco.png";
import "./application.css";

const WHATSAPP_NUMBER = "5493816671884";

const revenueOptions = [
  { value: "menos-3k", label: "Menos de USD 3k/mes" },
  { value: "3k-10k", label: "USD 3k-10k" },
  { value: "10k-30k", label: "USD 10k-30k" },
  { value: "30k-plus", label: "USD 30k+" },
];

const budgetOptions = [
  { value: "menos-1000", label: "Menos de USD 1000" },
  { value: "1000-1500", label: "USD 1000-1500" },
  { value: "1500-3000", label: "USD 1500-3000" },
  { value: "3000-plus", label: "USD 3000+" },
];

const channelOptions = [
  "Referidos",
  "Instagram",
  "Meta Ads",
  "Google",
  "LinkedIn",
  "Ninguno",
];

const problemOptions = [
  "Más clientes",
  "Mejor conversión",
  "Automatización",
  "Escalar",
  "Otro",
];

const initialForm = {
  revenue: "",
  budget: "",
  clientsPerMonth: "",
  channels: [],
  problems: [],
  otherProblem: "",
  why219: "",
};

function toggleValue(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export default function ApplicationPage() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState(null);

  const canContinueFromBudget = form.revenue && form.budget;
  const canSubmit = useMemo(() => {
    return (
      form.clientsPerMonth.trim() &&
      form.channels.length > 0 &&
      form.problems.length > 0 &&
      (!form.problems.includes("Otro") || form.otherProblem.trim()) &&
      form.why219.trim().length >= 10
    );
  }, [form]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const correctRejectedAnswer = () => {
    setStep(status === "budget" ? 2 : 1);
    setStatus(null);
  };

  const selectRevenue = (value) => {
    updateField("revenue", value);
    if (value === "menos-3k") {
      setStatus("early");
      setStep(1);
      return;
    }

    setStatus(null);
    setStep(2);
  };

  const selectBudget = (value) => {
    updateField("budget", value);
    if (value === "menos-1000") {
      setStatus("budget");
      return;
    }

    setStatus(null);
    setStep(3);
  };

  const submitApplication = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    const selectedProblems = form.problems
      .map((problem) => (problem === "Otro" ? `Otro: ${form.otherProblem}` : problem))
      .join(", ");

    const message = [
      "Hola 219Labs, quiero que revisen mi negocio.",
      "",
      `Facturación actual: ${revenueOptions.find((item) => item.value === form.revenue)?.label}`,
      `Presupuesto mensual para crecimiento: ${budgetOptions.find((item) => item.value === form.budget)?.label}`,
      `Clientes generados por mes hoy: ${form.clientsPerMonth}`,
      `Canales actuales: ${form.channels.join(", ")}`,
      `Problema a resolver: ${selectedProblems}`,
      `Por qué quiero trabajar con 219Labs: ${form.why219}`,
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <main className="application-page">
      <div className="application-shell">
        <header className="application-header">
          <Link to="/" className="application-logo" aria-label="Volver al inicio">
            <img src={LogoFooter} alt="219Labs" />
          </Link>
          <Link to="/" className="application-back">
            Volver
          </Link>
        </header>

        <section className="application-intro" aria-labelledby="application-title">
          <p className="application-kicker">Aplicación</p>
          <h1 id="application-title">
            Trabajamos con <em>empresas</em> que buscan construir sistemas reales de <em>crecimiento y adquisición de clientes.</em>
          </h1>
          <p>
            Nuestros proyectos suelen comenzar desde USD 1.000 mensuales + inversión publicitaria.
          </p>
          <p>
            Si tu objetivo es una página económica o soluciones rápidas, probablemente no seamos el mejor fit.
          </p>
        </section>

        <form className="application-form" onSubmit={submitApplication}>
          {status === "early" && (
            <div className="application-result" role="status">
              <h2>Posiblemente todavía no sea el momento ideal para trabajar juntos.</h2>
              <p>Seguinos y aprendé gratis hasta que tu negocio esté listo para construir un sistema de adquisición más serio.</p>
              <a href="https://instagram.com/219labs" target="_blank" rel="noopener noreferrer">
                Ver recursos gratuitos
              </a>
              <button type="button" className="application-restart" onClick={correctRejectedAnswer}>
                Fue un error, quiero corregirlo
              </button>
            </div>
          )}

          {status === "budget" && (
            <div className="application-result" role="status">
              <h2>Hoy trabajamos con empresas con presupuestos mayores.</h2>
              <p>Te dejamos recursos gratuitos para que puedas seguir mejorando tu adquisición sin iniciar un proyecto todavía.</p>
              <a href="https://instagram.com/219labs" target="_blank" rel="noopener noreferrer">
                Ver recursos gratuitos
              </a>
              <button type="button" className="application-restart" onClick={correctRejectedAnswer}>
                Fue un error, quiero corregirlo
              </button>
            </div>
          )}

          {!status && (
            <>
              <div className="application-progress" aria-hidden="true">
                {[1, 2, 3].map((item) => (
                  <span key={item} className={step >= item ? "is-active" : ""} />
                ))}
              </div>

              <section className="application-step" aria-labelledby="revenue-title">
                <div className="application-step__header">
                  <span>Paso 1</span>
                  <h2 id="revenue-title">¿Tu empresa factura actualmente?</h2>
                </div>
                <div className="application-options">
                  {revenueOptions.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      className={form.revenue === option.value ? "is-selected" : ""}
                      onClick={() => selectRevenue(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>

              {step >= 2 && (
                <section className="application-step" aria-labelledby="budget-title">
                  <div className="application-step__header">
                    <span>Paso 2</span>
                    <h2 id="budget-title">¿Cuál es tu presupuesto mensual disponible para crecimiento?</h2>
                  </div>
                  <div className="application-options">
                    {budgetOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={form.budget === option.value ? "is-selected" : ""}
                        onClick={() => selectBudget(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {step >= 3 && canContinueFromBudget && (
                <section className="application-step" aria-labelledby="details-title">
                  <div className="application-step__header">
                    <span>Paso 3</span>
                    <h2 id="details-title">Contanos dónde están hoy.</h2>
                  </div>

                  <label className="application-field">
                    <span>¿Cuántos clientes generan por mes hoy?</span>
                    <input
                      value={form.clientsPerMonth}
                      onChange={(event) => updateField("clientsPerMonth", event.target.value)}
                      placeholder="Ej: 20 clientes por mes"
                    />
                  </label>

                  <fieldset className="application-fieldset">
                    <legend>¿Qué canales usan actualmente?</legend>
                    <div className="application-checks">
                      {channelOptions.map((channel) => (
                        <label key={channel}>
                          <input
                            type="checkbox"
                            checked={form.channels.includes(channel)}
                            onChange={() => updateField("channels", toggleValue(form.channels, channel))}
                          />
                          <span>{channel}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="application-fieldset">
                    <legend>¿Qué problema querés resolver?</legend>
                    <div className="application-checks">
                      {problemOptions.map((problem) => (
                        <label key={problem}>
                          <input
                            type="checkbox"
                            checked={form.problems.includes(problem)}
                            onChange={() => updateField("problems", toggleValue(form.problems, problem))}
                          />
                          <span>{problem}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {form.problems.includes("Otro") && (
                    <label className="application-field">
                      <span>¿Cuál?</span>
                      <input
                        value={form.otherProblem}
                        onChange={(event) => updateField("otherProblem", event.target.value)}
                        placeholder="Contanos brevemente"
                      />
                    </label>
                  )}

                  <label className="application-field">
                    <span>¿Por qué querés trabajar con 219Labs específicamente?</span>
                    <textarea
                      value={form.why219}
                      onChange={(event) => updateField("why219", event.target.value)}
                      placeholder="Queremos entender si hay fit real antes de hablar."
                      rows="5"
                    />
                  </label>

                  <div className="application-note">
                    <p>No trabajamos con todas las empresas.</p>
                    <p>Buscamos negocios que ya validaron su oferta y quieran construir un sistema escalable de adquisición.</p>
                    <p>Revisamos cada solicitud manualmente.</p>
                  </div>

                  <button className="application-submit" type="submit" disabled={!canSubmit}>
                    Quiero que revisen mi negocio
                  </button>
                </section>
              )}
            </>
          )}
        </form>
      </div>
    </main>
  );
}
