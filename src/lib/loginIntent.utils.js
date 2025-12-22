// src/lib/loginIntent.js
import { encodeCookie, decodeCookie } from "@/utils/jwt";

export const LOGIN_INTENT_COOKIE = "login.intent";
const MAX_AGE_SEC = 10 * 60;

export async function encodeIntent(intent) {
  const nowSec = Math.floor(Date.now() / 1000);
  return await encodeCookie({
    kind: "login-intent",
    ...intent,
    iat: nowSec,
    exp: nowSec + MAX_AGE_SEC,
  });
}

export async function decodeIntent(token) {
  const payload = await decodeCookie(token);
  if (!payload) return null;
  if (payload.kind !== "login-intent") return null;

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < nowSec) return null;

  return payload;
}

export function setIntentCookie(res, jwt) {
  const parts = [
    `${LOGIN_INTENT_COOKIE}=${jwt}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${MAX_AGE_SEC}`,
  ];

  if (process.env.NODE_ENV === "production") parts.push("Secure");

  appendSetCookie(res, parts.join("; "));
}

export function clearIntentCookie(res) {
  const parts = [
    `${LOGIN_INTENT_COOKIE}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];

  if (process.env.NODE_ENV === "production") parts.push("Secure");

  appendSetCookie(res, parts.join("; "));
}

/**
 * Minimal safety check (since host can be many different municipality domains).
 * - Only https
 * - No credentials in URL
 * - No localhost
 * - No direct IPs (v4/v6)
 * - (Optional) Require /work/ path pattern (uncomment if always true)
 */
export function isSafeRedirectUrl(urlStr) {
  let u;
  try {
    u = new URL(urlStr);
  } catch {
    return false;
  }

  if (u.protocol !== "https:") return false;
  if (u.username || u.password) return false;

  const host = u.hostname.toLowerCase();
  if (host === "localhost") return false;

  // Block direct IPs
  const isIPv4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
  const isIPv6 = host.includes(":");
  if (isIPv4 || isIPv6) return false;

  // Optional: enforce a known path pattern (enable if it fits all your redirects)
  // if (!u.pathname.startsWith("/work/")) return false;

  return true;
}

// src/lib/httpCookies.js
export function appendSetCookie(res, cookieStr) {
  const prev = res.getHeader("Set-Cookie");

  if (!prev) {
    res.setHeader("Set-Cookie", cookieStr);
    return;
  }

  // prev kan være string eller array
  const next = Array.isArray(prev) ? [...prev, cookieStr] : [prev, cookieStr];
  res.setHeader("Set-Cookie", next);
}
