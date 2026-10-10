import { useEffect, useMemo, useRef, useState } from "react";
import "./admin.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const STATUS_OPTIONS = [
  { value: "form_submitted", label: "Formulario enviado" },
  { value: "whatsapp_opened", label: "WhatsApp abierto" },
  { value: "contact_confirmed", label: "Contacto confirmado" },
  { value: "contacted", label: "Contactado" },
  { value: "qualified", label: "Calificado" },
];

const STATUS_LABELS = STATUS_OPTIONS.reduce((labels, item) => ({
  ...labels,
  [item.value]: item.label,
}), {});

function formatDate(value) {
  if (!value) return "Sin fecha";
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatShortDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${value}T00:00:00`));
}

function formatNumber(value) {
  return new Intl.NumberFormat("es-AR").format(Number(value || 0));
}

function compactNumber(value) {
  return new Intl.NumberFormat("es-AR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));
}

async function apiRequest(url, options = {}, csrf = "") {
  const method = (options.method || "GET").toUpperCase();
  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(method !== "GET" && csrf ? { "X-Admin-CSRF": csrf } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || "No pudimos completar la operación.");
  }
  return data;
}

function EmptyState({ title, text }) {
  return (
    <div className="admin-empty-state">
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

function KpiCard({ label, value, hint, tone = "default" }) {
  return (
    <article className={`admin-kpi-card admin-kpi-card--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {hint && <small>{hint}</small>}
    </article>
  );
}

function TinyTrend({ data }) {
  const points = data || [];
  const maxValue = Math.max(1, ...points.map((item) => item.count || 0));

  return (
    <article className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <span>Leads</span>
          <h2>Ingresos por día</h2>
        </div>
        <small>Últimos 30 días</small>
      </div>
      <div className="admin-trend-bars" aria-label="Leads por día">
        {points.length ? points.map((item) => (
          <span
            key={item.date}
            style={{ "--bar-height": `${Math.max(8, Math.round(((item.count || 0) / maxValue) * 100))}%` }}
            title={`${formatShortDate(item.date)}: ${item.count}`}
          />
        )) : <EmptyState title="Sin datos todavía" text="Cuando entren leads, este gráfico muestra el ritmo diario." />}
      </div>
    </article>
  );
}

function BreakdownPanel({ title, items, labelMap = {} }) {
  const maxValue = Math.max(1, ...items.map((item) => item.count || 0));

  return (
    <article className="admin-panel">
      <div className="admin-panel__head">
        <div>
          <span>Desglose</span>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="admin-breakdown-list">
        {items.length ? items.map((item) => {
          const percent = Math.max(3, Math.round(((item.count || 0) / maxValue) * 100));
          return (
            <div className="admin-breakdown-row" key={item.key}>
              <p>
                <span>{labelMap[item.key] || item.key}</span>
                <strong>{formatNumber(item.count)}</strong>
              </p>
              <i style={{ "--bar-size": `${percent}%` }} />
            </div>
          );
        }) : <EmptyState title="Sin actividad" text="Todavía no hay datos para este desglose." />}
      </div>
    </article>
  );
}

function AnalyticsLineChart({ data }) {
  const points = data || [];
  const width = 920;
  const height = 310;
  const padX = 34;
  const padTop = 24;
  const padBottom = 34;
  const chartHeight = height - padTop - padBottom;
  const maxValue = Math.max(1, ...points.flatMap((item) => [item.sessions || 0, item.conversions || 0]));
  const xStep = points.length > 1 ? (width - padX * 2) / (points.length - 1) : 0;

  const toPoint = (item, index, key) => {
    const x = padX + index * xStep;
    const y = padTop + chartHeight - ((item[key] || 0) / maxValue) * chartHeight;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  };

  const sessionsLine = points.map((item, index) => toPoint(item, index, "sessions")).join(" ");
  const conversionsLine = points.map((item, index) => toPoint(item, index, "conversions")).join(" ");
  const areaPath = points.length
    ? `M ${points.map((item, index) => toPoint(item, index, "sessions")).join(" L ")} L ${padX + (points.length - 1) * xStep},${height - padBottom} L ${padX},${height - padBottom} Z`
    : "";
  const labelIndexes = points.length > 4
    ? [0, Math.floor(points.length / 3), Math.floor((points.length / 3) * 2), points.length - 1]
    : points.map((_, index) => index);

  return (
    <div className="admin-chart">
      <div className="admin-chart__top">
        <div>
          <span>GA4 · 30 días</span>
          <h2>Tráfico y conversiones</h2>
        </div>
        <div className="admin-chart__legend">
          <span><i /> Sesiones</span>
          <span><i className="is-alt" /> Conversiones</span>
        </div>
      </div>

      {points.length ? (
        <svg className="admin-chart__svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Evolución de sesiones y conversiones">
          <defs>
            <linearGradient id="sessionsArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(0, 255, 136, 0.26)" />
              <stop offset="100%" stopColor="rgba(0, 255, 136, 0)" />
            </linearGradient>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padTop + chartHeight * ratio;
            return (
              <g key={ratio}>
                <line x1={padX} x2={width - padX} y1={y} y2={y} />
                <text x={width - padX + 8} y={y + 4}>{compactNumber(maxValue * (1 - ratio))}</text>
              </g>
            );
          })}
          {areaPath && <path className="admin-chart__area" d={areaPath} />}
          {sessionsLine && <polyline className="admin-chart__line" points={sessionsLine} />}
          {conversionsLine && <polyline className="admin-chart__line admin-chart__line--alt" points={conversionsLine} />}
          {points.map((item, index) => (
            <circle key={`${item.date}-${index}`} className="admin-chart__dot" cx={padX + index * xStep} cy={padTop + chartHeight - ((item.sessions || 0) / maxValue) * chartHeight} r="3.5" />
          ))}
          {labelIndexes.map((index) => (
            <text key={index} className="admin-chart__date" x={padX + index * xStep} y={height - 8}>
              {formatShortDate(points[index]?.date)}
            </text>
          ))}
        </svg>
      ) : <EmptyState title="Sin timeline" text="GA4 respondió, pero todavía no hay datos diarios para graficar." />}
    </div>
  );
}

function AnalyticsBars({ title, items, labelKey, valueKey, metaKey }) {
  const maxValue = Math.max(1, ...items.map((item) => item[valueKey] || 0));

  return (
    <article className="admin-bars">
      <h2>{title}</h2>
      <div>
        {items.length ? items.map((item) => {
          const value = item[valueKey] || 0;
          const percent = Math.max(2, Math.round((value / maxValue) * 100));
          return (
            <div className="admin-bar" key={item[labelKey]}>
              <p>
                <span>{item[labelKey]}</span>
                <strong>{formatNumber(value)}</strong>
              </p>
              <div className="admin-bar__track">
                <i style={{ "--bar-size": `${percent}%` }} />
              </div>
              {metaKey && <small>{formatNumber(item[metaKey])} conversiones</small>}
            </div>
          );
        }) : <EmptyState title="Sin datos" text="No hay filas disponibles para esta lectura." />}
      </div>
    </article>
  );
}

function AnalyticsPanel({ analytics, error }) {
  if (error) {
    return (
      <section className="admin-analytics admin-analytics--empty">
        <div>
          <span>Google Analytics</span>
          <h2>GA4 todavía no está leyendo.</h2>
          <p>{error}</p>
        </div>
        <p>Cuando el service account tenga permisos en la propiedad, este módulo muestra tráfico, páginas, canales, dispositivos y conversiones.</p>
      </section>
    );
  }

  if (!analytics) return null;

  const summary = analytics.summary || {};
  const timeline = analytics.timeline || [];
  const channels = analytics.channels || [];
  const pages = analytics.pages || [];
  const devices = analytics.devices || [];

  return (
    <section className="admin-analytics" aria-label="Métricas de Google Analytics">
      <div className="admin-analytics__head">
        <div>
          <p className="admin-kicker">Google Analytics</p>
          <h2>Panorama total del sitio.</h2>
        </div>
        <span>Últimos 30 días</span>
      </div>

      <div className="admin-analytics__kpis">
        <KpiCard label="Usuarios activos" value={formatNumber(summary.activeUsers)} hint="Personas únicas activas" />
        <KpiCard label="Sesiones" value={formatNumber(summary.sessions)} hint="Visitas con actividad" />
        <KpiCard label="Vistas" value={formatNumber(summary.views)} hint="Páginas vistas" />
        <KpiCard label="Engagement" value={`${summary.engagementRate || 0}%`} hint="Sesiones con interacción" tone="warm" />
        <KpiCard label="Conversiones" value={formatNumber(summary.conversions)} hint="Eventos clave GA4" tone="hot" />
      </div>

      <AnalyticsLineChart data={timeline} />

      <div className="admin-analytics__grid">
        <AnalyticsBars title="Canales" items={channels} labelKey="channel" valueKey="sessions" metaKey="conversions" />
        <AnalyticsBars title="Páginas" items={pages} labelKey="path" valueKey="views" />
        <AnalyticsBars title="Dispositivos" items={devices} labelKey="device" valueKey="sessions" />
      </div>
    </section>
  );
}

function LeadsView({
  activeLead,
  leads,
  loading,
  metrics,
  notes,
  search,
  services,
  serviceFilter,
  statusFilter,
  setActiveLeadId,
  setNotes,
  setSearch,
  setServiceFilter,
  setStatusFilter,
  loadAdminData,
  updateLead,
  deleteLead,
}) {
  return (
    <section className="admin-view">
      <div className="admin-kpi-grid admin-kpi-grid--four">
        <KpiCard label="Total leads" value={formatNumber(metrics?.total)} hint="Consultas registradas" />
        <KpiCard label="Últimos 30 días" value={formatNumber(metrics?.last30Days)} hint="Demanda reciente" />
        <KpiCard label="Contactables" value={formatNumber(metrics?.contacted)} hint="Contactados o calificados" tone="warm" />
        <KpiCard label="Calificados" value={`${metrics?.qualifiedRate ?? 0}%`} hint={`${formatNumber(metrics?.qualified)} oportunidades`} tone="hot" />
      </div>

      <div className="admin-leads-workbench">
        <aside className="admin-leads-list">
          <div className="admin-filters">
            <label>
              Buscar
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre, WhatsApp, servicio..." />
            </label>
            <div className="admin-filter-row">
              <label>
                Estado
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option value="all">Todos</option>
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </label>
              <label>
                Servicio
                <select value={serviceFilter} onChange={(event) => setServiceFilter(event.target.value)}>
                  <option value="all">Todos</option>
                  {services.map((service) => (
                    <option key={service.value} value={service.value}>{service.label}</option>
                  ))}
                </select>
              </label>
            </div>
            <button type="button" onClick={loadAdminData} disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
          </div>

          <div className="admin-lead-list">
            {leads.map((lead) => (
              <button
                type="button"
                key={lead._id}
                className={activeLead?._id === lead._id ? "is-active" : ""}
                onClick={() => setActiveLeadId(lead._id)}
              >
                <span>{lead.contact?.name || "Sin nombre"}</span>
                <strong>{lead.service?.label}</strong>
                <small>{STATUS_LABELS[lead.status] || lead.status} · {formatDate(lead.createdAt)}</small>
              </button>
            ))}
            {!leads.length && <EmptyState title="Sin leads" text="No hay consultas con estos filtros." />}
          </div>
        </aside>

        <section className="admin-detail">
          {activeLead ? (
            <>
              <div className="admin-detail__head">
                <div>
                  <span>{STATUS_LABELS[activeLead.status] || activeLead.status}</span>
                  <h2>{activeLead.contact?.name}</h2>
                  <p>{activeLead.service?.label} · {activeLead.service?.need}</p>
                </div>
                <div className="admin-detail__actions">
                  <select
                    value={activeLead.status}
                    onChange={(event) => updateLead(activeLead._id, { status: event.target.value })}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                  <button type="button" className="admin-danger" onClick={() => deleteLead(activeLead._id)}>
                    Borrar
                  </button>
                </div>
              </div>

              <div className="admin-grid">
                <article>
                  <span>WhatsApp</span>
                  <a href={`https://wa.me/${activeLead.contact?.whatsapp?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                    {activeLead.contact?.whatsapp}
                  </a>
                </article>
                <article>
                  <span>Email</span>
                  <strong>{activeLead.contact?.email || "No dejó email"}</strong>
                </article>
                <article>
                  <span>Origen</span>
                  <strong>{activeLead.source?.origin || "Web"}</strong>
                </article>
                <article>
                  <span>Fecha</span>
                  <strong>{formatDate(activeLead.createdAt)}</strong>
                </article>
              </div>

              <article className="admin-block">
                <span>Detalle</span>
                <p>{activeLead.service?.detail}</p>
                {activeLead.service?.secondary && (
                  <p><strong>{activeLead.service.secondaryLabel}:</strong> {activeLead.service.secondary}</p>
                )}
              </article>

              <article className="admin-block">
                <span>Notas internas</span>
                <textarea
                  value={notes[activeLead._id] || ""}
                  onChange={(event) => setNotes((current) => ({ ...current, [activeLead._id]: event.target.value }))}
                  placeholder="Agregá una nota comercial..."
                  rows="4"
                />
                <button
                  type="button"
                  disabled={!notes[activeLead._id]?.trim()}
                  onClick={() => updateLead(activeLead._id, { note: notes[activeLead._id] })}
                >
                  Guardar nota
                </button>
                <div className="admin-notes">
                  {(activeLead.adminNotes || []).map((item, index) => (
                    <p key={`${item.at}-${index}`}>
                      <strong>{formatDate(item.at)}</strong> {item.note}
                    </p>
                  ))}
                </div>
              </article>

              <article className="admin-block">
                <span>Historial</span>
                <div className="admin-timeline">
                  {(activeLead.statusHistory || []).map((item, index) => (
                    <p key={`${item.status}-${item.at}-${index}`}>
                      <strong>{STATUS_LABELS[item.status] || item.status}</strong>
                      <small>{formatDate(item.at)}</small>
                    </p>
                  ))}
                </div>
              </article>
            </>
          ) : (
            <EmptyState title="Seleccioná un lead" text="Acá vas a ver contacto, detalle, notas e historial." />
          )}
        </section>
      </div>
    </section>
  );
}

export default function AdminPage() {
  const googleButtonRef = useRef(null);
  const [user, setUser] = useState(null);
  const [csrf, setCsrf] = useState("");
  const [sessionChecked, setSessionChecked] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [activeView, setActiveView] = useState("metrics");
  const [metrics, setMetrics] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsError, setAnalyticsError] = useState("");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activeLeadId, setActiveLeadId] = useState("");
  const [notes, setNotes] = useState({});

  const services = useMemo(() => {
    const unique = new Map();
    leads.forEach((lead) => {
      if (lead.service?.key && lead.service?.label) unique.set(lead.service.key, lead.service.label);
    });
    return Array.from(unique, ([value, label]) => ({ value, label }));
  }, [leads]);

  const activeLead = leads.find((lead) => lead._id === activeLeadId) || leads[0];

  const leadPulse = useMemo(() => {
    const total = metrics?.total || 0;
    const opened = metrics?.whatsappOpened || 0;
    const qualified = metrics?.qualified || 0;
    const pending = Math.max(0, total - opened - qualified);
    return { total, opened, qualified, pending };
  }, [metrics]);

  const loadSession = async () => {
    try {
      const data = await apiRequest("/api/admin/session");
      setUser(data.user || null);
      setCsrf(data.csrf || "");
    } catch {
      setUser(null);
      setCsrf("");
    } finally {
      setSessionChecked(true);
    }
  };

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        status: statusFilter,
        service: serviceFilter,
        search,
        limit: "100",
      });
      const analyticsRequest = apiRequest("/api/admin/analytics")
        .then((data) => ({ data }))
        .catch((error) => ({ error }));
      const [metricsData, leadsData, analyticsResult] = await Promise.all([
        apiRequest("/api/admin/metrics"),
        apiRequest(`/api/admin/leads?${params.toString()}`),
        analyticsRequest,
      ]);
      const nextLeads = leadsData.leads || [];
      setMetrics(metricsData.metrics);
      setLeads(nextLeads);
      if (analyticsResult.data) {
        setAnalytics(analyticsResult.data.analytics || null);
        setAnalyticsError("");
      } else {
        setAnalytics(null);
        setAnalyticsError(analyticsResult.error.message);
      }
      if (!nextLeads.some((lead) => lead._id === activeLeadId)) {
        setActiveLeadId(nextLeads[0]?._id || "");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (!user) return;
    loadAdminData();
  }, [user, statusFilter, serviceFilter]);

  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(loadAdminData, 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (user || !sessionChecked || !GOOGLE_CLIENT_ID) return;

    const renderButton = () => {
      if (!window.google || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          setLoginError("");
          try {
            const data = await apiRequest("/api/admin/login", {
              method: "POST",
              body: JSON.stringify({ credential: response.credential }),
            });
            setUser(data.user);
            setCsrf(data.csrf || "");
          } catch (error) {
            setLoginError(error.message);
          }
        },
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "filled_black",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
      });
    };

    if (window.google) {
      renderButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    document.body.appendChild(script);
  }, [sessionChecked, user]);

  const updateLead = async (leadId, update) => {
    const data = await apiRequest("/api/admin/leads", {
      method: "PATCH",
      body: JSON.stringify({ leadId, ...update }),
    }, csrf);
    setLeads((current) => current.map((lead) => (lead._id === leadId ? data.lead : lead)));
    setNotes((current) => ({ ...current, [leadId]: "" }));
    const metricsData = await apiRequest("/api/admin/metrics");
    setMetrics(metricsData.metrics);
  };

  const deleteLead = async (leadId) => {
    if (!window.confirm("¿Borrar este lead del panel?")) return;
    await apiRequest("/api/admin/leads", {
      method: "DELETE",
      body: JSON.stringify({ leadId }),
    }, csrf);
    await loadAdminData();
  };

  const logout = async () => {
    await apiRequest("/api/admin/logout", { method: "POST" }, csrf);
    setUser(null);
    setCsrf("");
    setMetrics(null);
    setAnalytics(null);
    setAnalyticsError("");
    setLeads([]);
    setActiveLeadId("");
  };

  if (!sessionChecked) {
    return (
      <main className="admin-page admin-page--boot">
        <p className="admin-loading">Cargando panel...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="admin-page admin-page--login">
        <section className="admin-login">
          <p className="admin-kicker">219Labs Admin</p>
          <h1>Panel privado de oportunidades.</h1>
          <p>Ingresá con Google para ver leads, métricas y estados comerciales.</p>
          {GOOGLE_CLIENT_ID ? (
            <div className="admin-google" ref={googleButtonRef} />
          ) : (
            <div className="admin-alert">
              Falta configurar <strong>VITE_GOOGLE_CLIENT_ID</strong> para mostrar el login.
            </div>
          )}
          {loginError && <div className="admin-alert">{loginError}</div>}
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <aside className="admin-nav">
        <div className="admin-brand">
          <strong>219</strong>
          <span>Labs Admin</span>
        </div>

        <nav aria-label="Administración">
          <button type="button" className={activeView === "metrics" ? "is-active" : ""} onClick={() => setActiveView("metrics")}>
            <span>01</span> Métricas
          </button>
          <button type="button" className={activeView === "leads" ? "is-active" : ""} onClick={() => setActiveView("leads")}>
            <span>02</span> Leads
          </button>
        </nav>

        <div className="admin-nav__pulse">
          <span>Pipeline</span>
          <strong>{formatNumber(leadPulse.total)}</strong>
          <p>{formatNumber(leadPulse.pending)} pendientes · {formatNumber(leadPulse.qualified)} calificados</p>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <p className="admin-kicker">219Labs Admin</p>
            <h1>{activeView === "metrics" ? "Métricas generales." : "Gestión de leads."}</h1>
          </div>
          <div className="admin-user">
            {user.picture && <img src={user.picture} alt="" />}
            <span>{user.email}</span>
            <button type="button" onClick={logout}>Salir</button>
          </div>
        </header>

        {activeView === "metrics" ? (
          <section className="admin-view">
            <div className="admin-kpi-grid">
              <KpiCard label="Leads totales" value={formatNumber(metrics?.total)} hint="Consultas guardadas" />
              <KpiCard label="Últimos 30 días" value={formatNumber(metrics?.last30Days)} hint="Actividad reciente" />
              <KpiCard label="WhatsApp abierto" value={`${metrics?.whatsappOpenRate ?? 0}%`} hint={`${formatNumber(metrics?.whatsappOpened)} aperturas`} tone="warm" />
              <KpiCard label="Calificados" value={`${metrics?.qualifiedRate ?? 0}%`} hint={`${formatNumber(metrics?.qualified)} oportunidades`} tone="hot" />
            </div>

            <AnalyticsPanel analytics={analytics} error={analyticsError} />

            <div className="admin-panels-grid">
              <TinyTrend data={metrics?.byDay || []} />
              <BreakdownPanel title="Por estado" items={metrics?.byStatus || []} labelMap={STATUS_LABELS} />
              <BreakdownPanel title="Por servicio" items={metrics?.byService || []} />
            </div>
          </section>
        ) : (
          <LeadsView
            activeLead={activeLead}
            leads={leads}
            loading={loading}
            metrics={metrics}
            notes={notes}
            search={search}
            services={services}
            serviceFilter={serviceFilter}
            statusFilter={statusFilter}
            setActiveLeadId={setActiveLeadId}
            setNotes={setNotes}
            setSearch={setSearch}
            setServiceFilter={setServiceFilter}
            setStatusFilter={setStatusFilter}
            loadAdminData={loadAdminData}
            updateLead={updateLead}
            deleteLead={deleteLead}
          />
        )}
      </section>
    </main>
  );
}
