import nookies from "nookies";
import getConfig from "next/config";
import fetchTranslations from "@/lib/api/backend";
import { COOKIES_ALLOWED } from "@/components/cookiebox";
import { getSession } from "next-auth/client";
import { generateKey, fetcher } from "@/lib/api/api";
import fetch from "isomorphic-unfetch";

import merge from "lodash/merge";

import { getQuery } from "@/components/hooks/useFilters";

const APP_URL =
  getConfig()?.publicRuntimeConfig?.app?.url || "http://localhost:3000";

/**
 * Initializes session and fetches stuff from API
 * Required for SSR
 * @param {*} queries
 * @param {*} context
 * @returns
 */
export async function fetchAll(queries, context) {
  // If we are in a browser, we return immidiately
  // This prevents a roundtrip to the server
  // and will make page changes feel faster
  if (typeof window !== "undefined") {
    return { initialState: {} };
  }

  // Build a filters object based on the context query
  const queryFilters = getQuery(context.query);

  // Appends a filters object containing all materialfilters
  // The filters object can now be read by the search.fragments
  context = merge({}, context, { query: { filters: queryFilters } });

  // Detect if requester is a bot
  const userAgent = context.req.headers["user-agent"];
  const isBot = require("isbot")(userAgent) || !!context.query.isBot;

  // user session
  const session = await getSession(context);

  // anonymous session
  let anonSession;
  if (!session?.accessToken) {
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
            ...queryFunc(context.query),
            accessToken: session?.accessToken || anonSession?.accessToken,
          });
          const queryRes = await fetcher(queryKey);
          return { queryKey, queryRes };
        })
      )
    ).forEach(({ queryKey, queryRes }) => {
      initialData[queryKey] = queryRes;
    });
  }

  return {
    initialData,
    translations: await fetchTranslations(),
    allowCookies: !!nookies.get(context)[COOKIES_ALLOWED],
    session,
    anonSession,
  };
}
