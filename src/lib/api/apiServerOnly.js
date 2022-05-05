import nookies from "nookies";
import getConfig from "next/config";
import fetchTranslations from "@/lib/api/backend";
import { COOKIES_ALLOWED } from "@/components/cookiebox";
import { getSession } from "next-auth/client";
import { generateKey, fetcher } from "@/lib/api/api";
import fetch from "isomorphic-unfetch";

const APP_URL =
  getConfig()?.publicRuntimeConfig?.app?.url || "http://localhost:3000";

/**
 * Initializes session and fetches stuff from API
 * Required for SSR
 * @param {*} queries
 * @param {*} context
 * @returns
 */
export async function fetchAll(queries, context, customQueryVariables) {
  // If we are in a browser, we return immidiately
  // This prevents a roundtrip to the server
  // and will make page changes feel faster
  if (typeof window !== "undefined") {
    return { initialState: {} };
  }

  // Detect if requester is a bot
  const userAgent = context.req.headers["user-agent"];
  const isBot = require("isbot")(userAgent) || !!context.query.isBot;

  // user session
  let anonSession;
  let session = await getSession(context);
  if (!session?.accessToken) {
    anonSession = await getAnonSession(context);
  }

  // Fetch all queries in parallel
  const initialData = {};

  // If user is a bot, we care about SSR, and fetch data now
  // Otherwise, we show the page as fast as we can with skeleton elements
  if (isBot) {
    (
      await Promise.all(
        queries.map(async (queryFunc) => {
          const queryKey = generateKey({
            ...queryFunc({ ...context.query, ...customQueryVariables }),
            accessToken: session?.accessToken || anonSession?.accessToken,
          });
          const queryRes = await fetcher(queryKey, userAgent);
          return { queryKey, queryRes };
        })
      )
    ).forEach(({ queryKey, queryRes }) => {
      initialData[queryKey] = queryRes;
    });
  }

  return {
    initialData,
    allowCookies: !!nookies.get(context)[COOKIES_ALLOWED],
    session,
    anonSession,
  };
}

export async function getAnonSession(context) {
  // anonymous session
  let anonSession;
  const ANONYMOUS_SESSION = "anon.session";
  const jwt = nookies.get(context, { path: "/" })[ANONYMOUS_SESSION];
  const anonSessionRes = await fetch(
    `${APP_URL}/api/auth/anonsession?jwt=${jwt}`,
    {
      headers: context.req.headers,
    }
  );
  const res = await anonSessionRes.json();
  anonSession = res.session;
  if (jwt !== res.jwt) {
    nookies.set(context, ANONYMOUS_SESSION, res.jwt, {
      path: "/",
      httpOnly: true,
    });
  }

  return anonSession;
}
