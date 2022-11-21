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

export const APIMockContext = createContext();

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
 * @param {string || object} queryStr
 * @param {string || null} userAgent
 * @param {string || null} xForwardedFor
 */
export async function fetcher(
  queryStr,
  userAgent = null,
  xForwardedFor = null
) {
  const {
    apiUrl: apiUrlFromQuery,
    query,
    variables,
    delay,
    accessToken,
  } = typeof queryStr === "string" ? JSON.parse(queryStr) : queryStr;

  // Calculate apiUrl
  const apiUrl =
    apiUrlFromQuery && config[apiUrlFromQuery]?.url
      ? config[apiUrlFromQuery]?.url
      : config.api.url;

  const headers = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  if (userAgent) {
    headers["user-agent"] = userAgent;
  }
  if (xForwardedFor) {
    headers["x-forwarded-for"] = xForwardedFor;
  }
  const start = Date.now();
  const res = await fetch(apiUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (res.status !== 200) {
    throw { status: res.status, message: res.statusText };
  }

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
 */
export function useMutate() {
  // The session may contain access token
  const accessToken = useAccessToken();

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const { fetcher: mockedFetcher } = useContext(APIMockContext) || {};

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
      const res = mockedFetcher ? await mockedFetcher(key) : await fetcher(key);
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
 * @param {Object} query - A query object.
 */
export function useData(query) {
  // The session may contain access token
  const accessToken = useAccessToken();

  // The key for this query
  const key = query && generateKey({ ...query, accessToken } || "");

  // Initial data may be set, when a bot is requesting the site
  // Used for server side rendering
  const initialData = useContext(APIStateContext) || {};

  const { fetcher: mockedFetcher } = useContext(APIMockContext) || {};

  // isSlow is set to true, when query is slow
  const [isSlow, setIsSlow] = useState(false);

  // Fetch data
  const { data, error, mutate } = useSWR(
    accessToken && key,
    () => (mockedFetcher ? mockedFetcher(key) : fetcher(key)),
    {
      fallbackData: initialData[key],
      loadingTimeout: query?.slowThreshold || 5000,
      onLoadingSlow: () => setIsSlow(true),
    }
  );

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
 */
export function useFetcher() {
  // The session may contain access token
  const accessToken = useAccessToken();

  async function doFetch(query) {
    // The key for this query
    const key = query && generateKey({ ...query, accessToken } || "");
    return await fetcher(key);
  }

  return doFetch;
}

export const ApiEnums = Object.freeze({
  FBI_API: "fbi_api",
});
