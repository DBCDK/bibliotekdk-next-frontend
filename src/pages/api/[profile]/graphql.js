import { getServerSession } from "@dbcdk/login-nextjs/server";
import { decodeCookie } from "@/utils/jwt";

const fbiApiUrl = new URL(process.env.NEXT_PUBLIC_FBI_API_URL).origin;

const ANON_COOKIE_NAME = "next-auth.anon-session";
const AUTH_COOKIE_NAME = "next-auth.session-token";
const VERIFICATION_COOKIE_NAME = "verification.cookie";

/**
 * Helpers
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

async function getNewCookie(req, res) {
  await getServerSession(req, res);
  return res
    .getHeader("Set-Cookie")
    ?.find((cookie) => cookie.startsWith(ANON_COOKIE_NAME))
    ?.split(";")?.[0]
    ?.split("=")?.[1];
}

async function injectVerificationTokens(req) {
  //  tjek for tokens in request to be replaced
  const inputTokens = req.body?.variables?.input?.tokens;

  if (!inputTokens) return;

  const verificationJwt = req.cookies[VERIFICATION_COOKIE_NAME];
  if (!verificationJwt) {
    console.warn(
      `CulrCreateAccount: No ${VERIFICATION_COOKIE_NAME} cookie was found`
    );
    return;
  }

  const verificationData = await decodeVerification(verificationJwt);
  if (!verificationData?.tokens) {
    console.warn("CulrCreateAccount: No tokens in verificationData");
    return;
  }

  const updatedTokens = {};
  for (const key of Object.keys(inputTokens)) {
    if (inputTokens[key] && verificationData.tokens[key]) {
      updatedTokens[key] = verificationData.tokens[key];
    }
  }

  // Update arguments with collected serverside tokens
  req.body.variables.input.tokens = updatedTokens;

  console.log("🔐 Injected verification tokens:", Object.keys(updatedTokens));
}

/**
 * Main handler
 */

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await getServerSession(req, res);

  const accessToken = await getAccessToken(req, res);
  const profile = req.query.profile;

  const isCreateAccount = req.body?.query?.includes(
    "mutation CulrCreateAccount"
  );

  // Check if a specific CULR mutation call should be injected with collected serverside tokens
  if (isCreateAccount) {
    await injectVerificationTokens(req);
  }

  const graphqlRes = await fetch(`${fbiApiUrl}/${profile}/graphql`, {
    method: "POST",
    headers: {
      ...req.headers,
      Authorization: `bearer ${accessToken}`,
    },
    body: JSON.stringify(req.body),
  });

  const json = await graphqlRes.json();
  res.status(graphqlRes.status).json(json);
}
