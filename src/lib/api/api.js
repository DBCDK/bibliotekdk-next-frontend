/**
 * @file
 * In this file we have functions related to data fetching.
 */
import { createContext, useContext, useState } from "react";
import fetch from "isomorphic-unfetch";
import storybookConfig from "@/config";
import getConfig from "next/config";
import useSWR from "swr";
import { useAccessToken } from "@/components/hooks/useUser";

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
export function generateKey(query) {
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
 * A custom React hook for sending mutate requests to the GraphQL API
 *
 * @param {Object} obj - A query object.
 */
export function useMutate() {
  // The session may contain access token
  const accessToken = useAccessToken();

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  function reset() {
    setisLoading(false);
    setData(false);
    setError(false);
  }

  async function post(query) {
    const key = generateKey({ ...query, accessToken } || "");
    setisLoading(true);
    setData(null);
    setError(null);
    try {
      const res = await fetcher(key);
      setData(res);
    } catch (e) {
      setError(e);
    }
    setisLoading(false);
  }
  return {
    data: data?.data,
    error: error || data?.errors,
    isLoading,
    post,
    reset,
  };
}

/**
 * A custom React hook for fetching data from the GraphQL API
 * https://reactjs.org/docs/hooks-custom.html
 *
 * @param {Object} obj - A query object.
 */
export function useData(query) {
  // The session may contain access token
  const accessToken = useAccessToken();

  // The key for this query
  const key = query && generateKey({ ...query, accessToken } || "");

  // Initial data may be set, when a bot is requesting the site
  // Used for server side rendering
  const initialData = useContext(APIStateContext) || {};

  // isSlow is set to true, when query is slow
  const [isSlow, setIsSlow] = useState(false);

  // Fetch data
  const { data, error, mutate } = useSWR(key, fetcher, {
    initialData: initialData[key],
    loadingTimeout: query?.slowThreshold || 5000,
    onLoadingSlow: () => setIsSlow(true),
  });

  return {
    data: data?.data,
    error: error || data?.errors,
    isLoading: query && !data,
    isSlow: data ? false : isSlow,
    mutate,
  };
}

/**
 * A custom React hook for using the fetcher
 *
 * @param {Object} obj - A query object.
 */
export function useFetcher() {
  // The session may contain access token
  const accessToken = useAccessToken();

  async function doFetch(query) {
    // The key for this query
    const key = query && generateKey({ ...query, accessToken } || "");
    const res = await fetcher(key);
    return res;
  }

  return doFetch;
}
