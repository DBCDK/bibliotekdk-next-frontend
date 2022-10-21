/**
 * @file This is loaded in the "preview" iframe
 * https://storybook.js.org/docs/react/configure/overview#configure-story-rendering
 */
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import "../src/scss/custom-bootstrap.scss";
import "../src/css/styles.css";
import { AnonymousSessionContext } from "@/components/hooks/useUser";
import { RouterContext } from "next/dist/shared/lib/router-context"; // next 12

import { Provider as ModalContextProvider } from "../src/components/_modal/Modal.js";
import { APIStateContext } from "@/lib/api/api";
import { GraphQLMocker } from "@/lib/api/mockedFetcher";
import { StoryRouter } from "@/components/base/storybook";
import { useRouter } from "next/router";
import { useState } from "react";

export const decorators = [
  (Story) => {
    return (
      <APIStateContext.Provider value={{}}>
        <Story />
      </APIStateContext.Provider>
    );
  },
  (Story) => {
    return (
      <AnonymousSessionContext.Provider value={{ accessToken: "dummy-token" }}>
        <Story />
      </AnonymousSessionContext.Provider>
    );
  },
  (Story) => {
    const router = useRouter();
    return (
      <ModalContextProvider router={router}>
        <Story />
      </ModalContextProvider>
    );
  },
  (Story, context) => {
    return (
      <GraphQLMocker
        url={
          context?.parameters?.graphql?.url ||
          "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql" ||
          "https://alfa-api.stg.bibliotek.dk/190101/default/graphql"
        }
        resolvers={context?.parameters?.graphql?.resolvers}
        beforeFetch={context?.parameters?.graphql?.urlbeforeFetch}
        debug={context?.parameters?.graphql?.debug}
      >
        <Story />
      </GraphQLMocker>
    );
  },
  (Story, context) => {
    const { showInfo, pathname, query } = context?.parameters?.nextRouter || {};
    return (
      <RouterProvider value={{ pathname, query }}>
        {showInfo && <StoryRouter />}
        <Story />
      </RouterProvider>
    );
  },
];

function RouterProvider({ children, value = {} }) {
  const [{ current, history }, setQuery] = useState({
    current: 0,
    history: [
      { pathname: value.pathname || "/", query: value.query || {}, action: "" },
    ],
  });

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

  return (
    <RouterContext.Provider
      value={{
        ...value,
        action: history[current].action,
        query: history[current].query || {},
        pathname: history[current].pathname || "/",
        replace: (...args) => {
          const { pathname, query } = parse(...args);
          setQuery({
            current,
            history: [
              ...history.slice(0, current),
              { pathname, query, action: "replace" },
            ],
          });
        },
        push: (...args) => {
          const { pathname, query } = parse(...args);
          setQuery({
            current: current + 1,
            history: [
              ...history.slice(0, current + 1),
              { pathname, query, action: "push" },
            ],
          });
        },
        back: () =>
          setQuery({
            current: Math.max(current - 1, 0),
            history,
          }),
        go: (index) =>
          setQuery({
            current: current + index,
            history,
          }),
        prefetch: async () => {},
      }}
    >
      {value.showInfo && <StoryRouter />}
      {children}
    </RouterContext.Provider>
  );
}
