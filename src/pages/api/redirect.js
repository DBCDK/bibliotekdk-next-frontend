// src/pages/api/redirect.js
import { getServerSession } from "@dbcdk/login-nextjs/server";
import { decodeCookie } from "@/utils/jwt";
import {
  decodeIntent,
  clearIntentCookie,
  isSafeRedirectUrl,
  LOGIN_INTENT_COOKIE,
} from "@/lib/loginIntent.utils";
import { publizonSampleRedirect } from "@/lib/api/manifestation.fragments";

const PROFILE = "bibdk21";
const AUTH_COOKIE_NAME = "next-auth.session-token";

/**
 * Best-effort: determine our own origin (works behind proxies too)
 */
function getAppOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

function addTypeParam(urlStr, type) {
  if (!type) return urlStr;
  const u = new URL(urlStr);
  u.searchParams.set("type", type);
  return u.toString();
}

async function callProfileGraphql(req, profile, queryObj) {
  const origin = getAppOrigin(req);

  const res = await fetch(`${origin}/api/${profile}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // IMPORTANT: forward cookies so /api/[profile]/graphql can decode next-auth cookies and inject bearer token
      cookie: req.headers.cookie || "",
      "user-agent": req.headers["user-agent"] || "",
      "x-forwarded-for": req.headers["x-forwarded-for"] || "",
    },
    body: JSON.stringify({
      query: queryObj.query,
      variables: queryObj.variables,
    }),
  });

  // If response isn't JSON, this will throw and we’ll fall back to /work/<pid>
  return { status: res.status, json: await res.json() };
}

function fallbackToPid(req, res, pid) {
  // If we have a pid, go to /work/<pid> as requested; otherwise go home
  if (!pid) return res.redirect(302, "/");
  return res.redirect(302, `/work/${encodeURIComponent(pid)}`);
}

export default async function handler(req, res) {
  await getServerSession(req, res);

  // Read intent cookie
  const token = req.cookies?.[LOGIN_INTENT_COOKIE];
  const intent = await decodeIntent(token);

  // No intent -> go home (and clear just in case)
  if (!intent?.pid) {
    clearIntentCookie(res);
    return res.redirect(302, "/");
  }

  const pid = intent.pid;

  // Optional: login-check (if not logged in, we still fallback to /work/<pid> per your rule)
  const jwt = await decodeCookie(req.cookies?.[AUTH_COOKIE_NAME]);
  const isLoggedIn = !!jwt?.attributes?.userId || !!jwt?.attributes?.uniqueId;

  if (!isLoggedIn) {
    return fallbackToPid(req, res, pid);
  }

  try {
    // Build query and call existing proxy
    const queryObj = publizonSampleRedirect({ pid });
    const { status, json } = await callProfileGraphql(req, PROFILE, queryObj);

    // Any non-200 or GraphQL errors => fallback
    if (status !== 200 || json?.errors?.length) {
      clearIntentCookie(res);
      return fallbackToPid(req, res, pid);
    }

    const accessList = json?.data?.manifestation?.access || [];
    const publizon = accessList.find((a) => a?.__typename === "Publizon");
    const agencyUrl = publizon?.agencyUrl;

    const type =
      json?.data?.manifestation?.materialTypes?.[0]?.materialTypeSpecific
        ?.display || null;

    if (!agencyUrl) {
      clearIntentCookie(res);
      return fallbackToPid(req, res, pid);
    }

    const destination = addTypeParam(agencyUrl, type);

    if (!isSafeRedirectUrl(destination)) {
      clearIntentCookie(res);
      return fallbackToPid(req, res, pid);
    }

    // Success: clear intent and redirect to destination
    clearIntentCookie(res);
    return res.redirect(302, destination);
  } catch (e) {
    // Any unexpected failure => fallback to /work/<pid>
    clearIntentCookie(res);
    return fallbackToPid(req, res, pid);
  }
}
