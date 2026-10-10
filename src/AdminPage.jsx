import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faBars,
  faChartLine,
  faEnvelope,
  faMagnifyingGlass,
  faRotate,
  faTrash,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import AdminEmailMarketing from "./AdminEmailMarketing";
import Logo219 from "./components/components/Logo219";
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

function buildDailySeries(data, days = 30) {
  const byDate = new Map((data || []).map((item) => [item.date, item.count || 0]));
  const today = new Date();
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (days - 1 - index));
    const key = date.toISOString().slice(0, 10);
    return { date: key, count: byDate.get(key) || 0 };
  });
}

function linePathFromPoints(points) {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x},${point.y}`;
    const previous = points[index - 1];
    const controlX = (previous.x + point.x) / 2;
    return `${path} C ${controlX},${previous.y} ${controlX},${point.y} ${point.x},${point.y}`;
  }, "");
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

function AdminSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const active = options.find((option) => option.value === value) || options[0];

  return (
    <div className="admin-select">
      <span>{label}</span>
      <button type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <strong>{active?.label}</strong>
        <FontAwesomeIcon icon={faAngleDown} />
      </button>
      {open && (
        <div className="admin-select__menu">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className={option.value === value ? "is-selected" : ""}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TradingTape({ analytics }) {
  const summary = analytics?.summary || {};
  const channels = analytics?.channels || [];
  const devices = analytics?.devices || [];
  const topChannel = channels[0]?.channel || "Sin dato";
  const totalDeviceSessions = devices.reduce((sum, item) => sum + (item.sessions || 0), 0);
  const mobile = devices.find((item) => item.device === "mobile")?.sessions || 0;
  const mobileShare = totalDeviceSessions ? Math.round((mobile / totalDeviceSessions) * 100) : 0;
  const sessionsPerUser = summary.activeUsers ? (summary.sessions / summary.activeUsers).toFixed(2) : "0.00";
  const conversionRate = summary.sessions ? ((summary.conversions / summary.sessions) * 100).toFixed(1) : "0.0";

  const items = [
    { label: "SPU", value: sessionsPerUser, hint: "sesiones por usuario" },
    { label: "CVR", value: `${conversionRate}%`, hint: "conversiones/sesiones" },
    { label: "Canal líder", value: topChannel, hint: "mayor volumen" },
    { label: "Mobile", value: `${mobileShare}%`, hint: "share sesiones" },
  ];

  return (
    <div className="admin-trading-tape">
      {items.map((item) => (
        <article key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <small>{item.hint}</small>
        </article>
      ))}
    </div>
  );
}

function LeadsLineChart({ data }) {
  const series = buildDailySeries(data, 30);
  const width = 1280;
  const height = 330;
  const pad = { left: 46, right: 26, top: 18, bottom: 38 };
  const chartWidth = width - pad.left - pad.right;
  const chartHeight = height - pad.top - pad.bottom;
  const maxValue = Math.max(1, ...series.map((item) => item.count || 0));
  const xStep = series.length > 1 ? chartWidth / (series.length - 1) : 0;
  const points = series.map((item, index) => ({
    ...item,
    x: Number((pad.left + index * xStep).toFixed(2)),
    y: Number((pad.top + chartHeight - ((item.count || 0) / maxValue) * chartHeight).toFixed(2)),
  }));
  const linePath = linePathFromPoints(points);
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x},${height - pad.bottom} L ${points[0].x},${height - pad.bottom} Z`
    : "";
  const labelIndexes = [0, 5, 10, 15, 20, 25, 29].filter((index) => points[index]);
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <article className="admin-leads-chart admin-panel">
      <div className="admin-panel__head">
        <div>
          <span>Lead flow</span>
          <h2>Ingresos por día</h2>
        </div>
        <small>Últimos 30 días · máximo {formatNumber(maxValue)}</small>
      </div>
      <svg className="admin-leads-chart__svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Leads por día">
        <defs>
          <linearGradient id="leadArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(222, 28, 58, 0.34)" />
            <stop offset="100%" stopColor="rgba(222, 28, 58, 0)" />
          </linearGradient>
        </defs>
        {yTicks.map((ratio) => {
          const y = pad.top + chartHeight * ratio;
          return (
            <g key={ratio}>
              <line x1={pad.left} x2={width - pad.right} y1={y} y2={y} />
              <text x={pad.left - 16} y={y + 4}>{Math.round(maxValue * (1 - ratio))}</text>
            </g>
          );
        })}
        {labelIndexes.map((index) => {
          const point = points[index];
          return (
            <g key={point.date}>
              <line className="admin-leads-chart__vline" x1={point.x} x2={point.x} y1={pad.top} y2={height - pad.bottom} />
              <text className="admin-leads-chart__date" x={point.x} y={height - 8}>{formatShortDate(point.date)}</text>
            </g>
          );
        })}
        <path className="admin-leads-chart__area" d={areaPath} />
        <path className="admin-leads-chart__line" d={linePath} />
        {points.filter((item) => item.count > 0).map((point) => (
          <circle key={point.date} cx={point.x} cy={point.y} r="4" />
        ))}
      </svg>
    </article>
  );
}

function DonutChart({ title, items, labelMap = {}, colors = [] }) {
  const total = items.reduce((sum, item) => sum + (item.count || 0), 0);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <article className="admin-donut-card admin-panel">
      <div className="admin-panel__head">
        <div>
          <span>Distribución</span>
          <h2>{title}</h2>
        </div>
        <small>{formatNumber(total)} total</small>
      </div>
      {total ? (
        <div className="admin-donut-layout">
          <svg viewBox="0 0 120 120" className="admin-donut">
            <circle cx="60" cy="60" r={radius} />
            {items.map((item, index) => {
              const value = item.count || 0;
              const dash = (value / total) * circumference;
              const segment = (
                <circle
                  key={item.key}
                  cx="60"
                  cy="60"
                  r={radius}
                  stroke={colors[index % colors.length] || "var(--color-primary)"}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                />
              );
              offset += dash;
              return segment;
            })}
            <text x="60" y="56">{formatNumber(total)}</text>
            <text x="60" y="72">leads</text>
          </svg>
          <div className="admin-donut-legend">
            {items.map((item, index) => (
              <p key={item.key}>
                <i style={{ "--dot-color": colors[index % colors.length] || "var(--color-primary)" }} />
                <span>{labelMap[item.key] || item.key}</span>
                <strong>{formatNumber(item.count)}</strong>
              </p>
            ))}
          </div>
        </div>
      ) : <EmptyState title="Sin datos" text="Todavía no hay volumen para esta torta." />}
    </article>
  );
}

function PipelineFunnel({ items }) {
  const order = ["form_submitted", "whatsapp_opened", "contact_confirmed", "contacted", "qualified"];
  const counts = new Map((items || []).map((item) => [item.key, item.count || 0]));
  const maxValue = Math.max(1, ...order.map((key) => counts.get(key) || 0));

  return (
    <article className="admin-funnel-card admin-panel">
      <div className="admin-panel__head">
        <div>
          <span>Pipeline</span>
          <h2>Avance comercial</h2>
        </div>
      </div>
      <div className="admin-funnel">
        {order.map((key, index) => {
          const count = counts.get(key) || 0;
          const width = Math.max(18, Math.round((count / maxValue) * 100));
          return (
            <div className="admin-funnel__row" key={key}>
              <p>
                <span>{STATUS_LABELS[key]}</span>
                <strong>{formatNumber(count)}</strong>
              </p>
              <i style={{ "--funnel-width": `${width}%`, "--funnel-alpha": 1 - index * 0.12 }} />
            </div>
          );
        })}
      </div>
    </article>
  );
}

function MetricMatrix({ metrics }) {
  const total = metrics?.total || 0;
  const byDay = buildDailySeries(metrics?.byDay || [], 30);
  const activeDays = byDay.filter((item) => item.count > 0).length;
  const avgDaily = byDay.length ? (byDay.reduce((sum, item) => sum + item.count, 0) / byDay.length).toFixed(1) : "0.0";
  const topService = (metrics?.byService || [])[0];
  const pending = Math.max(0, total - (metrics?.contacted || 0) - (metrics?.qualified || 0));
  const contactRate = total ? Math.round(((metrics?.contacted || 0) / total) * 100) : 0;
  const cards = [
    { label: "Promedio diario", value: avgDaily, hint: "leads/día" },
    { label: "Días activos", value: formatNumber(activeDays), hint: "con ingresos" },
    { label: "Pendientes", value: formatNumber(pending), hint: "por revisar" },
    { label: "Tasa contacto", value: `${contactRate}%`, hint: "contactados + calificados" },
    { label: "Servicio líder", value: topService?.key || "Sin dato", hint: `${formatNumber(topService?.count)} leads` },
  ];

  return (
    <section className="admin-metric-matrix">
      {cards.map((card) => (
        <article key={card.label}>
          <span>{card.label}</span>
          <strong>{card.value}</strong>
          <small>{card.hint}</small>
        </article>
      ))}
    </section>
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

      <TradingTape analytics={analytics} />
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
  const statusOptions = [{ value: "all", label: "Todos" }, ...STATUS_OPTIONS];
  const serviceOptions = [{ value: "all", label: "Todos" }, ...services];
  const whatsappHref = activeLead?.contact?.whatsapp
    ? `https://wa.me/${activeLead.contact.whatsapp.replace(/\D/g, "")}`
    : "";
  const emailHref = activeLead?.contact?.email
    ? `mailto:${activeLead.contact.email}?subject=Consulta%20219Labs`
    : "";

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
              <div className="admin-search">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre, WhatsApp, servicio..." />
              </div>
            </label>
            <div className="admin-filter-row">
              <AdminSelect label="Estado" value={statusFilter} options={statusOptions} onChange={setStatusFilter} />
              <AdminSelect label="Servicio" value={serviceFilter} options={serviceOptions} onChange={setServiceFilter} />
            </div>
            <button type="button" onClick={loadAdminData} disabled={loading}>
              <FontAwesomeIcon icon={faRotate} /> {loading ? "Actualizando..." : "Actualizar"}
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
                  <AdminSelect label="Estado comercial" value={activeLead.status} options={STATUS_OPTIONS} onChange={(status) => updateLead(activeLead._id, { status })} />
                  <button type="button" className="admin-danger" onClick={() => deleteLead(activeLead._id)}>
                    <FontAwesomeIcon icon={faTrash} />
                    <span className="admin-sr-only">Borrar lead</span>
                  </button>
                </div>
              </div>

              <div className="admin-contact-actions">
                {whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noreferrer">
                    <FontAwesomeIcon icon={faWhatsapp} /> Contactar por WhatsApp
                  </a>
                )}
                {emailHref && (
                  <a href={emailHref}>
                    <FontAwesomeIcon icon={faEnvelope} /> Enviar email
                  </a>
                )}
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
  const [navCollapsed, setNavCollapsed] = useState(false);
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
    <main className={`admin-page${navCollapsed ? " admin-page--nav-collapsed" : ""}`}>
      <aside className="admin-nav">
        <div className="admin-brand">
          <Logo219 />
          <span>Labs Admin</span>
        </div>

        <nav aria-label="Administración">
          <button type="button" className={activeView === "metrics" ? "is-active" : ""} onClick={() => setActiveView("metrics")} title="Métricas">
            <FontAwesomeIcon icon={faChartLine} />
            <strong>Métricas</strong>
          </button>
          <button type="button" className={activeView === "leads" ? "is-active" : ""} onClick={() => setActiveView("leads")} title="Leads">
            <FontAwesomeIcon icon={faUsers} />
            <strong>Leads</strong>
          </button>
          <button type="button" className={activeView === "email" ? "is-active" : ""} onClick={() => setActiveView("email")} title="Email MKT">
            <FontAwesomeIcon icon={faEnvelope} />
            <strong>Email MKT</strong>
          </button>
        </nav>

        <div className="admin-nav__pulse">
          <span>Pipeline</span>
          <strong>{formatNumber(leadPulse.total)}</strong>
          <p>{formatNumber(leadPulse.pending)} pendientes · {formatNumber(leadPulse.qualified)} calificados</p>
        </div>

        <button type="button" className="admin-nav__toggle" onClick={() => setNavCollapsed((current) => !current)} title="Minimizar menú">
          <FontAwesomeIcon icon={faBars} />
        </button>
      </aside>

      <section className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <p className="admin-kicker">219Labs Admin</p>
            <h1>{activeView === "metrics" ? "Métricas generales." : activeView === "leads" ? "Gestión de leads." : "Email marketing."}</h1>
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

            <MetricMatrix metrics={metrics} />

            <LeadsLineChart data={metrics?.byDay || []} />

            <div className="admin-panels-grid">
              <DonutChart
                title="Estados"
                items={metrics?.byStatus || []}
                labelMap={STATUS_LABELS}
                colors={["#00ff88", "#de1c3a", "#f7d35a", "#4bb3ff", "#8a7cff"]}
              />
              <DonutChart
                title="Servicios"
                items={(metrics?.byService || []).slice(0, 6)}
                colors={["#de1c3a", "#00ff88", "#f7d35a", "#4bb3ff", "#c277ff", "#ffffff"]}
              />
              <PipelineFunnel items={metrics?.byStatus || []} />
              <BreakdownPanel title="Por estado" items={metrics?.byStatus || []} labelMap={STATUS_LABELS} />
              <BreakdownPanel title="Por servicio" items={metrics?.byService || []} />
            </div>
          </section>
        ) : activeView === "leads" ? (
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
        ) : (
          <AdminEmailMarketing apiRequest={apiRequest} csrf={csrf} />
        )}
      </section>
    </main>
  );
}
