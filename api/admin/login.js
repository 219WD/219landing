import { createSessionToken, setSessionCookie, verifyGoogleCredential } from "../_lib/auth.js";
import { getText, handleError, handleOptions, sendJson } from "../_lib/http.js";

const loginAttempts = new Map();

function getClientIp(request) {
  return getText((request.headers["x-forwarded-for"] || "").split(",")[0], 120)
    || getText(request.socket?.remoteAddress, 120)
    || "unknown";
}

function assertLoginRateLimit(request) {
  const ip = getClientIp(request);
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const maxAttempts = 10;
  const current = loginAttempts.get(ip) || [];
  const fresh = current.filter((timestamp) => now - timestamp < windowMs);

  if (fresh.length >= maxAttempts) {
    const error = new Error("Demasiados intentos de acceso. Probá de nuevo en unos minutos.");
    error.statusCode = 429;
    throw error;
  }

  fresh.push(now);
  loginAttempts.set(ip, fresh);
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (handleOptions(request, response)) return;

  try {
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST, OPTIONS");
      sendJson(response, 405, { ok: false, error: "Método no permitido." });
      return;
    }

    assertLoginRateLimit(request);
    const credential = getText(request.body?.credential, 5000);
    const user = await verifyGoogleCredential(credential);
    const token = createSessionToken(user);
    setSessionCookie(response, token);
    sendJson(response, 200, {
      ok: true,
      user: {
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      csrf: user.csrf,
    });
  } catch (error) {
    if (error.statusCode === 429) {
      sendJson(response, 429, { ok: false, error: error.message });
      return;
    }
    handleError(response, error);
  }
}
