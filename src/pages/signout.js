import { decodeCookie } from "@/utils/jwt";

const AUTH_COOKIE_NAME = "next-auth.session-token";
const LOGIN_PATH = process.env.LOGIN_PATH || "https://login.bib.dk";

export async function getServerSideProps({ req, query }) {
  const cookies = req.cookies || {};
  let redirectUri = query.redirect_uri || "/";

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
