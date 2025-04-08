/**
 * @file
 * API route for updating the server-side verification cookie.
 *
 * Adds or updates a token of a specific type using the user's access token.
 */

import { getServerSession } from "@dbcdk/login-nextjs/server";
import { decodeCookie, encodeCookie } from "@/utils/jwt";
import { parse, serialize } from "cookie";

const ANON_COOKIE_NAME = "next-auth.anon-session";
const AUTH_COOKIE_NAME = "next-auth.session-token";
const COOKIE_NAME = "verification.cookie";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  await getServerSession(req, res);

  const jwtCookie =
    req.cookies[AUTH_COOKIE_NAME] || req.cookies[ANON_COOKIE_NAME];
  const jwtToken = await decodeCookie(jwtCookie);
  const accessToken = jwtToken?.accessToken;

  const cookies = parse(req.headers.cookie || "");
  const encodedJwt = cookies[COOKIE_NAME];
  const session = await decodeCookie(encodedJwt);

  if (!session) {
    return res
      .status(400)
      .json({ error: "Verification object not initialized" });
  }

  const { type } = req.body;

  // nothing to update
  if (!type) {
    return res.status(204).end(); // No Content, nothing to do
  }

  // return error if only type exist
  if (type && !accessToken) {
    return res.status(400).json({
      error: `Cannot update token for type "${type}": accessToken is missing or invalid`,
    });
  }

  // Hvis type OG token er til stede, så opdater tokens
  if (type && accessToken) {
    session.tokens = {
      ...(session.tokens || {}),
      [type]: accessToken,
    };
  }

  const newJwt = await encodeCookie(session);

  const cookie = serialize(COOKIE_NAME, newJwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  res.setHeader("Set-Cookie", cookie);
  res.status(200).json({ success: true });
}
