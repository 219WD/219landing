import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import { requireAdmin, requireAdminCsrf } from "../_lib/auth.js";
import {
  getEmailCampaignSendsCollection,
  getEmailTemplatesCollection,
  getLeadsCollection,
} from "../_lib/mongo.js";
import { ApiError, getQueryValue, getText, handleError, handleOptions, sendJson } from "../_lib/http.js";

const MAX_BUTTONS = 3;
const MAX_SENDS_PER_REQUEST = 250;

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeButtons(buttons = []) {
  return (Array.isArray(buttons) ? buttons : [])
    .filter((button) => getText(button?.label, 80) && getText(button?.url, 700))
    .slice(0, MAX_BUTTONS)
    .map((button) => ({
      label: getText(button.label, 80),
      url: getText(button.url, 700),
    }));
}

function serializeDate(value) {
  return value?.toISOString?.() || value || null;
}

function serializeTemplate(template = {}) {
  return {
    id: String(template._id),
    name: template.name || "",
    subject: template.subject || "",
    title: template.title || "",
    preheader: template.preheader || "",
    content: template.content || "",
    buttons: normalizeButtons(template.buttons || []),
    createdAt: serializeDate(template.createdAt),
    updatedAt: serializeDate(template.updatedAt),
  };
}

function serializeRecipient(lead = {}, sentEmails = new Set()) {
  const email = normalizeEmail(lead.contact?.email);
  const alreadySent = sentEmails.has(email);
  return {
    id: String(lead._id),
    email,
    name: lead.contact?.name || "",
    whatsapp: lead.contact?.whatsapp || "",
    service: lead.service?.label || "Sin servicio",
    status: lead.status || "form_submitted",
    createdAt: serializeDate(lead.createdAt),
    updatedAt: serializeDate(lead.updatedAt),
    alreadySent,
    eligible: !alreadySent,
  };
}

function validateCampaign(input = {}) {
  const campaignId = getText(input.campaignId, 80);
  const subject = getText(input.subject, 140);
  const title = getText(input.title, 140);
  const preheader = getText(input.preheader, 240);
  const content = getText(input.content, 6000);

  if (!campaignId) throw new ApiError(400, "Falta el ID de campaña.");
  if (!/^[a-zA-Z0-9_-]{3,80}$/.test(campaignId)) {
    throw new ApiError(400, "El ID de campaña solo puede tener letras, números, guiones y guion bajo.");
  }
  if (!subject) throw new ApiError(400, "Falta el asunto.");
  if (!title) throw new ApiError(400, "Falta el título principal.");
  if (!content) throw new ApiError(400, "Falta el contenido.");

  return {
    campaignId,
    subject,
    title,
    preheader,
    content,
    buttons: normalizeButtons(input.buttons),
  };
}

function validateTemplate(input = {}) {
  const campaign = validateCampaign({ ...input, campaignId: "template" });
  const name = getText(input.name, 90);
  if (name.length < 3) throw new ApiError(400, "El nombre de la plantilla debe tener al menos 3 caracteres.");
  return { ...campaign, campaignId: undefined, name };
}

function getPublicUrl(request) {
  return String(
    process.env.PUBLIC_SITE_URL
      || process.env.VITE_PUBLIC_SITE_URL
      || `https://${request.headers.host || "219labs.com.ar"}`,
  ).replace(/\/+$/, "");
}

function getEmailConfig() {
  const host = process.env.EMAIL_MARKETING_HOST || process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_MARKETING_PORT || process.env.SMTP_PORT || process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_MARKETING_USER || process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.EMAIL_MARKETING_PASS || process.env.SMTP_PASS || process.env.EMAIL_PASSWORD;
  const from = process.env.EMAIL_MARKETING_FROM || process.env.EMAIL_FROM || (user ? `"219Labs" <${user}>` : "");

  if (!host || !user || !pass || !from) {
    throw new ApiError(503, "Faltan credenciales SMTP para enviar campañas. Configurá EMAIL_MARKETING_HOST, EMAIL_MARKETING_USER, EMAIL_MARKETING_PASS y EMAIL_MARKETING_FROM.");
  }

  return { host, port, user, pass, from, secure: port === 465 };
}

function createTransporter() {
  const config = getEmailConfig();
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 12000,
  });
}

function paragraphsToHtml(content = "") {
  return String(content)
    .trim()
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function buildEmailHtml({ campaign, publicUrl, recipient }) {
  const buttonsHtml = campaign.buttons
    .map((button) => `<a class="cta-btn" href="${escapeHtml(button.url)}">${escapeHtml(button.label)}</a>`)
    .join("");
  const whatsappUrl = `https://wa.me/543816671884?text=${encodeURIComponent("Hola 219Labs, vengo desde una campaña de email.")}`;

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>*{box-sizing:border-box}body{margin:0;background:#050807;font-family:Arial,Helvetica,sans-serif;color:#f5f5f5}.preheader{display:none;max-height:0;overflow:hidden;opacity:0}.wrap{max-width:640px;margin:28px auto;background:#101211;border:1px solid rgba(255,255,255,.12);border-radius:14px;overflow:hidden}.head{padding:34px 30px;background:linear-gradient(135deg,#06170f,#111311 70%,#092316);border-bottom:1px solid rgba(0,255,136,.22)}.mark{font-size:11px;font-weight:900;letter-spacing:.18em;text-transform:uppercase;color:#00ff88}.head h1{margin:12px 0 8px;font-size:32px;line-height:1.08}.head p{margin:0;color:rgba(255,255,255,.68);line-height:1.6}.body{padding:30px}.body p{margin:0 0 15px;color:rgba(255,255,255,.76);font-size:15px;line-height:1.75}.cta{margin:26px 0 6px}.cta-btn{display:inline-block;margin:6px 8px 6px 0;padding:13px 18px;border-radius:8px;background:#00ff88;color:#06100b!important;text-decoration:none;font-weight:900}.contact{margin-top:24px;padding:18px;border:1px solid rgba(255,255,255,.12);border-radius:10px;background:rgba(255,255,255,.04)}.contact p{font-size:13px}.contact a{color:#00ff88}.footer{padding:18px 30px;background:#070807;color:rgba(255,255,255,.45);font-size:11px;line-height:1.6}</style></head><body><span class="preheader">${escapeHtml(campaign.preheader || campaign.subject)}</span><div class="wrap"><div class="head"><div class="mark">219Labs</div><h1>${escapeHtml(campaign.title)}</h1><p>${escapeHtml(campaign.preheader || "Comunicación de 219Labs")}</p></div><div class="body">${paragraphsToHtml(campaign.content)}${buttonsHtml ? `<div class="cta">${buttonsHtml}</div>` : ""}<div class="contact"><p>Contacto directo: <a href="${whatsappUrl}">WhatsApp</a> · <a href="${escapeHtml(publicUrl)}">219Labs</a></p></div></div><div class="footer">Recibiste este email porque dejaste una consulta en 219Labs. Enviado a ${escapeHtml(recipient.email)}.</div></div></body></html>`;
}

async function loadRecipients(campaignId = "") {
  const leadsCollection = await getLeadsCollection();
  const leads = await leadsCollection
    .find({ "contact.email": { $exists: true, $nin: [null, ""] } })
    .sort({ updatedAt: -1, createdAt: -1 })
    .limit(1000)
    .toArray();

  const unique = new Map();
  for (const lead of leads) {
    const email = normalizeEmail(lead.contact?.email);
    if (!isValidEmail(email) || unique.has(email)) continue;
    unique.set(email, { ...lead, contact: { ...(lead.contact || {}), email } });
  }

  const recipients = [...unique.values()];
  if (!campaignId) return { recipients, sentEmails: new Set() };

  const sendsCollection = await getEmailCampaignSendsCollection();
  const rows = await sendsCollection
    .find({ campaignId, email: { $in: recipients.map((recipient) => normalizeEmail(recipient.contact?.email)) }, status: "sent" })
    .project({ email: 1 })
    .toArray();

  return { recipients, sentEmails: new Set(rows.map((row) => normalizeEmail(row.email))) };
}

async function previewRecipients(request, response) {
  const campaignId = getQueryValue(request, "campaignId");
  const { recipients, sentEmails } = await loadRecipients(campaignId);
  const eligible = recipients.filter((lead) => !sentEmails.has(normalizeEmail(lead.contact?.email)));
  sendJson(response, 200, {
    ok: true,
    totalRows: recipients.length,
    recipients: recipients.length,
    alreadySent: sentEmails.size,
    eligible: eligible.length,
    preview: eligible.slice(0, 15).map((lead) => serializeRecipient(lead, sentEmails)),
  });
}

async function listContacts(request, response) {
  const campaignId = getQueryValue(request, "campaignId");
  const { recipients, sentEmails } = await loadRecipients(campaignId);
  sendJson(response, 200, {
    ok: true,
    total: recipients.length,
    eligible: recipients.length - sentEmails.size,
    alreadySent: sentEmails.size,
    contacts: recipients.map((lead) => serializeRecipient(lead, sentEmails)),
  });
}

async function listTemplates(response) {
  const collection = await getEmailTemplatesCollection();
  const templates = await collection.find().sort({ updatedAt: -1 }).limit(200).toArray();
  sendJson(response, 200, { ok: true, templates: templates.map(serializeTemplate) });
}

async function saveTemplate(request, response, user) {
  const collection = await getEmailTemplatesCollection();
  const payload = validateTemplate(request.body || {});
  const now = new Date();
  const templateId = getText(request.body?.templateId, 80);

  if (templateId) {
    if (!ObjectId.isValid(templateId)) throw new ApiError(400, "Plantilla inválida.");
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(templateId) },
      { $set: { ...payload, updatedAt: now, updatedBy: user.email } },
      { returnDocument: "after" },
    );
    const template = result.value || result;
    if (!template) throw new ApiError(404, "Plantilla no encontrada.");
    sendJson(response, 200, { ok: true, template: serializeTemplate(template) });
    return;
  }

  const result = await collection.insertOne({ ...payload, createdAt: now, updatedAt: now, createdBy: user.email, updatedBy: user.email });
  const template = await collection.findOne({ _id: result.insertedId });
  sendJson(response, 201, { ok: true, template: serializeTemplate(template) });
}

async function deleteTemplate(request, response) {
  const templateId = getText(request.body?.templateId, 80);
  if (!ObjectId.isValid(templateId)) throw new ApiError(400, "Plantilla inválida.");
  const collection = await getEmailTemplatesCollection();
  const result = await collection.deleteOne({ _id: new ObjectId(templateId) });
  if (!result.deletedCount) throw new ApiError(404, "Plantilla no encontrada.");
  sendJson(response, 200, { ok: true, deleted: true, templateId });
}

async function listCampaigns(response) {
  const collection = await getEmailCampaignSendsCollection();
  const campaigns = await collection.aggregate([
    {
      $group: {
        _id: "$campaignId",
        subject: { $last: "$subject" },
        total: { $sum: 1 },
        sent: { $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] } },
        firstSentAt: { $min: "$sentAt" },
        lastSentAt: { $max: "$sentAt" },
      },
    },
    { $sort: { lastSentAt: -1 } },
    { $limit: 100 },
  ]).toArray();

  sendJson(response, 200, {
    ok: true,
    campaigns: campaigns.map((campaign) => ({
      campaignId: campaign._id,
      subject: campaign.subject || "",
      total: campaign.total,
      sent: campaign.sent,
      failed: campaign.failed,
      firstSentAt: serializeDate(campaign.firstSentAt),
      lastSentAt: serializeDate(campaign.lastSentAt),
    })),
  });
}

async function campaignDetail(request, response) {
  const campaignId = getQueryValue(request, "campaignId");
  if (!campaignId) throw new ApiError(400, "Falta campaignId.");
  const collection = await getEmailCampaignSendsCollection();
  const rows = await collection
    .find({ campaignId })
    .sort({ sentAt: -1, updatedAt: -1 })
    .limit(400)
    .toArray();
  const summary = rows.reduce((acc, row) => {
    acc.total += 1;
    if (row.status === "sent") acc.sent += 1;
    if (row.status === "failed") acc.failed += 1;
    return acc;
  }, { total: 0, sent: 0, failed: 0 });

  sendJson(response, 200, {
    ok: true,
    campaign: {
      campaignId,
      ...summary,
      recipients: rows.map((row) => ({
        email: row.email,
        name: row.name || "",
        subject: row.subject || "",
        status: row.status || "pending",
        error: row.error || "",
        sentAt: serializeDate(row.sentAt),
        updatedAt: serializeDate(row.updatedAt),
      })),
    },
  });
}

async function sendCampaign(request, response, user) {
  const campaign = validateCampaign(request.body || {});
  const { recipients, sentEmails } = await loadRecipients(campaign.campaignId);
  const eligible = recipients
    .filter((lead) => !sentEmails.has(normalizeEmail(lead.contact?.email)))
    .slice(0, MAX_SENDS_PER_REQUEST);

  const transporter = createTransporter();
  const emailConfig = getEmailConfig();
  const sendsCollection = await getEmailCampaignSendsCollection();
  const publicUrl = getPublicUrl(request);
  const concurrency = Math.max(1, Math.min(Number(process.env.EMAILMKT_CONCURRENCY || 3), 5));
  const result = {
    campaignId: campaign.campaignId,
    recipients: recipients.length,
    eligible: eligible.length,
    alreadySent: sentEmails.size,
    sent: 0,
    failed: [],
  };

  for (let index = 0; index < eligible.length; index += concurrency) {
    const batch = eligible.slice(index, index + concurrency);
    await Promise.all(batch.map(async (lead) => {
      const recipient = serializeRecipient(lead, sentEmails);
      const now = new Date();
      try {
        await transporter.sendMail({
          from: emailConfig.from,
          to: recipient.email,
          subject: campaign.subject,
          html: buildEmailHtml({ campaign, publicUrl, recipient }),
        });
        await sendsCollection.updateOne(
          { campaignId: campaign.campaignId, email: recipient.email },
          {
            $set: {
              leadId: lead._id,
              name: recipient.name,
              service: recipient.service,
              subject: campaign.subject,
              status: "sent",
              error: "",
              sentAt: now,
              updatedAt: now,
              by: user.email,
            },
          },
          { upsert: true },
        );
        result.sent += 1;
      } catch (error) {
        await sendsCollection.updateOne(
          { campaignId: campaign.campaignId, email: recipient.email },
          {
            $set: {
              leadId: lead._id,
              name: recipient.name,
              service: recipient.service,
              subject: campaign.subject,
              status: "failed",
              error: error.message,
              updatedAt: now,
              by: user.email,
            },
          },
          { upsert: true },
        ).catch(() => {});
        result.failed.push({ email: recipient.email, message: error.message });
      }
    }));
  }

  sendJson(response, 200, { ok: true, ...result });
}

async function handleGet(request, response) {
  const action = getQueryValue(request, "action", "recipients");
  if (action === "recipients") return previewRecipients(request, response);
  if (action === "contacts") return listContacts(request, response);
  if (action === "templates") return listTemplates(response);
  if (action === "campaigns") return listCampaigns(response);
  if (action === "campaign-detail") return campaignDetail(request, response);
  throw new ApiError(404, "Acción no encontrada.");
}

async function handlePost(request, response, user) {
  const action = getQueryValue(request, "action");
  if (action === "templates") return saveTemplate(request, response, user);
  if (action === "delete-template") return deleteTemplate(request, response);
  if (action === "send") return sendCampaign(request, response, user);
  throw new ApiError(404, "Acción no encontrada.");
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (handleOptions(request, response)) return;

  try {
    const user = requireAdmin(request);

    if (request.method === "GET") {
      await handleGet(request, response);
      return;
    }

    if (request.method === "POST") {
      requireAdminCsrf(request, user);
      await handlePost(request, response, user);
      return;
    }

    response.setHeader("Allow", "GET, POST, OPTIONS");
    sendJson(response, 405, { ok: false, error: "Método no permitido." });
  } catch (error) {
    handleError(response, error);
  }
}
