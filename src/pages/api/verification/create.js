/**
 * @file
 * API route for creating a server-side verification cookie.
 *
 * Extracts the user's access token and stores it in a signed, HTTP-only cookie
 * for later use during verification (e.g., CulrCreateAccount).
 */

import { getServerSession } from "@dbcdk/login-nextjs/server";
import { decodeCookie, encodeCookie } from "@/utils/jwt";
import { serialize } from "cookie";

const ANON_COOKIE_NAME = "next-auth.anon-session";
const AUTH_COOKIE_NAME = "next-auth.session-token";

const COOKIE_NAME = "verification.cookie";
const TTL = 1000 * 60 * 60; // 1 hour

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await getServerSession(req, res);

  const jwtCookie =
    req.cookies[AUTH_COOKIE_NAME] || req.cookies[ANON_COOKIE_NAME];

  const jwtToken = await decodeCookie(jwtCookie);
  const accessToken = jwtToken?.accessToken;

  const { type, origin } = req.body;

  // return error if only type exist
  if (type && !accessToken) {
    return res.status(400).json({
      error: `Cannot set token for type "${type}": accessToken is missing or invalid`,
    });
  }

  const ts = Date.now();
  const expires = ts + TTL;

  const payload = {
    ts,
    expires,
    ...(origin && { origin }),
    ...(type && accessToken && { tokens: { [type]: accessToken } }),
  };

  const signedJwt = await encodeCookie(payload);

  const cookie = serialize(COOKIE_NAME, signedJwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ success: true });
}
