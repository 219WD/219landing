import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { trackEvent } from "./utils/analytics";
import "./application.css";

const WHATSAPP_NUMBER = "5493816671884";
const LEADS_ENDPOINT = import.meta.env.VITE_LEADS_API_URL || "/api/leads";
const PRIVACY_NOTICE_VERSION = "219labs-leads-v1";

const SERVICE_CONFIGS = {
  marketing: {
    label: "Marketing",
    intro: "Venís por marketing. Vamos a entender qué querés mejorar y qué tipo de acompañamiento tiene más sentido.",
    options: [
      "Plan mensual",
      "Trabajo puntual",
      "Publicidad digital",
      "Contenido y redes",
      "Necesito asesoramiento",
    ],
    question: "¿Qué te gustaría mejorar de tu marketing?",
    detailLabel: "Contanos qué querés mejorar.",
    detailPlaceholder: "Ej: necesito generar más consultas, ordenar redes o lanzar una campaña.",
    optionalLabel: "¿Dónde promocionás tu negocio actualmente?",
    optionalPlaceholder: "Ej: Instagram, Google, referidos, local físico, todavía en ningún canal.",
    secondaryMessageLabel: "Canales actuales",
  },
  web: {
    label: "Páginas web",
    intro: "Venís por una web o landing. Vamos a entender qué necesitás mostrar y qué camino conviene tomar.",
    options: [
      "Presentar mi negocio",
      "Conseguir consultas",
      "Mejorar mi página actual",
      "No sé cuál necesito",
    ],
    question: "¿A qué se dedica tu negocio?",
    detailLabel: "Contanos a qué se dedica tu negocio.",
    detailPlaceholder: "Ej: estudio de arquitectura, servicio profesional, local gastronómico, marca personal.",
    optionalLabel: "¿Preferís partir de una plantilla, hacer una página a medida o necesitás asesoramiento?",
    optionalOptions: [
      "Prefiero una plantilla",
      "Quiero diseño a medida",
      "Necesito asesoramiento",
    ],
    secondaryMessageLabel: "Modalidad",
  },
  software: {
    label: "Software a medida",
    intro: "Venís por software a medida. Vamos a bajar la idea a una primera necesidad clara.",
    options: [
      "Sistema nuevo",
      "Mejorar sistema existente",
      "Organizar tareas internas",
      "Evaluar una idea",
    ],
    question: "¿Qué necesitás que haga el sistema?",
    detailLabel: "Contanos qué necesitás que haga.",
    detailPlaceholder: "Ej: gestionar reservas, pedidos, clientes, presupuestos, inventario o reportes.",
    optionalLabel: "¿Quiénes lo usarían?",
    optionalPlaceholder: "Ej: equipo administrativo, vendedores, clientes, proveedores.",
    secondaryMessageLabel: "Usuarios",
  },
  tienda: {
    label: "Tienda online",
    intro: "Venís por una tienda o plataforma comercial. Vamos a entender qué vendés y cómo querés operar.",
    options: [
      "Empezar a vender online",
      "Mejorar tienda actual",
      "Plataforma personalizada",
      "No sé cuál necesito",
    ],
    question: "¿Qué productos o servicios vendés?",
    detailLabel: "Contanos qué vendés.",
    detailPlaceholder: "Ej: ropa, alimentos, cursos, productos por catálogo, servicios con reserva.",
    optionalLabel: "¿Dónde vendés actualmente?",
    optionalPlaceholder: "Ej: Instagram, WhatsApp, local físico, Mercado Libre, tienda actual.",
    secondaryMessageLabel: "Venta actual",
  },
  automatizaciones: {
    label: "Automatizaciones",
    intro: "Venís por automatizaciones. Vamos a detectar qué tarea manual conviene simplificar primero.",
    options: [
      "Eliminar tareas repetitivas",
      "Enviar avisos automáticos",
      "Organizar consultas",
      "Necesito asesoramiento",
    ],
    question: "¿Qué tarea te gustaría dejar de hacer manualmente?",
    detailLabel: "Contanos qué tarea querés simplificar.",
    detailPlaceholder: "Ej: copiar datos a una planilla, responder consultas, avisar pedidos, ordenar formularios.",
    optionalLabel: "¿Qué herramientas utilizás?",
    optionalPlaceholder: "Ej: WhatsApp, Sheets, formularios, correo, tienda, CRM, sistema interno.",
    secondaryMessageLabel: "Herramientas",
  },
  integraciones: {
    label: "Integraciones",
    intro: "Venís por integraciones. Vamos a entender qué herramientas necesitan hablar entre sí.",
    options: [
      "Conectar herramientas",
      "Sincronizar información",
      "Integrar pagos u otros servicios",
      "Necesito asesoramiento",
    ],
    question: "¿Qué herramientas necesitás conectar?",
    detailLabel: "Contanos qué herramientas necesitás conectar.",
    detailPlaceholder: "Ej: formulario con Sheets, tienda con pagos, CRM con WhatsApp, sistema con correo.",
    optionalLabel: "¿Qué información necesitás compartir entre ellas?",
    optionalPlaceholder: "Ej: contactos, pedidos, pagos, stock, estados, avisos, reportes.",
    secondaryMessageLabel: "Información a compartir",
  },
  mantenimiento: {
    label: "Mantenimiento",
    intro: "Venís por mantenimiento o mejoras. Vamos a entender qué existe y qué hay que revisar.",
    options: [
      "Solucionar error",
      "Actualizar página",
      "Agregar función",
      "Soporte mensual",
    ],
    question: "¿Qué página o sistema necesitás revisar?",
    detailLabel: "Contanos qué hay que revisar.",
    detailPlaceholder: "Ej: una web en WordPress, una tienda online, un sistema propio o una landing.",
    optionalLabel: "¿Tenés un enlace para compartir?",
    optionalPlaceholder: "Ej: pegá el link si lo tenés a mano.",
    secondaryMessageLabel: "Enlace",
  },
  dominios: {
    label: "Dominios",
    intro: "Venís por dominios. Vamos a entender si necesitás registrar, conectar, configurar o administrar.",
    options: [
      "Registrar dominio",
      "Conectar dominio",
      "Configurar correo",
      "Administrar o renovar",
    ],
    question: "¿Qué dominio tenés o te gustaría registrar?",
    detailLabel: "Contanos el dominio.",
    detailPlaceholder: "Ej: minombre.com.ar, miempresa.com o todavía no sé cuál conviene.",
    optionalLabel: "¿Ya tenés una página web?",
    optionalPlaceholder: "Ej: sí, ya tengo una web; no, quiero registrar primero; está en desarrollo.",
    secondaryMessageLabel: "Página web actual",
  },
  crm: {
    label: "Gestión de clientes / CRM",
    intro: "Venís por CRM. Podemos relevar tu proceso comercial sin prometer una solución cerrada antes de entenderlo.",
    options: [
      "Organizar contactos",
      "Seguimiento de consultas",
      "Integrar CRM existente",
      "Conocer futuras soluciones",
    ],
    question: "¿Cómo organizás actualmente las consultas de tus clientes?",
    detailLabel: "Contanos cómo organizás las consultas hoy.",
    detailPlaceholder: "Ej: WhatsApp, planilla, memoria, Trello, CRM actual, chats separados.",
    optionalLabel: "¿Qué es lo que más te cuesta controlar?",
    optionalPlaceholder: "Ej: estados, notas, próximos pasos, quién respondió, oportunidades perdidas.",
    secondaryMessageLabel: "Dificultad principal",
  },
  productos: {
    label: "Productos de 219Labs",
    intro: "Venís por productos de 219Labs. Vamos a entender si conviene una solución existente, futura o algo a medida.",
    options: [
      "219Shops",
      "219Meds",
      "Plataforma personalizada",
      "Necesito orientación",
    ],
    question: "¿Qué querés hacer con la plataforma?",
    detailLabel: "Contanos qué querés lograr con la plataforma.",
    detailPlaceholder: "Ej: vender online, ordenar productos, administrar pedidos, explorar una solución propia.",
    optionalLabel: "¿Ya utilizás alguna herramienta?",
    optionalPlaceholder: "Ej: tienda actual, catálogo por WhatsApp, sistema interno, planillas.",
    secondaryMessageLabel: "Herramienta actual",
  },
};

const SERVICE_PARAM_MAP = {
  marketing: "marketing",
  "landing-pages": "web",
  "paginas-web-landing-pages": "web",
  "software-a-medida": "software",
  "tiendas-online-plataformas": "tienda",
  automatizaciones: "automatizaciones",
  integraciones: "integraciones",
  "mantenimiento-mejoras": "mantenimiento",
  dominios: "dominios",
  crm: "crm",
  productos: "productos",
};

const SERVICE_CHOICES = [
  { value: "marketing", label: "Marketing" },
  { value: "web", label: "Páginas web" },
  { value: "software", label: "Software a medida" },
  { value: "tienda", label: "Tienda online" },
  { value: "automatizaciones", label: "Automatizaciones" },
  { value: "integraciones", label: "Integraciones" },
  { value: "mantenimiento", label: "Mantenimiento" },
  { value: "dominios", label: "Dominios" },
  { value: "crm", label: "Gestión de clientes / CRM" },
  { value: "productos", label: "Productos de 219Labs" },
];

const DEVELOPMENT_SERVICE_CHOICES = SERVICE_CHOICES.filter((service) =>
  ["web", "software", "tienda", "automatizaciones", "integraciones", "mantenimiento", "dominios", "crm"].includes(service.value),
);

const initialAnswers = {
  need: "",
  detail: "",
  secondary: "",
};

const initialContact = {
  name: "",
  whatsapp: "",
  email: "",
  consent: false,
};

function normalizeService(serviceParam) {
  return SERVICE_PARAM_MAP[serviceParam] || "";
}

function normalizeWhatsApp(value) {
  return value.replace(/[^\d+]/g, "").trim();
}

function hasValidWhatsApp(value) {
  return normalizeWhatsApp(value).replace(/\D/g, "").length >= 8;
}

function getOriginLabel(serviceParam, selectedService) {
  if (serviceParam === "desarrollo") return "Pagina de desarrollo de 219Labs";
  if (serviceParam && SERVICE_PARAM_MAP[serviceParam]) {
    return `Pagina de ${SERVICE_CONFIGS[selectedService]?.label || "servicio"} de 219Labs`;
  }
  return "Web de 219Labs";
}

function getUtmParams(searchParams) {
  return ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].reduce((params, key) => {
    const value = searchParams.get(key);
    return value ? { ...params, [key]: value } : params;
  }, {});
}

function buildWhatsappMessage({ config, answers, contact, leadId, origin }) {
  return [
    "Hola, quiero consultar por un servicio de 219Labs.",
    "",
    leadId ? `Solicitud: ${leadId}` : null,
    `Nombre: ${contact.name}`,
    `Servicio: ${config.label}`,
    `Necesito: ${answers.need}`,
    answers.secondary.trim() ? `${config.secondaryMessageLabel || "Información adicional"}: ${answers.secondary}` : null,
    `Detalle: ${answers.detail}`,
    `Origen: ${origin}`,
  ].filter(Boolean).join("\n");
}

export default function ApplicationPage() {
  const [searchParams] = useSearchParams();
  const serviceParam = searchParams.get("servicio") || "";
  const preselectedService = normalizeService(serviceParam);
  const startsFromDevelopment = serviceParam === "desarrollo";
  const serviceChoices = startsFromDevelopment ? DEVELOPMENT_SERVICE_CHOICES : SERVICE_CHOICES;
  const [selectedService, setSelectedService] = useState(preselectedService);
  const [step, setStep] = useState(preselectedService ? 1 : 0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [contact, setContact] = useState(initialContact);
  const [submitState, setSubmitState] = useState("idle");
  const [leadId, setLeadId] = useState("");
  const [saveError, setSaveError] = useState("");
  const [backgroundSaveError, setBackgroundSaveError] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [trackedSteps, setTrackedSteps] = useState([]);

  const config = selectedService ? SERVICE_CONFIGS[selectedService] : null;
  const shouldChooseService = !preselectedService;
  const totalSteps = shouldChooseService ? 3 : 2;
  const visibleStep = shouldChooseService ? step + 1 : step;
  const progressIndex = visibleStep - 1;

  useEffect(() => {
    window.scrollTo(0, 0);
    const normalizedService = normalizeService(serviceParam);
    setSelectedService(normalizedService);
    setStep(normalizedService ? 1 : 0);
    setAnswers(initialAnswers);
    setContact(initialContact);
    setSubmitState("idle");
    setLeadId("");
    setSaveError("");
    setBackgroundSaveError("");
    setHasStarted(false);
    setTrackedSteps([]);
  }, [serviceParam]);

  const canContinue = useMemo(() => {
    return Boolean(selectedService && answers.need && answers.detail.trim());
  }, [answers.detail, answers.need, selectedService]);

  const canSubmitLead = useMemo(() => {
    return Boolean(
      canContinue &&
      contact.name.trim().length >= 2 &&
      hasValidWhatsApp(contact.whatsapp) &&
      contact.consent,
    );
  }, [canContinue, contact.consent, contact.name, contact.whatsapp]);

  const startApplication = (serviceKey) => {
    if (hasStarted) return;
    trackEvent("application_start", {
      service: SERVICE_CONFIGS[serviceKey]?.label || "General",
      service_key: serviceKey || "general",
      source_service_key: serviceParam || "direct",
    });
    setHasStarted(true);
  };

  const markStepCompleted = (stepName, serviceKey = selectedService) => {
    if (trackedSteps.includes(stepName)) return;
    trackEvent("application_step_completed", {
      step: stepName,
      service: SERVICE_CONFIGS[serviceKey]?.label || "General",
      service_key: serviceKey || "general",
    });
    setTrackedSteps((current) => [...current, stepName]);
  };

  const selectService = (serviceKey) => {
    setSelectedService(serviceKey);
    setAnswers(initialAnswers);
    setContact(initialContact);
    setSubmitState("idle");
    setLeadId("");
    setSaveError("");
    startApplication(serviceKey);
    trackEvent("application_service_selected", {
      service: SERVICE_CONFIGS[serviceKey].label,
      service_key: serviceKey,
      source_service_key: serviceParam || "direct",
    });
    markStepCompleted("service", serviceKey);
    setStep(1);
  };

  const updateAnswer = (field, value) => {
    startApplication(selectedService);
    setSubmitState("idle");
    setSaveError("");
    setAnswers((current) => ({ ...current, [field]: value }));
  };

  const updateContact = (field, value) => {
    startApplication(selectedService);
    setSubmitState("idle");
    setSaveError("");
    setContact((current) => ({ ...current, [field]: value }));
  };

  const goToContact = () => {
    if (!canContinue) return;
    markStepCompleted("details", selectedService);
    setStep(2);
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 1 && shouldChooseService) {
      setStep(0);
    }
  };

  const leadPayload = useMemo(() => {
    if (!config) return null;

    return {
      contact: {
        name: contact.name.trim(),
        whatsapp: normalizeWhatsApp(contact.whatsapp),
        email: contact.email.trim(),
      },
      service: {
        key: selectedService,
        label: config.label,
        need: answers.need,
        detail: answers.detail.trim(),
        secondaryLabel: config.secondaryMessageLabel || "Información adicional",
        secondary: answers.secondary.trim(),
      },
      source: {
        origin: getOriginLabel(serviceParam, selectedService),
        serviceParam: serviceParam || null,
        path: window.location.pathname,
        href: window.location.href,
        referrer: document.referrer || null,
        utm: getUtmParams(searchParams),
      },
      privacy: {
        consentAccepted: contact.consent,
        noticeVersion: PRIVACY_NOTICE_VERSION,
      },
      status: "form_submitted",
    };
  }, [answers, config, contact, searchParams, selectedService, serviceParam]);

  const saveLead = async () => {
    if (!leadPayload) throw new Error("No se pudo preparar la consulta.");

    const response = await fetch(LEADS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leadPayload),
      keepalive: true,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      throw new Error(data.error || "No pudimos guardar la consulta.");
    }

    return data;
  };

  const markWhatsappOpened = (currentLeadId) => {
    if (!currentLeadId) return;

    fetch(LEADS_ENDPOINT, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: currentLeadId, status: "whatsapp_opened" }),
      keepalive: true,
    }).catch(() => {});
  };

  const openWhatsapp = (currentLeadId = leadId) => {
    if (!config) return;

    const message = buildWhatsappMessage({
      config,
      answers,
      contact,
      leadId: currentLeadId,
      origin: getOriginLabel(serviceParam, selectedService),
    });

    trackEvent("whatsapp_click", {
      service: config.label,
      service_key: selectedService,
      modality: answers.need,
      lead_saved: Boolean(currentLeadId),
    });

    markWhatsappOpened(currentLeadId);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const submitApplication = async (event) => {
    event.preventDefault();
    if (!canSubmitLead || !config) return;

    setSubmitState("saved");
    setSaveError("");
    setBackgroundSaveError("");
    markStepCompleted("contact", selectedService);
    trackEvent("application_form_submitted", {
      service: config.label,
      service_key: selectedService,
      modality: answers.need,
      lead_saved: "pending",
    });

    saveLead()
      .then((data) => {
        const currentLeadId = data.leadId || "";
        setLeadId(currentLeadId);
        trackEvent("application_form_saved", {
          service: config.label,
          service_key: selectedService,
          modality: answers.need,
          lead_saved: true,
        });
      })
      .catch((error) => {
        const message = error.message || "No pudimos guardar la consulta.";
        setBackgroundSaveError(message);
        trackEvent("application_form_submit_failed", {
          service: config.label,
          service_key: selectedService,
          modality: answers.need,
        });
      });
  };

  const retryBackgroundSave = async () => {
    if (!config) return;
    setBackgroundSaveError("");
    setSaveError("");

    try {
      const data = await saveLead();
      setLeadId(data.leadId || "");
      trackEvent("application_form_saved", {
        service: config.label,
        service_key: selectedService,
        modality: answers.need,
        lead_saved: true,
      });
    } catch (error) {
      const message = error.message || "No pudimos guardar la consulta.";
      setBackgroundSaveError(message);
      trackEvent("application_form_submit_failed", {
        service: config.label,
        service_key: selectedService,
        modality: answers.need,
      });
    }
  };

  return (
    <main className="application-page">
      <div className="application-shell">
        <section className="application-intro" aria-labelledby="application-title">
          <p className="application-kicker">Contacto · 219Labs</p>
          <h1 id="application-title">
            Contanos qué necesitás. Te ayudamos a encontrar la mejor forma de hacerlo.
          </h1>
          <p>
            No hace falta que sepas de marketing ni de tecnología. Respondé unas preguntas rápidas para que podamos entender tu proyecto.
          </p>
          <p className="application-time">Aproximadamente 1 minuto. Sin compromiso.</p>
          {config && (
            <p className="application-context">
              {config.intro}
            </p>
          )}
          {!config && startsFromDevelopment && (
            <p className="application-context">
              Venís por desarrollo. Elegí qué tipo de solución se parece más a lo que necesitás y seguimos desde ahí.
            </p>
          )}
        </section>

        <form className="application-form" onSubmit={submitApplication}>
          <div className="application-progress" aria-hidden="true">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <span key={index} className={index <= progressIndex ? "is-active" : ""} />
            ))}
          </div>

          <p className="application-progress-label">
            Paso {visibleStep} de {totalSteps}
          </p>

          {step === 0 && (
            <section className="application-step" aria-labelledby="service-title">
              <div className="application-step__header">
                <span>Servicio</span>
                <h2 id="service-title">¿En qué podemos ayudarte?</h2>
                <p>Elegí lo que más se parezca a lo que necesitás.</p>
              </div>

              <div className="application-options application-options--services">
                {serviceChoices.map((service) => (
                  <button
                    type="button"
                    key={service.value}
                    className={selectedService === service.value ? "is-selected" : ""}
                    aria-pressed={selectedService === service.value}
                    onClick={() => selectService(service.value)}
                  >
                    {service.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 1 && config && (
            <section className="application-step" aria-labelledby="need-title">
              <div className="application-step__header">
                <span>{config.label}</span>
                <h2 id="need-title">{config.question}</h2>
                <p>Elegí una opción y contanos lo esencial. Los detalles finos los vemos después.</p>
              </div>

              <fieldset className="application-fieldset">
                <legend>Elegí la opción que mejor encaje.</legend>
                <div className="application-options application-options--need">
                  {config.options.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={answers.need === option ? "is-selected" : ""}
                      aria-pressed={answers.need === option}
                      onClick={() => updateAnswer("need", option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="application-field">
                <span>{config.detailLabel}</span>
                <textarea
                  value={answers.detail}
                  onChange={(event) => updateAnswer("detail", event.target.value)}
                  placeholder={config.detailPlaceholder}
                  rows="5"
                />
              </label>

              {config.optionalOptions ? (
                <fieldset className="application-fieldset">
                  <legend>{config.optionalLabel} <small>Opcional</small></legend>
                  <div className="application-options application-options--need">
                    {config.optionalOptions.map((option) => (
                      <button
                        type="button"
                        key={option}
                        className={answers.secondary === option ? "is-selected" : ""}
                        aria-pressed={answers.secondary === option}
                        onClick={() => updateAnswer("secondary", option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <label className="application-field">
                  <span>{config.optionalLabel} <small>Opcional</small></span>
                  <textarea
                    value={answers.secondary}
                    onChange={(event) => updateAnswer("secondary", event.target.value)}
                    placeholder={config.optionalPlaceholder}
                    rows="3"
                  />
                </label>
              )}

              <div className="application-actions">
                {shouldChooseService && (
                  <button type="button" className="application-secondary" onClick={goBack}>
                    Volver
                  </button>
                )}
                <button type="button" className="application-submit" disabled={!canContinue} onClick={goToContact}>
                  Continuar
                </button>
              </div>
            </section>
          )}

          {step === 2 && config && (
            <section className="application-step" aria-labelledby="contact-title">
              {submitState === "saved" ? (
                <div className="application-status" role="status">
                  <span>Consulta recibida</span>
                  <h2>Ya tenemos tus datos y lo que necesitás.</h2>
                  <p>
                    Ya preparamos tu consulta. Si querés, podés continuar la conversación ahora por WhatsApp.
                  </p>
                  {backgroundSaveError && (
                    <div className="application-alert" role="alert">
                      <p>{backgroundSaveError}</p>
                      <p>Podés reintentar el guardado o continuar por WhatsApp.</p>
                    </div>
                  )}
                  <div className="application-actions">
                    <button
                      type="button"
                      className="application-secondary"
                      onClick={() => {
                        setSubmitState("idle");
                        setSaveError("");
                        setBackgroundSaveError("");
                        setStep(1);
                      }}
                    >
                      Editar consulta
                    </button>
                    {backgroundSaveError && (
                      <button type="button" className="application-secondary" onClick={retryBackgroundSave}>
                        Reintentar guardado
                      </button>
                    )}
                    <button type="button" className="application-submit" onClick={() => openWhatsapp()}>
                      Continuar por WhatsApp
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="application-step__header">
                    <span>Paso final</span>
                    <h2 id="contact-title">¿Dónde podemos contactarte?</h2>
                    <p>Ya tenemos una idea de lo que necesitás. Dejanos un contacto para poder responderte y continuar con tu consulta.</p>
                  </div>

                  <div className="application-summary" aria-label="Resumen de la consulta">
                    <div className="application-summary__item">
                      <span>Servicio</span>
                      <strong>{config.label}</strong>
                    </div>
                    <div className="application-summary__item">
                      <span>Necesito</span>
                      <strong>{answers.need}</strong>
                    </div>
                    <div className="application-summary__item application-summary__item--wide">
                      <span>Detalle</span>
                      <strong>{answers.detail}</strong>
                    </div>
                  </div>

                  <div className="application-contact-grid">
                    <label className="application-field">
                      <span>¿Cómo te llamás?</span>
                      <input
                        value={contact.name}
                        onChange={(event) => updateContact("name", event.target.value)}
                        placeholder="Tu nombre"
                        autoComplete="name"
                      />
                    </label>

                    <label className="application-field">
                      <span>Tu número de WhatsApp</span>
                      <input
                        value={contact.whatsapp}
                        onChange={(event) => updateContact("whatsapp", event.target.value)}
                        placeholder="Ej: +54 9 381 123 4567"
                        autoComplete="tel"
                        inputMode="tel"
                      />
                      <small>Lo usamos para responderte sobre tu consulta.</small>
                    </label>

                    <label className="application-field application-field--wide">
                      <span>Correo electrónico <small>Opcional</small></span>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(event) => updateContact("email", event.target.value)}
                        placeholder="tu@email.com"
                        autoComplete="email"
                      />
                    </label>
                  </div>

                  <label className="application-consent">
                    <input
                      type="checkbox"
                      checked={contact.consent}
                      onChange={(event) => updateContact("consent", event.target.checked)}
                    />
                    <span>Acepto que 219Labs guarde mis datos y me contacte para responder esta consulta.</span>
                  </label>

                  {submitState === "error" && (
                    <div className="application-alert" role="alert">
                      <p>{saveError}</p>
                      <p>Podés reintentar o continuar directamente por WhatsApp. En ese caso la consulta no queda guardada en el sistema.</p>
                    </div>
                  )}

                  <div className="application-note">
                    <p>Tu consulta llega directamente a nuestro equipo.</p>
                    <p>Revisamos lo que necesitás y te indicamos cómo podemos avanzar.</p>
                  </div>

                  <div className="application-actions">
                    <button type="button" className="application-secondary" onClick={goBack}>
                      Volver
                    </button>
                    {submitState === "error" && (
                      <button type="button" className="application-secondary" onClick={() => openWhatsapp("")}>
                        Continuar por WhatsApp
                      </button>
                    )}
                    <button className="application-submit" type="submit" disabled={!canSubmitLead || submitState === "saving"}>
                      {submitState === "saving" ? "Guardando consulta..." : "Enviar mi consulta"}
                    </button>
                  </div>
                </>
              )}
            </section>
          )}
        </form>
      </div>
    </main>
  );
}
