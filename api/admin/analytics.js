import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { requireAdmin } from "../_lib/auth.js";
import { handleError, handleOptions, sendJson } from "../_lib/http.js";

function getAnalyticsClient() {
  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!process.env.GA_PROPERTY_ID || !clientEmail || !privateKey) {
    const error = new Error("Faltan credenciales de Google Analytics.");
    error.statusCode = 503;
    throw error;
  }

  return new BetaAnalyticsDataClient({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
  });
}

function metricValue(row, index = 0) {
  return Number(row?.metricValues?.[index]?.value || 0);
}

function dimensionValue(row, index = 0) {
  return row?.dimensionValues?.[index]?.value || "Sin dato";
}

function formatGaDate(value) {
  if (!/^\d{8}$/.test(value)) return value;
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

async function runReport(client, body) {
  const [response] = await client.runReport({
    property: `properties/${process.env.GA_PROPERTY_ID}`,
    ...body,
  });
  return response.rows || [];
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

    const client = getAnalyticsClient();
    const dateRanges = [{ startDate: "30daysAgo", endDate: "today" }];
    const conversionMetric = process.env.GA_CONVERSION_METRIC || "keyEvents";

    const [summaryRows, timelineRows, channelRows, pageRows, deviceRows] = await Promise.all([
      runReport(client, {
        dateRanges,
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "engagementRate" },
          { name: conversionMetric },
        ],
      }),
      runReport(client, {
        dateRanges,
        dimensions: [{ name: "date" }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: conversionMetric },
        ],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      runReport(client, {
        dateRanges,
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }, { name: conversionMetric }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 8,
      }),
      runReport(client, {
        dateRanges,
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 8,
      }),
      runReport(client, {
        dateRanges,
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "sessions" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      }),
    ]);

    const summary = summaryRows[0];

    sendJson(response, 200, {
      ok: true,
      analytics: {
        configured: true,
        summary: {
          activeUsers: metricValue(summary, 0),
          sessions: metricValue(summary, 1),
          views: metricValue(summary, 2),
          engagementRate: Math.round(metricValue(summary, 3) * 100),
          conversions: metricValue(summary, 4),
        },
        timeline: timelineRows.map((row) => ({
          date: formatGaDate(dimensionValue(row, 0)),
          activeUsers: metricValue(row, 0),
          sessions: metricValue(row, 1),
          conversions: metricValue(row, 2),
        })),
        channels: channelRows.map((row) => ({
          channel: dimensionValue(row, 0),
          sessions: metricValue(row, 0),
          conversions: metricValue(row, 1),
        })),
        pages: pageRows.map((row) => ({
          path: dimensionValue(row, 0),
          views: metricValue(row, 0),
          users: metricValue(row, 1),
        })),
        devices: deviceRows.map((row) => ({
          device: dimensionValue(row, 0),
          sessions: metricValue(row, 0),
        })),
      },
    });
  } catch (error) {
    handleError(response, error);
  }
}
