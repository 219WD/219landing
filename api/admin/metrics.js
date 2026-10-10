import { requireAdmin } from "../_lib/auth.js";
import { getLeadsCollection } from "../_lib/mongo.js";
import { handleError, handleOptions, sendJson } from "../_lib/http.js";

function serializeBucket(item) {
  return {
    key: item._id || "Sin dato",
    count: item.count,
  };
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (handleOptions(request, response)) return;

  try {
    requireAdmin(request);

    if (request.method !== "GET") {
      response.setHeader("Allow", "GET, OPTIONS");
      sendJson(response, 405, { ok: false, error: "Método no permitido." });
      return;
    }

    const collection = await getLeadsCollection();
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [
      total,
      last30Days,
      whatsappOpened,
      contacted,
      qualified,
      byStatus,
      byService,
      byDay,
    ] = await Promise.all([
      collection.countDocuments(),
      collection.countDocuments({ createdAt: { $gte: since } }),
      collection.countDocuments({ status: "whatsapp_opened" }),
      collection.countDocuments({ status: { $in: ["contacted", "qualified"] } }),
      collection.countDocuments({ status: "qualified" }),
      collection.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
      collection.aggregate([
        { $group: { _id: "$service.label", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]).toArray(),
      collection.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]).toArray(),
    ]);

    sendJson(response, 200, {
      ok: true,
      metrics: {
        total,
        last30Days,
        whatsappOpened,
        contacted,
        qualified,
        whatsappOpenRate: total ? Math.round((whatsappOpened / total) * 100) : 0,
        qualifiedRate: total ? Math.round((qualified / total) * 100) : 0,
        byStatus: byStatus.map(serializeBucket),
        byService: byService.map(serializeBucket),
        byDay: byDay.map((item) => ({ date: item._id, count: item.count })),
      },
    });
  } catch (error) {
    handleError(response, error);
  }
}
