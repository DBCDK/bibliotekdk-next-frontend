import { parse } from "cookie";
import { decodeCookie } from "@/utils/jwt";

const COOKIE_NAME = "verification.cookie";

export default async function handler(req, res) {
  const cookies = parse(req.headers.cookie || "");
  const token = cookies[COOKIE_NAME];
  const payload = token ? await decodeCookie(token) : null;

  console.log("server read => payload", payload);

  if (!payload) {
    return res.status(200).json({ data: null });
  }

  const tokens = payload.tokens || {};

  // Byg nyt tokens-objekt med booleans
  const tokenFlags = {
    FFU: Boolean(tokens.FFU),
    FOLK: Boolean(tokens.FOLK),
  };

  res.status(200).json({
    data: {
      tokens: tokenFlags,
      ts: payload.ts,
      expires: payload.expires,
      origin: payload.origin || null,
    },
  });
}
