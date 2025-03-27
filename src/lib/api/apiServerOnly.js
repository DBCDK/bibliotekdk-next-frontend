import { generateKey, fetcher } from "@/lib/api/api";
import { getServerSession } from "@dbcdk/login-nextjs/server";

/**
 * Initializes session and fetches stuff from API
 * Required for SSR
 * @param {Array} queries
 * @param {Object} context
 * @param {*} customQueryVariables
 * @returns
 */
export async function fetchAll(
  queries,
  context,
  customQueryVariables,
  force = false
) {
  // If we are in a browser, we return immidiately
  // This prevents a roundtrip to the server
  // and will make page changes feel faster
  if (typeof window !== "undefined") {
    return {};
  }

  // Detect if requester is a bot
  const userAgent = context.req.headers["user-agent"];
  const isBot = require("isbot")(userAgent) || !!context.query.isBot;
  const ip =
    context.req.headers["x-forwarded-for"] ||
    context.req.connection.remoteAddress;

  // Fetch all queries in parallel
  const initialData = {};

  // If user is a bot, we care about SSR, and fetch data now
  // Otherwise, we show the page as fast as we can with skeleton elements
  if (isBot || force) {
    (
      await Promise.all(
        queries.map(async (queryFunc) => {
          const queryFuncRes = queryFunc({
            ...context.query,
            ...customQueryVariables,
          });

          // The queryFunc can return null, if this happens, we should just
          // return immediately, instead of making a GraphQL call that will fail
          if (!queryFuncRes) {
            return null;
          }

          const queryKey = generateKey({
            ...queryFuncRes,
          });
          try {
            const queryRes = await fetcher(queryKey, userAgent, ip, {
              headers: context.req.headers,
            });
            return { queryKey, queryRes };
          } catch (e) {
            return null;
          }
        })
      )
    )
      .filter((r) => r)
      .forEach(({ queryKey, queryRes }) => {
        initialData[queryKey] = queryRes;
      });
  }

  return {
    initialData,
  };
}
