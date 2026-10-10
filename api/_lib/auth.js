import crypto from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import { ApiError, getText } from "./http.js";

const COOKIE_NAME = process.env.NODE_ENV === "production"
  ? "__Host-labs_admin_session"
  : "labs_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const OWNER_EMAIL = "jcanepa.web@gmail.com";

function base64Url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(value) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new ApiError(500, "Falta configurar ADMIN_SESSION_SECRET.");
  if (secret.length < 32) throw new ApiError(500, "ADMIN_SESSION_SECRET debe tener al menos 32 caracteres.");

  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((cookies, item) => {
    const [rawName, ...rawValue] = item.trim().split("=");
    if (!rawName) return cookies;
    return { ...cookies, [rawName]: decodeURIComponent(rawValue.join("=")) };
  }, {});
}

function timingSafeEqualText(left, right) {
  const leftBuffer = Buffer.from(left || "");
  const rightBuffer = Buffer.from(right || "");
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function createCsrfToken() {
  return crypto.randomBytes(32).toString("base64url");
}

function isOwnerEmail(email) {
  return getText(email, 180).toLowerCase() === OWNER_EMAIL;
}

export function createSessionToken(user) {
  const csrf = createCsrfToken();
  const payload = {
    email: OWNER_EMAIL,
    name: user.name,
    picture: user.picture,
    csrf,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const encoded = base64Url(JSON.stringify(payload));
  user.csrf = csrf;
  return `${encoded}.${sign(encoded)}`;
}

export function readSession(request) {
  const cookies = parseCookies(request.headers.cookie || "");
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || signature !== sign(encoded)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return {
      email: getText(payload.email, 180),
      name: getText(payload.name, 180),
      picture: getText(payload.picture, 700),
      csrf: getText(payload.csrf, 120),
    };
  } catch {
    return null;
  }
}

export function requireAdmin(request) {
  const user = readSession(request);
  if (!user || !isOwnerEmail(user.email) || !user.csrf) {
    throw new ApiError(401, "No autorizado.");
  }
  return user;
}

export function requireAdminCsrf(request, user) {
  const token = getText(request.headers["x-admin-csrf"], 160);
  if (!token || !timingSafeEqualText(token, user.csrf)) {
    throw new ApiError(403, "Token de seguridad inválido.");
  }
}

export function setSessionCookie(response, token) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax${secure}`,
  );
}

export function clearSessionCookie(response) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  response.setHeader(
    "Set-Cookie",
    `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure}`,
  );
}

export async function verifyGoogleCredential(credential) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientId) throw new ApiError(500, "Falta configurar GOOGLE_CLIENT_ID.");

  const client = new OAuth2Client(googleClientId);
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: googleClientId,
  });
  const payload = ticket.getPayload();
  const email = getText(payload?.email, 180).toLowerCase();

  if (!payload?.email_verified || !isOwnerEmail(email)) {
    throw new ApiError(403, "Este correo no tiene acceso al panel.");
  }

  return {
    email: OWNER_EMAIL,
    name: getText(payload?.name, 180) || email,
    picture: getText(payload?.picture, 700),
  };
}
