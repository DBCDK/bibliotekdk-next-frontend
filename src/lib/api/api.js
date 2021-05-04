/**
 * @file
 * In this file we have functions related to data fetching.
 */
import { createContext, useContext, useState } from "react";
import nookies from "nookies";
import fetch from "isomorphic-unfetch";
import storybookConfig from "@/config";
import getConfig from "next/config";
import useSWR from "swr";
import fetchTranslations from "@/lib/api/backend";
import { COOKIES_ALLOWED } from "@/components/cookiebox";
import { getSession, useSession } from "next-auth/client";
import useUser from "@/components/hooks/useUser";

// TODO handle config better
const nextJsConfig = getConfig();
const config =
  (nextJsConfig && nextJsConfig.publicRuntimeConfig) || storybookConfig;

// Store context used for getting the initial state
// generated on the server
export const APIStateContext = createContext();

/**
 * Converts a query object to stringified key
 *
 * @param {Object} query - A query object.
 *
 * @return {string} Stringified representation of the input
 */
function generateKey(query) {
  // Consider hashing the string to make
  // keys smaller
  return JSON.stringify(query);
}

/**
 * Our custom fetcher
 *
 * @param {string} queryStr
 */
export async function fetcher(queryStr) {
  const { query, variables, delay, accessToken } =
    typeof queryStr === "string" ? JSON.parse(queryStr) : queryStr;

  const headers = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  const start = Date.now();
  const res = await fetch(config.api.url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const duration = Date.now() - start;

  if (delay && typeof window !== "undefined") {
    const remaining = delay - duration;
    if (remaining > 0) {
      await new Promise((r) => {
        setTimeout(r, remaining);
      });
    }
  }

  return res.json();
}

/**
 * A custom React hook for fetching data from the GraphQL API
 * https://reactjs.org/docs/hooks-custom.html
 *
 * @param {Object} obj - A query object.
 */
export function useData(query) {
  // The session may contain access token
  const user = useUser();
  const accessToken = user?.accessToken;

  // The key for this query
  const key = query && generateKey({ ...query, accessToken } || "");

  // Initial data may be set, when a bot is requesting the site
  // Used for server side rendering
  const initialData = useContext(APIStateContext) || {};

  // isSlow is set to true, when query is slow
  const [isSlow, setIsSlow] = useState(false);

  // Fetch data
  const { data, error } = useSWR(key, fetcher, {
    initialData: initialData[key],
    loadingTimeout: query?.slowThreshold || 5000,
    onLoadingSlow: () => setIsSlow(true),
  });

  return {
    data: data?.data,
    error: error || data?.errors,
    isLoading: !data,
    isSlow: data ? false : isSlow,
  };
}

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

  // Fetch all queries in parallel
  const initialData = {};

  // If user is a bot, we care about SSR, and fetch data now
  // Otherwise, we show the page as fast as we can with skeleton elements
  if (isBot) {
    (
      await Promise.all(
        queries.map(async (queryFunc) => {
          const queryKey = generateKey(queryFunc(context.query));
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
    session: (await getSession(context)) || {},
  };
}
