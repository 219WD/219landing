import { ObjectId } from "mongodb";
import { requireAdmin, requireAdminCsrf } from "../_lib/auth.js";
import { getLeadsCollection } from "../_lib/mongo.js";
import { ApiError, getQueryValue, getText, handleError, handleOptions, sendJson } from "../_lib/http.js";

const ADMIN_STATUSES = new Set([
  "form_submitted",
  "whatsapp_opened",
  "contact_confirmed",
  "contacted",
  "qualified",
]);

function serializeLead(lead) {
  return {
    ...lead,
    _id: lead._id.toString(),
    createdAt: lead.createdAt?.toISOString?.() || lead.createdAt,
    updatedAt: lead.updatedAt?.toISOString?.() || lead.updatedAt,
    statusHistory: (lead.statusHistory || []).map((item) => ({
      ...item,
      at: item.at?.toISOString?.() || item.at,
    })),
    adminNotes: (lead.adminNotes || []).map((item) => ({
      ...item,
      at: item.at?.toISOString?.() || item.at,
    })),
  };
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function listLeads(request, response) {
  const collection = await getLeadsCollection();
  const status = getQueryValue(request, "status");
  const service = getQueryValue(request, "service");
  const search = getQueryValue(request, "search");
  const limit = Math.min(Number(getQueryValue(request, "limit", "60")) || 60, 150);
  const query = {};

  if (status && status !== "all") query.status = status;
  if (service && service !== "all") query["service.key"] = service;
  if (search) {
    const safeSearch = escapeRegExp(search.slice(0, 80));
    query.$or = [
      { "contact.name": { $regex: safeSearch, $options: "i" } },
      { "contact.whatsapp": { $regex: safeSearch, $options: "i" } },
      { "contact.email": { $regex: safeSearch, $options: "i" } },
      { "service.label": { $regex: safeSearch, $options: "i" } },
      { "service.need": { $regex: safeSearch, $options: "i" } },
      { "service.detail": { $regex: safeSearch, $options: "i" } },
    ];
  }

  const leads = await collection.find(query).sort({ createdAt: -1 }).limit(limit).toArray();
  sendJson(response, 200, { ok: true, leads: leads.map(serializeLead) });
}

async function updateLead(request, response, user) {
  const collection = await getLeadsCollection();
  const leadId = getText(request.body?.leadId, 80);
  const status = getText(request.body?.status, 80);
  const note = getText(request.body?.note, 1200);

  if (!ObjectId.isValid(leadId)) throw new ApiError(400, "Lead inválido.");
  if (status && !ADMIN_STATUSES.has(status)) throw new ApiError(400, "Estado inválido.");
  if (!status && !note) throw new ApiError(400, "No hay cambios para guardar.");

  const now = new Date();
  const update = {
    $set: { updatedAt: now },
    $push: {},
  };

  if (status) {
    update.$set.status = status;
    update.$push.statusHistory = {
      status,
      at: now,
      by: user.email,
    };
  }

  if (note) {
    update.$push.adminNotes = {
      note,
      at: now,
      by: user.email,
    };
  }

  if (!Object.keys(update.$push).length) delete update.$push;

  const result = await collection.updateOne({ _id: new ObjectId(leadId) }, update);
  if (!result.matchedCount) throw new ApiError(404, "No encontramos ese lead.");

  const lead = await collection.findOne({ _id: new ObjectId(leadId) });
  sendJson(response, 200, { ok: true, lead: serializeLead(lead) });
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (handleOptions(request, response)) return;

  try {
    const user = requireAdmin(request);

    if (request.method === "GET") {
      await listLeads(request, response);
      return;
    }

    if (request.method === "PATCH") {
      requireAdminCsrf(request, user);
      await updateLead(request, response, user);
      return;
    }

    response.setHeader("Allow", "GET, PATCH, OPTIONS");
    sendJson(response, 405, { ok: false, error: "Método no permitido." });
  } catch (error) {
    handleError(response, error);
  }
}
