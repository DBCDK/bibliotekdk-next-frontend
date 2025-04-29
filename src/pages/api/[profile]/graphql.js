/**
 * @file
 * API route for proxying GraphQL requests to the FBI API.
 *
 * Adds access tokens server-side, injects verification tokens for specific mutations,
 * and sanitizes incoming headers. Prevents caching to ensure fresh responses.
 */

import { getServerSession } from "@dbcdk/login-nextjs/server";
import { decodeCookie } from "@/utils/jwt";

const fbiApiUrl = new URL(process.env.NEXT_PUBLIC_FBI_API_URL).origin;

const ANON_COOKIE_NAME = "next-auth.anon-session";
const AUTH_COOKIE_NAME = "next-auth.session-token";
const VERIFICATION_COOKIE_NAME = "verification.cookie";

/**
 * Filters incoming request headers and retains only a safe subset.
 * Includes authorization and selected custom tracking headers,
 * and removes potentially problematic ones like Host, Content-Length, etc.
 *
 * @param {object} originalHeaders - The original incoming headers from the request
 * @param {string} accessToken - The bearer token to authorize the external API call
 * @returns {object} A sanitized set of headers
 */
export function sanitizeHeaders(originalHeaders, accessToken) {
  const allowedCustomHeaders = [
    "x-debug",
    "x-tracking-consent",
    "x-session-token",
    "x-unique-visitor-id",
    "x-caused-by",
    "User-Agent",
    "x-forwarded-host",
    "x-forwarded-port",
    "x-forwarded-proto",
    "x-forwarded-for",
  ];

  const safeHeaders = {
    Authorization: `bearer ${accessToken}`,
    "Content-Type": "application/json",
    Accept: "*/*",
  };

  for (const [key, value] of Object.entries(originalHeaders)) {
    const keyLower = key.toLowerCase();

    if (keyLower.startsWith("x-") && !allowedCustomHeaders.includes(keyLower)) {
      console.warn(`⚠️ Skipping unapproved custom header: ${key}: ${value}`);
    }

    if (allowedCustomHeaders.includes(keyLower)) {
      safeHeaders[keyLower] = value;
    }
  }

  return safeHeaders;
}

/**
 * Extracts the user's access token from the available session cookie.
 * Falls back to generating a new session if no valid JWT is present.
 *
 * @param {object} req - The incoming request object
 * @param {object} res - The server response object
 * @returns {Promise<string|null>} The extracted access token, or null if unavailable
 */
async function getAccessToken(req, res) {
  let jwtCookie =
    req.cookies[AUTH_COOKIE_NAME] || req.cookies[ANON_COOKIE_NAME];
  let jwtToken = await decodeCookie(jwtCookie);

  if (!jwtToken) {
    jwtCookie = await getNewCookie(req, res);
    jwtToken = await decodeCookie(jwtCookie);
  }

  return jwtToken?.accessToken || null;
}

/**
 * Initiates a new server session and extracts a fresh anon-session cookie.
 *
 * @param {object} req - The incoming request
 * @param {object} res - The server response object
 * @returns {Promise<string|null>} The raw cookie string, or null
 */
async function getNewCookie(req, res) {
  await getServerSession(req, res);
  return res
    .getHeader("Set-Cookie")
    ?.find((cookie) => cookie.startsWith(ANON_COOKIE_NAME))
    ?.split(";")?.[0]
    ?.split("=")?.[1];
}

/**
 * Injects server-stored verification tokens into the request body
 * if the current mutation matches the expected CulrCreateAccount mutation.
 *
 * @param {object} body - The cloned request body object
 * @param {object} cookies - Parsed cookies from the request
 * @returns {Promise<object|undefined>} The updated request body or original if no tokens applied
 */
async function injectVerificationTokens(body, cookies) {
  const inputTokens = body?.variables?.input?.tokens;
  if (!inputTokens) return;

  const verificationJwt = cookies[VERIFICATION_COOKIE_NAME];
  if (!verificationJwt) return;

  const verificationData = await decodeCookie(verificationJwt);
  if (!verificationData?.tokens) return;

  const updatedTokens = {};
  for (const key of Object.keys(inputTokens)) {
    if (inputTokens[key] && verificationData.tokens[key]) {
      updatedTokens[key] = verificationData.tokens[key];
    }
  }

  body.variables.input.tokens = updatedTokens;
  return body;
}

/**
 * API Route handler for proxying GraphQL requests to FBI API.
 * Automatically injects access tokens, sanitizes headers,
 * and optionally replaces token payloads for selected mutations.
 *
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await getServerSession(req, res);

  const accessToken = await getAccessToken(req, res);
  const profile = req.query.profile;

  // Sæt headers der slår caching fra
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  const shouldInject = req.body?.query?.startsWith(
    "mutation CulrCreateAccount"
  );

  let body = req.body;
  if (shouldInject) {
    body = await injectVerificationTokens(
      structuredClone(req.body),
      req.cookies
    );
  }

  const headers = sanitizeHeaders(req.headers, accessToken);

  const graphqlRes = await fetch(`${fbiApiUrl}/${profile}/graphql`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const json = await graphqlRes.json();
  res.status(graphqlRes.status).json(json);
}
