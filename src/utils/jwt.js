/**
 * @file
 * Utility functions for encoding and decoding JWT-based cookies.
 *
 * Wraps NextAuth's encode/decode with shared secret handling and safe fallback.
 */
import { encode, decode } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function encodeCookie(payload) {
  return await encode({ token: payload, secret });
}

export async function decodeCookie(token) {
  if (!token) return null;
  try {
    return await decode({ token, secret });
  } catch {
    return null;
  }
}
