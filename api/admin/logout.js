import { clearSessionCookie, requireAdmin, requireAdminCsrf } from "../_lib/auth.js";
import { handleError, handleOptions, sendJson } from "../_lib/http.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (handleOptions(request, response)) return;

  try {
    if (request.method !== "POST") {
      response.setHeader("Allow", "POST, OPTIONS");
      sendJson(response, 405, { ok: false, error: "Método no permitido." });
      return;
    }

    const user = requireAdmin(request);
    requireAdminCsrf(request, user);
    clearSessionCookie(response);
    sendJson(response, 200, { ok: true });
  } catch (error) {
    handleError(response, error);
  }
}
