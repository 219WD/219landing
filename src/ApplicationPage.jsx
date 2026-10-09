import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./application.css";

const WHATSAPP_NUMBER = "5493816671884";

const revenueOptions = [
  { value: "idea", label: "Estoy ordenando una idea" },
  { value: "emprendimiento", label: "Emprendimiento activo" },
  { value: "empresa", label: "Empresa en funcionamiento" },
  { value: "escala", label: "Empresa buscando escalar" },
];

const budgetOptions = [
  { value: "plantilla", label: "Web con plantilla" },
  { value: "medida", label: "Web o sistema a medida" },
  { value: "tienda", label: "Tienda online o plataforma" },
  { value: "automatizacion", label: "Automatización o integración" },
  { value: "dominio", label: "Dominio" },
  { value: "crm", label: "CRM" },
  { value: "marketing", label: "Marketing y contenido" },
  { value: "no-se", label: "No sé qué necesito todavía" },
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
  "Página web",
  "Sistema propio",
  "Tienda online",
  "Automatizaciones",
  "Integraciones",
  "Dominio",
  "CRM",
  "Contenido y redes",
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

const serviceDefaults = {
  "landing-pages": {
    budget: "plantilla",
    problems: ["Página web"],
    label: "Landing pages",
    intro: "Venís por una página web. Te vamos a ayudar a definir si conviene partir de una base o hacer algo a medida.",
  },
  desarrollo: {
    budget: "medida",
    problems: ["Sistema propio"],
    label: "Desarrollo",
    intro: "Venís por desarrollo. Te vamos a ayudar a ordenar si necesitás web, sistema, tienda o una herramienta a medida.",
  },
  "paginas-web-landing-pages": {
    budget: "plantilla",
    problems: ["Página web"],
    label: "Páginas web y landing pages",
    intro: "Venís por una web o landing. Te vamos a ayudar a definir si conviene partir de una base o hacer una página completamente a medida.",
  },
  "software-a-medida": {
    budget: "medida",
    problems: ["Sistema propio"],
    label: "Software a medida",
    intro: "Venís por software a medida. Te vamos a ayudar a ordenar proceso, alcance y primera versión posible.",
  },
  "tiendas-online-plataformas": {
    budget: "tienda",
    problems: ["Tienda online"],
    label: "Tiendas online y plataformas",
    intro: "Venís por una tienda o plataforma. Te vamos a ayudar a entender catálogo, operación, pagos, pedidos e integraciones necesarias.",
  },
  automatizaciones: {
    budget: "automatizacion",
    problems: ["Automatizaciones"],
    label: "Automatizaciones",
    intro: "Venís por automatizaciones. Te vamos a ayudar a detectar qué tarea repetida conviene ordenar primero.",
  },
  integraciones: {
    budget: "automatizacion",
    problems: ["Integraciones"],
    label: "Integraciones",
    intro: "Venís por integraciones. Te vamos a ayudar a revisar herramientas, datos y conexiones posibles.",
  },
  "mantenimiento-mejoras": {
    budget: "medida",
    problems: ["Sistema propio"],
    label: "Mantenimiento y mejoras",
    intro: "Venís por mantenimiento o mejoras. Te vamos a ayudar a revisar qué existe, qué falla y qué conviene priorizar.",
  },
  dominios: {
    budget: "dominio",
    problems: ["Dominio"],
    label: "Dominios",
    intro: "Venís por dominios. Te vamos a ayudar a registrar, conectar o gestionar tu dominio de forma ordenada.",
  },
  crm: {
    budget: "crm",
    problems: ["CRM"],
    label: "CRM",
    intro: "Venís por CRM. La línea está en preparación, pero podemos relevar tu proceso comercial y avisarte el mejor camino.",
  },
  marketing: {
    budget: "marketing",
    problems: ["Más clientes", "Contenido y redes"],
    label: "Marketing",
    intro: "Venís por marketing. Te vamos a ayudar a ordenar campañas, contenido y próximos pasos comerciales.",
  },
  productos: {
    budget: "no-se",
    problems: ["Sistema propio"],
    label: "Productos",
    intro: "Venís por plataformas propias. Te vamos a ayudar a entender si alguna solución existente o una a medida tiene sentido.",
  },
};

function toggleValue(list, value) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export default function ApplicationPage() {
  const [searchParams] = useSearchParams();
  const service = searchParams.get("servicio");
  const serviceContext = serviceDefaults[service];
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!serviceContext) return;

    setForm((current) => ({
      ...current,
      budget: serviceContext.budget,
      problems: serviceContext.problems,
    }));
  }, [serviceContext]);

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
      "Hola 219Labs, quiero contarles qué necesito.",
      "",
      `Situación actual: ${revenueOptions.find((item) => item.value === form.revenue)?.label}`,
      serviceContext ? `Consulta originada en: ${serviceContext.label}` : null,
      `Estoy buscando: ${budgetOptions.find((item) => item.value === form.budget)?.label}`,
      `Consultas/clientes generados por mes hoy: ${form.clientsPerMonth}`,
      `Canales actuales: ${form.channels.join(", ")}`,
      `Problema a resolver: ${selectedProblems}`,
      `Qué necesito lograr: ${form.why219}`,
    ].filter(Boolean).join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <main className="application-page">
      <div className="application-shell">
        <section className="application-intro" aria-labelledby="application-title">
          <p className="application-kicker">Consulta</p>
          <h1 id="application-title">
            Contanos qué necesitás y vemos si 219Labs puede ayudarte a resolverlo.
          </h1>
          {serviceContext && (
            <p className="application-context">
              {serviceContext.intro}
            </p>
          )}
          <p>
            Puede ser una página web, una campaña, contenido, un sistema a medida o una idea que todavía necesita orden.
          </p>
          <p>
            No hace falta que sepas el nombre técnico del servicio. Con que nos cuentes el objetivo, alcanza para empezar.
          </p>
        </section>

        <form className="application-form" onSubmit={submitApplication}>
          {status === "early" && (
            <div className="application-result" role="status">
              <h2>Podemos orientarte, aunque quizá convenga empezar simple.</h2>
              <p>Si estás recién ordenando la idea, tal vez una primera web o una consulta puntual sea mejor que un proyecto grande.</p>
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
              <h2>Perfecto. Entonces vamos a entender mejor qué necesitás.</h2>
              <p>Podemos revisar si conviene empezar por una web, marketing, contenido o desarrollo a medida.</p>
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
                  <h2 id="revenue-title">¿En qué etapa está tu negocio?</h2>
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
                    <h2 id="budget-title">¿Qué estás buscando principalmente?</h2>
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
                    <span>¿Cuántas consultas o clientes generan por mes hoy?</span>
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
                    <legend>¿Qué querés resolver?</legend>
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
                    <span>Contanos brevemente qué necesitás lograr.</span>
                    <textarea
                      value={form.why219}
                      onChange={(event) => updateField("why219", event.target.value)}
                      placeholder="Ej: necesito una landing para mi negocio y empezar a generar consultas por Instagram."
                      rows="5"
                    />
                  </label>

                  <div className="application-note">
                    <p>Leemos cada solicitud manualmente.</p>
                    <p>Si vemos un camino claro, te respondemos con el próximo paso.</p>
                  </div>

                  <button className="application-submit" type="submit" disabled={!canSubmit}>
                    Enviar consulta
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
