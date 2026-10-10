import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBolt,
  faCheck,
  faClockRotateLeft,
  faEye,
  faFloppyDisk,
  faLayerGroup,
  faMagnifyingGlass,
  faPaperPlane,
  faRotate,
  faTrash,
  faUserCheck,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const emptyButtons = [{ label: "", url: "" }, { label: "", url: "" }, { label: "", url: "" }];

const quickKits = [
  {
    id: "seguimiento_leads",
    name: "Seguimiento leads",
    subject: "Seguimos con tu consulta de 219Labs",
    title: "Tenemos tu consulta lista para avanzar.",
    preheader: "Retomamos lo que nos contaste y te proponemos el próximo paso.",
    content: "Hola, ¿cómo estás?\n\nVimos tu consulta y ya tenemos una idea bastante clara de lo que necesitás. El próximo paso sería ordenar alcance, prioridades y tiempos para que puedas decidir con información concreta.\n\nSi querés, coordinamos por WhatsApp y lo vemos simple, sin vueltas.",
    button: "Continuar por WhatsApp",
  },
  {
    id: "diagnostico",
    name: "Diagnóstico",
    subject: "Una lectura rápida para ordenar tu proyecto",
    title: "Antes de construir, conviene ordenar la jugada.",
    preheader: "Te dejamos una forma simple de avanzar con dirección.",
    content: "Hola, gracias por escribirnos.\n\nCuando un negocio llega con muchas ideas al mismo tiempo, lo más importante no es hacer de todo: es elegir el primer movimiento correcto.\n\nPodemos revisar tu caso y separar qué conviene resolver ahora, qué puede esperar y qué impacto debería tener cada acción.",
    button: "Pedir diagnóstico",
  },
  {
    id: "propuesta",
    name: "Propuesta",
    subject: "Podemos armar una propuesta para tu negocio",
    title: "Pasemos de la idea al plan.",
    preheader: "Si el problema está claro, armamos una propuesta concreta.",
    content: "Hola, ¿cómo va?\n\nCon la información que nos dejaste podemos preparar una propuesta más precisa: qué haríamos, con qué alcance, qué tiempos tendría y cómo se mide si está funcionando.\n\nLa idea es que no compres humo ni una lista infinita de tareas. Que entiendas exactamente qué se va a construir y para qué.",
    button: "Responder por WhatsApp",
  },
  {
    id: "reactivacion",
    name: "Reactivación",
    subject: "¿Seguimos con lo de tu web, sistema o marketing?",
    title: "Si todavía lo tenés pendiente, podemos retomarlo.",
    preheader: "A veces el problema sigue ahí, solo faltaba elegir por dónde empezar.",
    content: "Hola, te escribimos porque en algún momento nos dejaste una consulta.\n\nSi el tema sigue pendiente, podemos retomarlo desde donde quedó. No hace falta que tengas todo cerrado: con una conversación clara alcanza para definir el próximo paso.\n\nCuando quieras, lo vemos.",
    button: "Retomar consulta",
  },
];

function date(value) {
  return value ? new Date(value).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" }) : "-";
}

function percent(value, total) {
  return Math.min(100, Math.round((Number(value || 0) / Math.max(1, Number(total || 0))) * 100));
}

function words(value = "") {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function padButtons(buttons = []) {
  return [...buttons.filter((button) => button?.label || button?.url), ...emptyButtons].slice(0, 3);
}

function statusLabel(status = "") {
  return ({ sent: "Enviado", failed: "Fallido", pending: "Pendiente" }[status] || status || "Sin estado");
}

function buildCampaignId(prefix) {
  const day = new Date().toISOString().slice(0, 10).replaceAll("-", "_");
  return `${prefix}_${day}`;
}

function EmailStat({ icon, value, label }) {
  return (
    <article>
      <i><FontAwesomeIcon icon={icon} /></i>
      <span>
        <strong>{value}</strong>
        <small>{label}</small>
      </span>
    </article>
  );
}

export default function AdminEmailMarketing({ apiRequest, csrf }) {
  const [view, setView] = useState("send");
  const [campaignId, setCampaignId] = useState(buildCampaignId("seguimiento"));
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [preheader, setPreheader] = useState("");
  const [content, setContent] = useState("");
  const [buttons, setButtons] = useState(emptyButtons);
  const [templateId, setTemplateId] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [recipients, setRecipients] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [search, setSearch] = useState("");
  const [previewMode, setPreviewMode] = useState("desktop");
  const [customLink, setCustomLink] = useState({ label: "Agendar llamada", url: "https://219labs.com.ar/aplicar" });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validButtons = useMemo(
    () => buttons.filter((button) => button.label.trim() && button.url.trim()),
    [buttons],
  );
  const canSend = campaignId.trim() && subject.trim() && title.trim() && content.trim() && !sending;
  const canOpenTemplateModal = subject.trim() && title.trim() && content.trim() && !loading;
  const canSaveTemplate = templateName.trim() && subject.trim() && title.trim() && content.trim() && !loading;
  const filteredContacts = contacts.filter((contact) => `${contact.name} ${contact.email} ${contact.whatsapp} ${contact.service}`.toLowerCase().includes(search.toLowerCase()));
  const completion = percent([campaignId, subject, title, content].filter((item) => item.trim()).length, 4);
  const sentTotal = campaigns.reduce((sum, campaign) => sum + Number(campaign.sent || 0), 0);
  const failedTotal = campaigns.reduce((sum, campaign) => sum + Number(campaign.failed || 0), 0);

  const loadRecipients = () => apiRequest(`/api/admin/email-marketing?action=recipients&campaignId=${encodeURIComponent(campaignId)}`)
    .then((data) => { setRecipients(data); return data; });
  const loadTemplates = () => apiRequest("/api/admin/email-marketing?action=templates")
    .then((data) => { setTemplates(data.templates || []); return data.templates || []; });
  const loadContacts = () => apiRequest(`/api/admin/email-marketing?action=contacts&campaignId=${encodeURIComponent(campaignId)}`)
    .then((data) => { setContacts(data.contacts || []); return data.contacts || []; });
  const loadCampaigns = () => apiRequest("/api/admin/email-marketing?action=campaigns")
    .then((data) => { setCampaigns(data.campaigns || []); return data.campaigns || []; });

  useEffect(() => {
    setError("");
    loadRecipients().catch((fetchError) => setError(fetchError.message));
  }, [campaignId]);

  useEffect(() => {
    Promise.all([loadTemplates(), loadCampaigns(), loadContacts()]).catch((fetchError) => setError(fetchError.message));
  }, []);

  useEffect(() => {
    setError("");
    if (view === "contacts") loadContacts().catch((fetchError) => setError(fetchError.message));
    if (view === "history") loadCampaigns().catch((fetchError) => setError(fetchError.message));
  }, [view, campaignId]);

  const updateButton = (index, field, value) => {
    setButtons((current) => current.map((button, itemIndex) => (itemIndex === index ? { ...button, [field]: value } : button)));
  };

  const applyTemplate = (template) => {
    setTemplateId(template.id || "");
    setTemplateName(template.name || "");
    setSubject(template.subject || "");
    setTitle(template.title || "");
    setPreheader(template.preheader || "");
    setContent(template.content || "");
    setButtons(padButtons(template.buttons || []));
  };

  const applyKit = (kit) => {
    const whatsappUrl = `https://wa.me/543816671884?text=${encodeURIComponent(`Hola 219Labs, quiero avanzar con ${kit.name.toLowerCase()}.`)}`;
    setTemplateId("");
    setTemplateName("");
    setCampaignId(buildCampaignId(kit.id));
    setSubject(kit.subject);
    setTitle(kit.title);
    setPreheader(kit.preheader);
    setContent(kit.content);
    setButtons(padButtons([{ label: kit.button, url: whatsappUrl }]));
    setMessage("Base aplicada. Revisá el copy y el preview antes de enviar.");
  };

  const saveTemplate = async () => {
    if (!canSaveTemplate) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const data = await apiRequest("/api/admin/email-marketing?action=templates", {
        method: "POST",
        body: JSON.stringify({ templateId, name: templateName, subject, title, preheader, content, buttons: validButtons }),
      }, csrf);
      applyTemplate(data.template);
      await loadTemplates();
      setTemplateModalOpen(false);
      setMessage(templateId ? "Plantilla actualizada." : "Plantilla guardada.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTemplate = async () => {
    if (!templateId || !window.confirm(`¿Eliminar la plantilla "${templateName}"?`)) return;
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await apiRequest("/api/admin/email-marketing?action=delete-template", {
        method: "POST",
        body: JSON.stringify({ templateId }),
      }, csrf);
      setTemplateId("");
      setTemplateName("");
      await loadTemplates();
      setMessage("Plantilla eliminada.");
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async () => {
    if (!canSend) return;
    const target = recipients?.eligible ?? 0;
    if (!window.confirm(`Vas a enviar "${campaignId}" a ${target} contactos con email. ¿Confirmás?`)) return;
    setSending(true);
    setError("");
    setMessage("");
    try {
      const data = await apiRequest("/api/admin/email-marketing?action=send", {
        method: "POST",
        body: JSON.stringify({ campaignId, subject, title, preheader, content, buttons: validButtons }),
      }, csrf);
      setMessage(`Enviados: ${data.sent}/${data.eligible}. Ya enviados antes: ${data.alreadySent}. Fallidos: ${data.failed?.length || 0}.`);
      await Promise.all([loadRecipients(), loadCampaigns(), loadContacts().catch(() => {})]);
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setSending(false);
    }
  };

  const loadCampaignDetail = async (nextCampaignId) => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest(`/api/admin/email-marketing?action=campaign-detail&campaignId=${encodeURIComponent(nextCampaignId)}`);
      setSelectedCampaign(data.campaign);
    } catch (detailError) {
      setError(detailError.message);
    } finally {
      setLoading(false);
    }
  };

  const applyCustomLink = () => {
    if (!customLink.label.trim() || !customLink.url.trim()) return;
    setButtons((current) => {
      const next = current.map((button) => ({ ...button }));
      const target = next.findIndex((button) => !button.label.trim() && !button.url.trim());
      next[target === -1 ? 0 : target] = { label: customLink.label.trim(), url: customLink.url.trim() };
      return next;
    });
  };

  return (
    <section className="admin-email-page">
      <header className="admin-email-hero">
        <div className="admin-email-hero__copy">
          <span><FontAwesomeIcon icon={faWandMagicSparkles} /> Centro de campañas</span>
          <h2>Email marketing para leads.</h2>
          <p>Convertí consultas en seguimientos prolijos: campañas, plantillas, audiencia, preview e historial, todo desde el panel de 219Labs.</p>
        </div>
        <div className="admin-email-hero__card">
          <small>Audiencia lista</small>
          <strong>{recipients?.eligible ?? 0}</strong>
          <span>de {recipients?.recipients ?? 0} contactos con email todavía no recibieron este ID.</span>
          <div><i style={{ width: `${percent(recipients?.eligible, recipients?.recipients)}%` }} /></div>
        </div>
      </header>

      <section className="admin-email-stats">
        <EmailStat icon={faUserCheck} value={recipients?.recipients ?? 0} label="Contactos con email" />
        <EmailStat icon={faPaperPlane} value={sentTotal} label="Emails enviados" />
        <EmailStat icon={faLayerGroup} value={templates.length} label="Plantillas" />
        <EmailStat icon={faClockRotateLeft} value={campaigns.length} label="Campañas" />
      </section>

      <div className="admin-email-tabs">
        <button type="button" className={view === "send" ? "is-active" : ""} onClick={() => setView("send")}><FontAwesomeIcon icon={faBolt} /> Enviar campaña</button>
        <button type="button" className={view === "contacts" ? "is-active" : ""} onClick={() => setView("contacts")}><FontAwesomeIcon icon={faUserCheck} /> Contactos</button>
        <button type="button" className={view === "history" ? "is-active" : ""} onClick={() => setView("history")}><FontAwesomeIcon icon={faClockRotateLeft} /> Historial</button>
      </div>

      {error && <p className="admin-email-alert admin-email-alert--error">{error}</p>}
      {message && <p className="admin-email-alert admin-email-alert--success">{message}</p>}

      {view === "send" && (
        <div className="admin-email-studio">
          <main className="admin-email-composer">
            <section className="admin-email-toolbelt">
              <div>
                <small>Progreso de campaña</small>
                <strong>{completion}% listo</strong>
                <span><i style={{ width: `${completion}%` }} /></span>
              </div>
              <div className="admin-email-checks">
                {[
                  ["ID", campaignId],
                  ["Asunto", subject],
                  ["Título", title],
                  ["Contenido", content],
                ].map(([label, value]) => (
                  <em className={value.trim() ? "done" : ""} key={label}>
                    <FontAwesomeIcon icon={value.trim() ? faCheck : faArrowRight} /> {label}
                  </em>
                ))}
              </div>
            </section>

            <section className="admin-email-kits">
              <header>
                <small>Arranque rápido</small>
                <strong>Copys base al estilo 219Labs</strong>
              </header>
              <div>
                {quickKits.map((kit) => (
                  <button type="button" key={kit.id} onClick={() => applyKit(kit)}>
                    <FontAwesomeIcon icon={faWandMagicSparkles} />
                    <span>{kit.name}<small>{kit.subject}</small></span>
                  </button>
                ))}
              </div>
            </section>

            <section className="admin-email-box">
              <div className="admin-email-panel-title">
                <i><FontAwesomeIcon icon={faLayerGroup} /></i>
                <span><small>Biblioteca</small><strong>Plantillas guardadas</strong></span>
              </div>
              <p>Guardá asuntos, cuerpo y botones para repetir seguimientos sin reescribir cada campaña desde cero.</p>
              <div className="admin-email-template-actions">
                <select value={templateId} onChange={(event) => {
                  const template = templates.find((item) => item.id === event.target.value);
                  if (template) applyTemplate(template);
                  else {
                    setTemplateId("");
                    setTemplateName("");
                  }
                }}>
                  <option value="">Elegir plantilla guardada</option>
                  {templates.map((template) => <option value={template.id} key={template.id}>{template.name}</option>)}
                </select>
                {templateId ? (
                  <button type="button" onClick={saveTemplate} disabled={!canSaveTemplate}><FontAwesomeIcon icon={faFloppyDisk} /> Actualizar</button>
                ) : (
                  <button type="button" onClick={() => { setTemplateName(campaignId || subject || ""); setTemplateModalOpen(true); }} disabled={!canOpenTemplateModal}><FontAwesomeIcon icon={faFloppyDisk} /> Guardar</button>
                )}
                <button type="button" onClick={deleteTemplate} disabled={!templateId} aria-label="Eliminar plantilla"><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            </section>

            <section className="admin-email-box">
              <div className="admin-email-panel-title">
                <i><FontAwesomeIcon icon={faPaperPlane} /></i>
                <span><small>Campaña</small><strong>Mensaje y CTA</strong></span>
              </div>
              <div className="admin-email-form-grid">
                <label>ID de campaña<input value={campaignId} onChange={(event) => setCampaignId(event.target.value)} placeholder="seguimiento_octubre" /><small>No se reenvía a quien ya recibió este ID.</small></label>
                <label>Asunto<input value={subject} onChange={(event) => setSubject(event.target.value)} /><small>{subject.length}/80 recomendado</small></label>
                <label>Título principal<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
                <label>Preheader<input value={preheader} onChange={(event) => setPreheader(event.target.value)} /><small>Texto invisible que acompaña al asunto.</small></label>
                <label className="wide">Contenido<textarea rows={12} value={content} onChange={(event) => setContent(event.target.value)} /><small>{words(content)} palabras · separá párrafos con una línea vacía</small></label>
              </div>

              <div className="admin-email-buttons">
                <header>
                  <strong>Botones de acción</strong>
                  <small>Hasta 3 enlaces. Ideal: WhatsApp, aplicar o una página específica.</small>
                </header>
                <div className="admin-email-presets">
                  <button type="button" onClick={() => setCustomLink({ label: "Continuar por WhatsApp", url: `https://wa.me/543816671884?text=${encodeURIComponent("Hola 219Labs, vengo desde el email.")}` })}><FontAwesomeIcon icon={faWhatsapp} /> WhatsApp</button>
                  <button type="button" onClick={() => setCustomLink({ label: "Completar consulta", url: "https://219labs.com.ar/aplicar" })}>Aplicar</button>
                  <button type="button" onClick={() => setCustomLink({ label: "Ver desarrollo", url: "https://219labs.com.ar/desarrollo" })}>Desarrollo</button>
                  <button type="button" onClick={() => setCustomLink({ label: "Ver marketing", url: "https://219labs.com.ar/marketing" })}>Marketing</button>
                </div>
                <div className="admin-email-link-builder">
                  <label>Texto<input value={customLink.label} onChange={(event) => setCustomLink((current) => ({ ...current, label: event.target.value }))} /></label>
                  <label>URL<input value={customLink.url} onChange={(event) => setCustomLink((current) => ({ ...current, url: event.target.value }))} /></label>
                  <button type="button" onClick={applyCustomLink}><FontAwesomeIcon icon={faArrowRight} /> Usar</button>
                </div>
                {buttons.map((button, index) => (
                  <div className="admin-email-button-row" key={index}>
                    <span>{index + 1}</span>
                    <input placeholder="Texto" value={button.label} onChange={(event) => updateButton(index, "label", event.target.value)} />
                    <input placeholder="URL" value={button.url} onChange={(event) => updateButton(index, "url", event.target.value)} />
                  </div>
                ))}
              </div>

              <button className="admin-email-send" type="button" disabled={!canSend} onClick={sendCampaign}>
                <FontAwesomeIcon icon={faPaperPlane} /> {sending ? "Enviando campaña..." : `Enviar a ${recipients?.eligible ?? 0} contactos`}
              </button>
            </section>
          </main>

          <aside className="admin-email-preview-shell">
            <header>
              <span><FontAwesomeIcon icon={faEye} /> Preview en vivo</span>
              <div>
                <button type="button" className={previewMode === "desktop" ? "active" : ""} onClick={() => setPreviewMode("desktop")}>Desktop</button>
                <button type="button" className={previewMode === "mobile" ? "active" : ""} onClick={() => setPreviewMode("mobile")}>Mobile</button>
              </div>
            </header>
            <div className={`admin-email-preview-device ${previewMode}`}>
              <article className="admin-email-preview">
                <div className="admin-email-preview-head">
                  <small>219Labs</small>
                  <h2>{title || "Título de la campaña"}</h2>
                  <p>{preheader || "Texto de apoyo del email."}</p>
                </div>
                <div className="admin-email-preview-body">
                  {(content || "Escribí el contenido de la campaña. Separá párrafos con una línea en blanco.").split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  {validButtons.length > 0 && <div>{validButtons.map((button) => <a href={button.url} key={`${button.label}-${button.url}`}>{button.label}</a>)}</div>}
                  <footer>Recibiste este email porque dejaste una consulta en 219Labs.</footer>
                </div>
              </article>
            </div>
          </aside>
        </div>
      )}

      {view === "contacts" && (
        <section className="admin-email-data-panel">
          <header className="admin-email-panel-head">
            <div><small>Audiencia</small><h2>Leads con correo disponible</h2></div>
            <button type="button" onClick={loadContacts}><FontAwesomeIcon icon={faRotate} /> Actualizar</button>
          </header>
          <label className="admin-email-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, email, WhatsApp o servicio" />
          </label>
          <div className="admin-email-contact-table">
            {filteredContacts.map((contact) => (
              <article key={contact.email}>
                <span><strong>{contact.name || "Sin nombre"}</strong><small>{contact.email}</small></span>
                <span>{contact.whatsapp || "-"}</span>
                <span>{contact.service}</span>
                <span>{date(contact.updatedAt || contact.createdAt)}</span>
                <em className={contact.eligible ? "is-new" : ""}>{contact.eligible ? "Nuevo para este ID" : "Ya enviado"}</em>
              </article>
            ))}
            {!filteredContacts.length && <p className="admin-email-empty">No hay contactos para mostrar.</p>}
          </div>
        </section>
      )}

      {view === "history" && (
        <div className="admin-email-history-grid">
          <section className="admin-email-data-panel">
            <header className="admin-email-panel-head">
              <div><small>Historial</small><h2>Campañas enviadas</h2></div>
              <b>{failedTotal} fallidos</b>
            </header>
            <div className="admin-email-history-metrics">
              <article><strong>{campaigns.length}</strong><span>Campañas</span></article>
              <article><strong>{sentTotal}</strong><span>Enviados</span></article>
              <article><strong>{failedTotal}</strong><span>Fallidos</span></article>
            </div>
            <div className="admin-email-campaign-list">
              {campaigns.map((campaign) => {
                const total = Number(campaign.total || 0);
                const sent = Number(campaign.sent || 0);
                const failed = Number(campaign.failed || 0);
                const isSelected = selectedCampaign?.campaignId === campaign.campaignId;
                return (
                  <button type="button" className={`admin-email-campaign-card ${isSelected ? "is-selected" : ""}`} key={campaign.campaignId} onClick={() => loadCampaignDetail(campaign.campaignId)}>
                    <span className="admin-email-campaign-main"><strong>{campaign.campaignId}</strong><small>{campaign.subject || "Sin asunto"}</small><time>{date(campaign.lastSentAt)}</time></span>
                    <span className="admin-email-campaign-side"><b>{sent} enviados</b>{failed > 0 && <em>{failed} fallidos</em>}<i><u style={{ width: `${percent(sent, total)}%` }} /></i></span>
                  </button>
                );
              })}
              {!campaigns.length && <p className="admin-email-empty">Todavía no hay campañas enviadas.</p>}
            </div>
          </section>
          <aside className="admin-email-data-panel admin-email-campaign-detail">
            <header className="admin-email-panel-head">
              <div><small>Detalle</small><h2>{selectedCampaign?.campaignId || "Seleccioná una campaña"}</h2></div>
            </header>
            {selectedCampaign && (
              <div className="admin-email-history-metrics">
                <article><strong>{selectedCampaign.sent || 0}</strong><span>Enviados</span></article>
                <article><strong>{selectedCampaign.failed || 0}</strong><span>Fallidos</span></article>
                <article><strong>{selectedCampaign.total || 0}</strong><span>Total</span></article>
              </div>
            )}
            <div className="admin-email-recipient-list">
              {selectedCampaign?.recipients?.map((recipient) => (
                <article className="admin-email-recipient-card" key={`${recipient.email}-${recipient.updatedAt || recipient.sentAt}`}>
                  <span><strong>{recipient.name || recipient.email}</strong><small>{recipient.email} · {date(recipient.sentAt || recipient.updatedAt)}</small>{recipient.error && <small className="admin-email-recipient-error">{recipient.error}</small>}</span>
                  <em className={recipient.status === "sent" ? "is-new" : ""}>{statusLabel(recipient.status)}</em>
                </article>
              ))}
            </div>
            {!selectedCampaign && <p className="admin-email-empty">Elegí una campaña para ver destinatarios, estado por contacto y errores.</p>}
          </aside>
        </div>
      )}

      {templateModalOpen && (
        <div className="admin-email-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setTemplateModalOpen(false)}>
          <div className="admin-email-modal">
            <header>
              <small>Guardar plantilla</small>
              <h2>¿Guardamos este mensaje?</h2>
              <p>Se guarda asunto, título, preheader, contenido y botones. El ID de campaña queda afuera para poder reutilizarla.</p>
            </header>
            <label>Nombre de plantilla<input autoFocus value={templateName} onChange={(event) => setTemplateName(event.target.value)} placeholder="Ej: Seguimiento propuesta" /></label>
            <footer>
              <button type="button" onClick={() => setTemplateModalOpen(false)}>Cancelar</button>
              <button type="button" onClick={saveTemplate} disabled={!canSaveTemplate}><FontAwesomeIcon icon={faFloppyDisk} /> {loading ? "Guardando..." : "Guardar plantilla"}</button>
            </footer>
          </div>
        </div>
      )}
    </section>
  );
}
