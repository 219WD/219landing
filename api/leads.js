import { ObjectId } from "mongodb";
import { getLeadsCollection } from "./_lib/mongo.js";
import { ApiError, getOptionalObject, getText, handleError, handleOptions, sendJson } from "./_lib/http.js";

const leadAttempts = new Map();

function getClientIp(request) {
  return getText((request.headers["x-forwarded-for"] || "").split(",")[0], 120)
    || getText(request.socket?.remoteAddress, 120)
    || "unknown";
}

function assertLeadRateLimit(request) {
  const ip = getClientIp(request);
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxAttempts = 25;
  const current = leadAttempts.get(ip) || [];
  const fresh = current.filter((timestamp) => now - timestamp < windowMs);

  if (fresh.length >= maxAttempts) {
    throw new ApiError(429, "Demasiadas solicitudes. Probá de nuevo en unos minutos.");
  }

  fresh.push(now);
  leadAttempts.set(ip, fresh);
}

function normalizePayload(body) {
  const contact = getOptionalObject(body.contact);
  const service = getOptionalObject(body.service);
  const source = getOptionalObject(body.source);
  const privacy = getOptionalObject(body.privacy);

  return {
    contact: {
      name: getText(contact.name, 120),
      whatsapp: getText(contact.whatsapp, 80),
      email: getText(contact.email, 180),
    },
    service: {
      key: getText(service.key, 80),
      label: getText(service.label, 160),
      need: getText(service.need, 240),
      detail: getText(service.detail, 3000),
      secondaryLabel: getText(service.secondaryLabel, 160),
      secondary: getText(service.secondary, 1200),
    },
    source: {
      origin: getText(source.origin, 240),
      serviceParam: getText(source.serviceParam, 120) || null,
      path: getText(source.path, 300),
      href: getText(source.href, 700),
      referrer: getText(source.referrer, 700) || null,
      utm: normalizeStringRecord(source.utm, 12, 180),
    },
    privacy: {
      consentAccepted: Boolean(privacy.consentAccepted),
      noticeVersion: getText(privacy.noticeVersion, 120),
    },
  };
}

function normalizeStringRecord(value, maxKeys = 12, maxLength = 180) {
  const object = getOptionalObject(value);
  return Object.entries(object).slice(0, maxKeys).reduce((record, [key, item]) => ({
    ...record,
    [getText(key, 80)]: getText(item, maxLength),
  }), {});
}

function validateLead(lead) {
  if (lead.contact.name.length < 2) return "Falta el nombre.";
  if (lead.contact.whatsapp.replace(/\D/g, "").length < 8) return "Falta un WhatsApp válido.";
  if (!lead.privacy.consentAccepted) return "Necesitamos tu autorización para guardar la consulta.";
  if (!lead.service.key || !lead.service.label || !lead.service.need || !lead.service.detail) {
    return "Faltan datos de la consulta.";
  }
  return "";
}

async function createLead(request, response) {
  assertLeadRateLimit(request);
  const payload = normalizePayload(request.body || {});
  const validationError = validateLead(payload);

  if (validationError) {
    sendJson(response, 400, { ok: false, error: validationError });
    return;
  }

  const now = new Date();
  const collection = await getLeadsCollection();
  const result = await collection.insertOne({
    ...payload,
    status: "form_submitted",
    statusHistory: [
      {
        status: "form_submitted",
        at: now,
      },
    ],
    createdAt: now,
    updatedAt: now,
  });

  sendJson(response, 201, {
    ok: true,
    leadId: result.insertedId.toString(),
    status: "form_submitted",
  });
}

async function markWhatsappOpened(request, response) {
  const leadId = getText(request.body?.leadId, 80);
  const status = getText(request.body?.status, 80);

  if (!ObjectId.isValid(leadId) || status !== "whatsapp_opened") {
    throw new ApiError(400, "Datos de estado inválidos.");
  }

  const now = new Date();
  const collection = await getLeadsCollection();
  const result = await collection.updateOne(
    { _id: new ObjectId(leadId) },
    {
      $set: {
        status: "whatsapp_opened",
        updatedAt: now,
      },
      $push: {
        statusHistory: {
          status: "whatsapp_opened",
          at: now,
        },
      },
    },
  );

  if (!result.matchedCount) {
    throw new ApiError(404, "No encontramos esa consulta.");
  }

  sendJson(response, 200, { ok: true, leadId, status: "whatsapp_opened" });
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (handleOptions(request, response)) return;

  try {
    if (request.method === "POST") {
      await createLead(request, response);
      return;
    }

    if (request.method === "PATCH") {
      await markWhatsappOpened(request, response);
      return;
    }

    response.setHeader("Allow", "POST, PATCH, OPTIONS");
    sendJson(response, 405, { ok: false, error: "Método no permitido." });
  } catch (error) {
    handleError(response, error);
  }
}
