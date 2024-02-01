/**
 * @file
 * In this file we have functions related to data fetching.
 */
import { createContext, useContext, useState } from "react";
import fetch from "isomorphic-unfetch";
import storybookConfig from "@/config";
import getConfig from "next/config";
import useSWR from "swr";
import useAccessToken from "@/components/hooks/user/useAccessToken";

// TODO handle config better
const nextJsConfig = getConfig();
const config =
  (nextJsConfig && nextJsConfig.publicRuntimeConfig) || storybookConfig;

export const APIMockContext = createContext();

/**
 * Converts a query object to stringified key
 *
 * @param {Object} query - A query object.
 *
 * @returns {string} Stringified representation of the input
 */
export function generateKey(query) {
  // Consider hashing the string to make
  // keys smaller
  return JSON.stringify(query);
}

let debug = false;

export function enableDebug() {
  debug = true;
}

/**
 * Our custom fetcher
 *
 * @param {string || Object} queryStr
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
      : config.fbi_api.url;

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

  if (debug && typeof window !== "undefined") {
    const normalStyle = "text-decoration: none;font-weight:normal;";
    const boldStyle = "font-weight:bold;";
    const headerStyle = "text-decoration: underline;padding-bottom: 8px;";
    console.log(
      `%cFBI-API DEBUG
%cOperation: %c${query.match(/query\s+(.*?)\s*\(/)?.[1] || "UNNAMED"}
%cHTTP status: ${res.status}
GraphiQL: https://fbi-api.dbc.dk/graphiql?query=${encodeURIComponent(
        query
      )}&variables=${encodeURIComponent(JSON.stringify(variables))}
      
`,
      headerStyle,
      normalStyle,
      boldStyle,
      normalStyle,
      { variables }
    );
  }

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
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetcherImpl = useFetcherImpl();
  const keyGenerator = useKeyGenerator();

  function reset() {
    setisLoading(false);
    setData(false);
    setError(false);
  }

  async function post(query) {
    const key = keyGenerator(query);
    setisLoading(true);
    setData(null);
    setError(null);
    try {
      const res = await fetcherImpl(key);
      if (res.errors) {
        throw res.errors[0].message;
      }
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
  const keyGenerator = useKeyGenerator();
  const fetcherImpl = useFetcherImpl();
  const key = keyGenerator(query);

  // isSlow is set to true, when query is slow
  const [isSlow, setIsSlow] = useState(false);

  // Fetch data
  const { data, error, mutate, isValidating } = useSWR(key, fetcherImpl, {
    loadingTimeout: query?.slowThreshold || 5000,
    onLoadingSlow: () => setIsSlow(true),
  });

  return {
    data: data?.data,
    error: error || data?.errors,
    isLoading: query && !data,
    isSlow: data ? false : isSlow,
    mutate,
    isValidating,
  };
}

/**
 * A custom React hook for using the fetcher
 */
export function useFetcher() {
  const fetcherImpl = useFetcherImpl();
  const keyGenerator = useKeyGenerator();

  async function doFetch(query) {
    // The key for this query
    const key = keyGenerator(query);
    return await fetcherImpl(key);
  }

  return doFetch;
}

function getStackTrace() {
  const obj = {};
  try {
    // does not work in firefox..
    Error.captureStackTrace(obj, getStackTrace);
  } catch (e) {}

  return obj.stack;
}

/**
 * Will return specific implementation of fetcher
 * either a mocked one, or the real deal
 */
function useFetcherImpl() {
  const { fetcher: mockedFetcher } = useContext(APIMockContext) || {};

  if (mockedFetcher) {
    const stackTrace = getStackTrace();
    return (queryStr) => mockedFetcher(queryStr, stackTrace);
  }

  return fetcher;
}

/**
 * Generates key based on the GraphQL query/variables
 */
function useKeyGenerator() {
  const accessToken = useAccessToken();

  return (query) =>
    accessToken && query && generateKey({ ...query, accessToken } || "");
}

export const ApiEnums = Object.freeze({
  FBI_API: "fbi_api",
  FBI_API_SIMPLESEARCH: "fbi_api_simplesearch",
});
