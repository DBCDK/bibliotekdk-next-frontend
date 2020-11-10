/**
 * @file
 * In this file we have functions related to data fetching.
 */
import { useState, useEffect, createContext, useContext } from "react";
import fetch from "isomorphic-unfetch";
import config from "@/config";

// The global instance of graphql client
// used in the browser only
let browserClientInstance;

// Store context used for getting the initial state
// generated on the server
export const APIStateContext = createContext();

/**
 * Converts a query object to stringified key
 *
 * @param {Object} obj - A query object.
 * @param {string} obj.query - A GraphQL query.
 * @param {Object} obj.variables - GraphQL variables.
 *
 * @return {string} Stringified representation of the input
 */
function generateKey({ query, variables }) {
  // Consider hashing the string to make
  // keys smaller
  return JSON.stringify({ query, variables });
}

/**
 * A custom React hook for fetching data from the GraphQL API
 * https://reactjs.org/docs/hooks-custom.html
 *
 * @param {Object} obj - A query object.
 */
export const useData = (query) => {
  // Access the initial state generated on the server
  // using the APIStateContext
  const initialState = useContext(APIStateContext);
  // Get hold of the client
  const client = getClient(initialState);
  // We need the current state of the client
  const currentState = client.getState();
  // Generate key based on the query
  const key = generateKey(query);

  // Setup the initial response of the hook
  // Maybe the query is already fetched on the server,
  // so we check the state
  const [response, setResponse] = useState({
    isLoading: currentState[key] ? false : true,
    query,
    data: currentState[key] ? currentState[key].data : null,
    error: currentState[key] ? currentState[key].error : null,
    client,
  });

  // useEffect is used to perform side effects (async stuff)
  // I.e. we fetch data here
  useEffect(() => {
    // If the query changes while a request is running
    // we end up having a race condition.
    // This boolean indicates whether a request is canceled
    let canceled = false;

    // Now we perform the async stuff
    (async () => {
      // We may have the data in the state already,
      // then we won't request the API
      if (currentState[key]) {
        setResponse({
          isLoading: false,
          query,
          data: currentState[key].data,
          error: currentState[key].error,
          client,
        });
      } else {
        // Before we start the request we let
        // the parent component know that the
        // data is now loading
        setResponse({
          isLoading: true,
          query,
          data: null,
          client,
        });

        // We define a timer that will let the parent
        // component know if a request is slow
        const isSlowTimeout = setTimeout(() => {
          if (!canceled) {
            setResponse({
              isLoading: true,
              isSlow: true,
              query,
              data: null,
              client,
            });
          }
        }, query.slowThreshold || 5000);

        // Perform the request and await
        const json = await client.request(query);

        // Clear timeout
        clearTimeout(isSlowTimeout);

        // Set the response. But only if the request
        // has noot been canceled
        if (!canceled) {
          setResponse({
            isLoading: false,
            query,
            data: json.data,
            error: json.error,
            client,
          });
        }
      }
    })();

    // We return a cleanup function
    // It is run when the query changes.
    // Then any outdated requests will not
    // Accidentally override the response
    // from the latest request
    return () => (canceled = true);
  }, [key]);

  return response;
};

/**
 * Use this function to set timeout on promises.
 * @param {Promise} promise
 * @param {number} time in ms
 *
 * @return {Promise} Promise that resolves within a certain time
 */
const timeoutPromise = (promise, time) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve(null);
    }, time);

    promise.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
};

/**
 * Sends a HTTP request to the GraphQL API
 *
 * @param {Object} obj
 * @param {string} obj.query - A GraphQL query.
 * @param {Object} obj.variables - GraphQL variables.
 *
 * @return {Promise} Promise that resolves with response
 */
async function request({ query, variables }) {
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
 * Creates a client for the GraphQL API
 *
 * @param {Object} initialState
 *
 * @return {Object} A GraphQL API client
 */
function createClient(initialState) {
  // The state of the client contain responses
  // And works as a cache
  const state = initialState || {};

  // Contains promises that are not done
  const promises = {};

  /**
   * Takes care of sending a request to the API
   * It also updates the state
   *
   * @param {Object} obj
   * @param {string} obj.query - A GraphQL query.
   * @param {number} obj.delay - Delay in ms for test purposes
   * @param {Object} obj.variables - GraphQL variables.
   *
   * @return {Promise} Promise that resolves with response
   */
  async function handleRequest({ query, delay, variables }) {
    // Wait for some time if delay is set
    if (delay) {
      await new Promise((r) => {
        setTimeout(r, delay);
      });
    }

    // We need the key to identify the query
    const key = generateKey({ query, variables });

    // If we got something that matches the key, we return that
    if (state[key]) {
      return state[key];
    }

    // If we do not have a promise already handling
    // the request, we make one and store it in promises
    if (!promises[key]) {
      promises[key] = request({ query, variables });
    }

    try {
      // Now we wait for the request to be done
      const res = await promises[key];

      // It may contain errors, due to invalid query
      if (res.errors) {
        state[key] = { data: {}, error: res.errors };
      } else {
        state[key] = res;
      }

      // Clean up promise
      delete promises[key];

      // done - return the result
      return state[key];
    } catch (e) {
      // The request may have failed due to network issues
      // or something

      // Clean up promise
      delete promises[key];

      // And return the error
      return { data: {}, error: e };
    }
  }

  /**
   * Send multiple requests in parallel.
   * Intended to be used on the server
   *
   * @param {Object} obj
   * @param {string} obj.queries - Array of GraphQL query.
   * @param {Object} obj.variables - GraphQL variables.
   * @param {Object} obj.timeout - Timeout in ms before canceling request
   *
   * @return {Promise} Promise that resolves with the client state
   */
  async function batchRequest({ queries, variables, timeout = 150 }) {
    await Promise.all(
      queries.map((queryFunc) =>
        timeoutPromise(handleRequest(queryFunc(variables)), timeout)
      )
    );
    return state;
  }

  // Return the client
  return {
    getState: () => state,
    request: handleRequest,
    batchRequest,
  };
}

/**
 * Gets a client for the GraphQL API
 *
 * Client is reused when running in browser.
 * On the server we always create a new one
 *
 * @param {Object} initialState
 *
 * @return {Object} A GraphQL API client
 */
export function getClient(initialState) {
  // Check if we are on the server
  if (typeof window === "undefined") {
    // On the server, create and return new client
    return createClient(initialState);
  }

  // In the browser we check if we've already created a client
  if (!browserClientInstance) {
    // No client is created, so lets do it
    browserClientInstance = createClient(initialState);
  }

  // Return the client instance
  return browserClientInstance;
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
    // Check if the browser history API was used for navigation,
    // meaning that the application is already rendered in the browser.
    // Then we don't want to fetch data server side
    // as it will be done in the browser
    if (context.req.url.startsWith("/_next")) {
      return { props: {} };
    }

    // Detect if requester is a bot
    const userAgent = context.req.headers["user-agent"];
    const isBot = require("isbot")(userAgent) || !!context.query.isBot;

    // Increase timeout if its a bot, as much as possible should
    // be server side rendered
    const timeout = isBot
      ? 10000
      : (context.query.timeout && parseInt(context.query.timeout, 10)) ||
        config.api.timeout;

    // The browser has not rendered the application yet
    // We fetch some data, which will be used for server
    // side rendering.
    return {
      props: {
        initialState: await getClient().batchRequest({
          queries,
          variables: context.params,
          timeout,
        }),
      },
    };
  };
}
