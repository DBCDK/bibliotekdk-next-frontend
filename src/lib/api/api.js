/**
 * @file
 * In this file we have functions related to data fetching.
 */
import { createContext, useContext, useState } from "react";
import fetch from "isomorphic-unfetch";
import storybookConfig from "@/config";
import getConfig from "next/config";
import useSWR from "swr";

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
  const { query, variables, delay } =
    typeof queryStr === "string" ? JSON.parse(queryStr) : queryStr;

  if (delay) {
    await new Promise((r) => {
      setTimeout(r, delay);
    });
  }

  const res = await fetch(config.api.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  return res.json();
}

/**
 * A custom React hook for fetching data from the GraphQL API
 * https://reactjs.org/docs/hooks-custom.html
 *
 * @param {Object} obj - A query object.
 */
export function useData(query) {
  // The key for this query
  const key = query && generateKey(query || "");

  // Initial data may be set, when a bot is requesting the site
  // Used for server side rendering
  const initialData = useContext(APIStateContext) || {};

  // isSlow is set to true, when query is slow
  const [isSlow, setIsSlow] = useState(false);

  // Fetch data
  const { data, error } = useSWR(key, fetcher, {
    initialData: initialData[key],
    loadingTimeout: query.slowThreshold || 5000,
    onLoadingSlow: () => setIsSlow(true),
  });

  return {
    data: data?.data,
    error: error || data?.errors,
    isLoading: !data,
    isSlow: data ? false : isSlow,
  };
}

/**
 * Helper for each page to fetch data
 * when running on the server
 *
 * @param {Object[]} queries will be fetched in parallel
 *
 * @return {function} getServerSideProps
 */
export function fetchOnServer(queries) {
  /**
   * A function that Next.js will invoke per page request
   *
   * @param {Object} context Next.js context
   *
   * @return {Object} props used for server side rendering
   */
  return async function getServerSideProps(context) {
    // Detect if requester is a bot
    const userAgent = context.req.headers["user-agent"];
    const isBot = require("isbot")(userAgent) || !!context.query.isBot;

    // If user is not a bot, we don't care about SSR
    // We show the page as fast as we can with skeleton elements
    if (!isBot) {
      return { props: {} };
    }

    // Fetch all queries in parallel
    const initialState = {};
    (
      await Promise.all(
        queries.map(async (queryFunc) => {
          const queryKey = generateKey(queryFunc(context.params));
          const queryRes = await fetcher(queryKey);
          return { queryKey, queryRes };
        })
      )
    ).forEach(({ queryKey, queryRes }) => {
      initialState[queryKey] = queryRes;
    });

    return {
      props: {
        initialState,
      },
    };
  };
}
