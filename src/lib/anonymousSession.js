/**
 * @file We need a way for anonymous users to have a token for API communication
 * Next-auth doesn't support anonymous sessions, hence we create it here
 */

import nookies, { destroyCookie } from "nookies";
import fetch from "isomorphic-unfetch";
import jwt from "jsonwebtoken";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();
const { clientId, clientSecret, jwtSecret } = serverRuntimeConfig;

// The cookie name
const ANONYMOUS_SESSION = "anon.session";

/**
 * Fetch anonymous token and store in cookie
 * The token is never shared between users, hence
 * we can use it to store session specific data
 *
 * @param {*} context nextjs server-side context
 * @returns
 */
export async function fetchAnonymousSession(context) {
  try {
    // Will throw if cookie is not set or jwt is expired
    const token = nookies.get(context, { path: "/" })[ANONYMOUS_SESSION];
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (e) {
    // Fetch anonymous accesstoken
    const res = await fetch("https://login.bib.dk/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },

      body: `grant_type=password&username=@&password=@&client_id=${encodeURIComponent(
        clientId
      )}&client_secret=${encodeURIComponent(clientSecret)}`,
    });
    const json = await res.json();
    const anonymousSession = {
      accessToken: json.access_token,
    };

    // Create jwt and set expiry to the same time access token expires
    const token = jwt.sign(anonymousSession, jwtSecret, {
      expiresIn: json.expires_in,
    });

    // Set the cookie
    nookies.set(context, ANONYMOUS_SESSION, token, {
      path: "/",
      httpOnly: true,
    });
    return anonymousSession;
  }
}

/**
 * Delete session cookie
 *
 * @param {*} context nextjs server-side context
 * @returns
 */
export async function deleteAnonymousSession(context) {
  destroyCookie(context, ANONYMOUS_SESSION, { path: "/" });
}
