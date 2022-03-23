/**
 * @file This is loaded in the "preview" iframe
 * https://storybook.js.org/docs/react/configure/overview#configure-story-rendering
 */
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import "../src/scss/custom-bootstrap.scss";
import "../src/css/styles.css";
import { AnonymousSessionContext } from "../src/components/hooks/useUser";
import { RouterContext } from "next/dist/shared/lib/router-context"; // next 12

import { Provider as ModalContextProvider } from "../src/components/_modal/Modal.js";
import { APIStateContext } from "../src/lib/api/api";
import { useEffect, useState } from "react";
import { GraphQLMocker } from "@/lib/api/mockedFetcher";
import { StoryRouter } from "@/components/base/storybook";

/**
 * Mock nextjs useRouter
 * History stack is in-memory only, not changing url
 * @returns
 */
function useRouterMock() {
  const [{ current, history }, setQuery] = useState({
    current: 0,
    history: [{ pathname: "", query: {} }],
  });
  return {
    query: history[current].query || {},
    pathname: history[current].pathname || {},
    push: ({ pathname, query }) =>
      setQuery({
        current: current + 1,
        history: [...history.slice(0, current + 1), { pathname, query }],
      }),
    replace: ({ pathname, query }) =>
      setQuery({
        current,
        history: [...history.slice(0, current), { pathname, query }],
      }),
    go: (index) =>
      setQuery({
        current: current + index,
        history,
      }),
  };
}

// Make Next.js Link tags work in storybook by mocking the router
// https://www.npmjs.com/package/storybook-addon-next-router
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
    const router = useRouterMock();
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
          "https://alfa-api.stg.bibliotek.dk/graphql"
        }
        resolvers={context?.parameters?.graphql?.resolvers}
        beforeFetch={context?.parameters?.graphql?.urlbeforeFetch}
        debug={context?.parameters?.graphql?.debug}
      >
        <Story />
      </GraphQLMocker>
    );
  },
];

function RouterProvider({ children, value }) {
  const [{ current, history }, setQuery] = useState({
    current: 0,
    history: [
      { pathname: value.pathname || "/", query: value.query || {}, action: "" },
    ],
  });

  return (
    <RouterContext.Provider
      value={{
        ...value,
        action: history[current].action,
        query: history[current].query || {},
        pathname: history[current].pathname || "/",
        replace: ({ pathname, query }) =>
          setQuery({
            current,
            history: [
              ...history.slice(0, current),
              { pathname, query, action: "replace" },
            ],
          }),
        push: ({ pathname, query }) => {
          setQuery({
            current: current + 1,
            history: [
              ...history.slice(0, current + 1),
              { pathname, query, action: "push" },
            ],
          });
        },
        go: (index) =>
          setQuery({
            current: current + index,
            history,
          }),
      }}
    >
      {value.showInfo && <StoryRouter />}
      {children}
    </RouterContext.Provider>
  );
}

export const parameters = {
  nextRouter: {
    Provider: RouterProvider,
  },
};
