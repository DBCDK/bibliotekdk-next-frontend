import nookies from "nookies";
import fetchTranslations from "@/lib/api/backend";
import { COOKIES_ALLOWED } from "@/components/cookiebox";
import { getSession } from "next-auth/client";
import { fetchAnonymousSession } from "../anonymousSession";
import { generateKey, fetcher } from "@/lib/api/api";

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

  // Detect if requester is a bot
  const userAgent = context.req.headers["user-agent"];
  const isBot = require("isbot")(userAgent) || !!context.query.isBot;

  // user session
  const session = await getSession(context);

  // anonymous session
  let anonSession =
    !session?.accessToken && (await fetchAnonymousSession(context));

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
