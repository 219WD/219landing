import { requireAdmin } from "../_lib/auth.js";
import { handleError, handleOptions, sendJson } from "../_lib/http.js";

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  if (handleOptions(request, response)) return;

  try {
    if (request.method !== "GET") {
      response.setHeader("Allow", "GET, OPTIONS");
      sendJson(response, 405, { ok: false, error: "Método no permitido." });
      return;
    }

    const user = requireAdmin(request);
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
    handleError(response, error);
  }
}
