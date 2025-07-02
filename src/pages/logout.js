import { decodeCookie } from "@/utils/jwt";

const AUTH_COOKIE_NAME = "next-auth.session-token";
const LOGIN_PATH = process.env.LOGIN_PATH || "https://login.bib.dk";
const APP_ORIGIN = process.env.APP_ORIGIN || "http://localhost:3000"; // ← skift til din prod-url i prod.env

export async function getServerSideProps({ req, query }) {
  const cookies = req.cookies || {};
  let redirectUri = query.redirect_uri || "/";

  // 2.🔐 Tjek at redirectUri peger på dit eget domæne
  try {
    const parsed = new URL(redirectUri, APP_ORIGIN); // sikre absolut URL
    if (!parsed.origin.startsWith(APP_ORIGIN)) {
      console.warn("⚠️ [Logout] Unsafe redirect URI, using default");
      redirectUri = `${APP_ORIGIN}/login`;
    }
  } catch (e) {
    console.warn("⚠️ [Logout] Malformed redirect URI, using default");
    redirectUri = `${APP_ORIGIN}/login`;
  }

  // 1.❌ Drop fallback til anonym-session
  const jwtCookie = cookies[AUTH_COOKIE_NAME];

  if (!jwtCookie) {
    console.warn("⚠️ [Logout] No auth cookie found");
    return {
      redirect: { destination: redirectUri, permanent: false },
    };
  }

  let jwt;
  try {
    jwt = await decodeCookie(jwtCookie);
  } catch (err) {
    console.error("❌ [Logout] Failed to decode JWT", err);
    return {
      redirect: { destination: redirectUri, permanent: false },
    };
  }

  const accessToken = jwt?.accessToken;
  if (!accessToken) {
    console.warn("⚠️ [Logout] No accessToken in JWT");
    return {
      redirect: { destination: redirectUri, permanent: false },
    };
  }

  const logoutUrl = `${LOGIN_PATH}/logout?access_token=${encodeURIComponent(
    accessToken
  )}&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return {
    redirect: {
      destination: logoutUrl,
      permanent: false,
    },
  };
}

export default function Logout() {
  return null; // sker aldrig – redirect i SSR
}
