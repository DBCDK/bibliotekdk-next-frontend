import { getServerSession } from "@dbcdk/login-nextjs/server";
import { decode } from "next-auth/jwt";

const fbiApiUrl = new URL(process.env.NEXT_PUBLIC_FBI_API_URL).origin;
const secret = process.env.NEXTAUTH_SECRET;

const ANON_COOKIE_NAME = "next-auth.anon-session";
const AUTH_COOKIE_NAME = "next-auth.session-token";

async function getNewCookie(req, res) {
  await getServerSession(req, res);
  return res
    .getHeader("Set-Cookie")
    ?.find((cookie) => cookie.startsWith(ANON_COOKIE_NAME))
    ?.split(";")?.[0]
    ?.split("=")?.[1];
}

async function decodeCookie(jwtCookie) {
  if (!jwtCookie) {
    return null;
  }
  try {
    return await decode({
      token: jwtCookie,
      secret,
    });
  } catch {
    return null;
  }
}
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  getServerSession(req, res);
  const profile = req.query.profile;
  let jwtCookie =
    req.cookies[AUTH_COOKIE_NAME] || req.cookies[ANON_COOKIE_NAME];

  let jwtToken = await decodeCookie(jwtCookie);

  if (!jwtToken) {
    // No cookie set, or cookie is old
    jwtCookie = await getNewCookie(req, res);
    jwtToken = await decodeCookie(jwtCookie);
  }

  const accessToken = jwtToken?.accessToken;

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
