export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function sendJson(response, statusCode, payload) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "same-origin");
  response.status(statusCode).json(payload);
}

export function getText(value, maxLength = 1200) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function getOptionalObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

export function getQueryValue(request, key, fallback = "") {
  const url = new URL(request.url || "/", "https://219labs.local");
  return getText(url.searchParams.get(key) || fallback, 240);
}

export function handleOptions(request, response) {
  if (request.method !== "OPTIONS") return false;
  response.status(204).end();
  return true;
}

export function handleError(response, error) {
  console.error(error);

  if (error instanceof ApiError) {
    sendJson(response, error.statusCode, { ok: false, error: error.message });
    return;
  }

  if (Number.isInteger(error.statusCode)) {
    sendJson(response, error.statusCode, { ok: false, error: error.message || "Error de solicitud." });
    return;
  }

  const missingConfig = error.message?.includes("MONGODB_URI");
  const mongoUnavailable = [
    "MongoServerSelectionError",
    "MongoNetworkError",
    "MongoNetworkTimeoutError",
  ].includes(error.name) || /ETIMEOUT|ENOTFOUND|ECONNREFUSED|querySrv|server selection/i.test(error.message || "");

  sendJson(response, missingConfig || mongoUnavailable ? 503 : 500, {
    ok: false,
    error: missingConfig
      ? "Todavía falta configurar el guardado de consultas."
      : mongoUnavailable
        ? "La base de datos tardó demasiado en responder. Podés reintentar o seguir por WhatsApp."
        : "No pudimos completar la operación en este momento.",
  });
}
