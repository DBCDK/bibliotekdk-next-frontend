import { useEffect, useMemo, useState } from "react";

/**
 * parse args from push and replace
 */
function parse(...args) {
  let pathname = args[0]?.pathname;
  let query = args[0]?.query || {};
  if (typeof args[0] === "string") {
    const split = args[0].split("?");
    pathname = split[0];
    split[1]?.split("&")?.forEach((entry) => {
      const param = entry?.split("=");
      query[param?.[0]] = param?.[1];
    });
  }
  return { pathname, query };
}

/**
 * Creates a memory based router, that can be used for mocking
 * the NextJS router.
 */
export function createMemoryRouter() {
  // Initialize router state
  let current = 0;
  let history = [{ pathname: "/", query: {}, action: "" }];
  let listeners = [];

  // Adds an event listener to react to router state changes
  function addListener(func) {
    listeners.push(func);
  }

  // Removes a registered event listener
  function removeListener(func) {
    listeners = listeners.filter((f) => f !== func);
  }

  // The actual router object that will be injected into NextJS
  const router = {
    action: history[current].action,
    query: history[current].query,
    pathname: history[current].pathname,
    asPath: history[current].pathname,
  };

  // Updates the router state and notifies listeners
  function updateRouter() {
    const { action, query, pathname } = history[current];
    router.action = action;
    router.query = query || {};
    router.pathname = pathname || "/";
    router.asPath = pathname || "/";

    listeners.forEach((func) => func());
  }

  // Resets the router state to a specified path and query
  function reset({ pathname = "/", query = {} } = {}) {
    current = 0;
    history = [{ pathname, query, action: "" }];
    updateRouter();
  }

  // Assign functions to router
  router.addListener = addListener;
  router.removeListener = removeListener;

  router.replace = (...args) => {
    const { pathname, query } = parse(...args);
    history = [
      ...history.slice(0, current),
      { pathname, query, action: "replace" },
    ];
    updateRouter();
  };
  router.push = (...args) => {
    const { pathname, query } = parse(...args);
    history = [
      ...history.slice(0, current + 1),
      { pathname, query, action: "push" },
    ];
    current++;
    updateRouter();
  };
  router.back = () => {
    current = Math.max(current - 1, 0);
    updateRouter();
  };
  router.go = (index) => {
    current = Math.max(0, Math.min(current + index, history.length - 1));
    updateRouter();
  };
  router.prefetch = async () => {};
  router.reset = reset;

  return router;
}

export function useMemoryRouter({ memoryRouter, pathname, query }) {
  const [_, forceRender] = useState();
  // Reset memory router when pathname or query changes
  useMemo(() => {
    memoryRouter.reset({ pathname, query });
  }, [pathname, query]);

  // Subscribe to memory router changes
  // Force rerender when change occurs
  useEffect(() => {
    const onChange = () => forceRender({});
    memoryRouter.addListener(onChange);

    return () => memoryRouter.removeListener(onChange);
  }, []);
}
