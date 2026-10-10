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
    </div>
  );
}

function AnalyticsBars({ title, items, labelKey, valueKey, metaKey }) {
  const maxValue = Math.max(1, ...items.map((item) => item[valueKey] || 0));

  return (
    <article className="admin-bars">
      <h2>{title}</h2>
      <div>
        {items.map((item) => {
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
        })}
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
          <h2>Falta conectar GA4.</h2>
          <p>{error}</p>
        </div>
        <p>Cuando cargues las credenciales del service account en el env, este módulo muestra tráfico, páginas, canales, dispositivos y conversiones.</p>
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
          <h2>Lectura comercial del tráfico.</h2>
        </div>
        <span>Últimos 30 días</span>
      </div>

      <div className="admin-analytics__kpis">
        <article>
          <span>Usuarios activos</span>
          <strong>{formatNumber(summary.activeUsers)}</strong>
        </article>
        <article>
          <span>Sesiones</span>
          <strong>{formatNumber(summary.sessions)}</strong>
        </article>
        <article>
          <span>Vistas</span>
          <strong>{formatNumber(summary.views)}</strong>
        </article>
        <article>
          <span>Engagement</span>
          <strong>{summary.engagementRate || 0}%</strong>
        </article>
        <article>
          <span>Conversiones</span>
          <strong>{formatNumber(summary.conversions)}</strong>
        </article>
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

export default function AdminPage() {
  const googleButtonRef = useRef(null);
  const [user, setUser] = useState(null);
  const [csrf, setCsrf] = useState("");
  const [sessionChecked, setSessionChecked] = useState(false);
  const [loginError, setLoginError] = useState("");
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
      setMetrics(metricsData.metrics);
      setLeads(leadsData.leads || []);
      if (analyticsResult.data) {
        setAnalytics(analyticsResult.data.analytics || null);
        setAnalyticsError("");
      } else {
        setAnalytics(null);
        setAnalyticsError(analyticsResult.error.message);
      }
      if (!activeLeadId && leadsData.leads?.[0]?._id) setActiveLeadId(leadsData.leads[0]._id);
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
      <main className="admin-page">
        <div className="admin-shell">
          <p className="admin-loading">Cargando panel...</p>
        </div>
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
      <div className="admin-shell">
        <header className="admin-header">
          <div>
            <p className="admin-kicker">219Labs Admin</p>
            <h1>Leads y métricas.</h1>
          </div>
          <div className="admin-user">
            {user.picture && <img src={user.picture} alt="" />}
            <span>{user.email}</span>
            <button type="button" onClick={logout}>Salir</button>
          </div>
        </header>

        <section className="admin-metrics" aria-label="Métricas principales">
          <article>
            <span>Total</span>
            <strong>{metrics?.total ?? "-"}</strong>
          </article>
          <article>
            <span>Últimos 30 días</span>
            <strong>{metrics?.last30Days ?? "-"}</strong>
          </article>
          <article>
            <span>WhatsApp abierto</span>
            <strong>{metrics?.whatsappOpenRate ?? 0}%</strong>
          </article>
          <article>
            <span>Calificados</span>
            <strong>{metrics?.qualifiedRate ?? 0}%</strong>
          </article>
        </section>

        <section className="admin-breakdowns" aria-label="Métricas detalladas">
          <article>
            <h2>Por estado</h2>
            {(metrics?.byStatus || []).map((item) => (
              <p key={item.key}>
                <span>{STATUS_LABELS[item.key] || item.key}</span>
                <strong>{item.count}</strong>
              </p>
            ))}
          </article>
          <article>
            <h2>Por servicio</h2>
            {(metrics?.byService || []).map((item) => (
              <p key={item.key}>
                <span>{item.key}</span>
                <strong>{item.count}</strong>
              </p>
            ))}
          </article>
        </section>

        <AnalyticsPanel analytics={analytics} error={analyticsError} />

        <section className="admin-layout">
          <aside className="admin-sidebar">
            <div className="admin-filters">
              <label>
                Buscar
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre, WhatsApp, servicio..." />
              </label>
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
              {!leads.length && <p className="admin-empty">Todavía no hay leads con estos filtros.</p>}
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
                  <select
                    value={activeLead.status}
                    onChange={(event) => updateLead(activeLead._id, { status: event.target.value })}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
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
              <p className="admin-empty">Seleccioná un lead para ver el detalle.</p>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
