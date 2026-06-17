/**
 * @file This is loaded in the "preview" iframe
 * https://storybook.js.org/docs/react/configure/overview#configure-story-rendering
 */
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import "../src/scss/custom-bootstrap.scss";
import "../src/css/styles.css";

import { Provider as ModalContextProvider } from "../src/components/_modal/Modal.js";
import { GraphQLMocker } from "@/lib/api/mockedFetcher";
import { StoryRouter } from "@/components/base/storybook";
import Router from "next/router";
import { createRouter as createStorybookRouter } from "@storybook/nextjs/router.mock";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { SessionProvider } from "next-auth/react";
import { useMemo } from "react";
import { SWRConfig, useSWRConfig } from "swr";
import { createMemoryRouter, useMemoryRouter } from "./nextMemoryRouter";
import AdvancedSearchProvider from "@/components/search/advancedSearch/advancedSearchContext";
import { UseManyProvider } from "@/components/hooks/useMany";

const memoryRouter = createMemoryRouter();
Router.router = memoryRouter;

function StorybookSWRReset({ storyId, children }) {
  const { cache } = useSWRConfig();

  useMemo(() => {
    for (const key of cache.keys()) {
      if (typeof key === "string" && key.startsWith('{"apiUrl"')) {
        cache.delete(key);
      }
    }
  }, [cache, storyId]);

  return children;
}

export const decorators = [
  (Story, context) => {
    const { showInfo, pathname, query } = context?.parameters?.nextRouter || {};
    const session = context?.parameters?.session
      ? { accessToken: "dummy-token", ...context?.parameters?.session }
      : {
          accessToken: "dummy-token",
          user: {
            uniqueId: "mocked-uniqueId",
            userId: "mocked-uniqueId",
          },
        };

    // Register to router changes
    // Will trigger rerender when change occurs
    useMemoryRouter({ memoryRouter, pathname, query });
    createStorybookRouter(memoryRouter);

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
        <SWRConfig value={{ dedupingInterval: 0 }}>
          <RouterContext.Provider value={memoryRouter}>
            <AdvancedSearchProvider router={memoryRouter}>
              <SessionProvider session={session}>
                <ModalContextProvider router={memoryRouter}>
                  {showInfo && <StoryRouter router={memoryRouter} />}
                  <UseManyProvider />
                  <StorybookSWRReset storyId={context.id}>
                    <Story />
                  </StorybookSWRReset>
                </ModalContextProvider>
              </SessionProvider>
            </AdvancedSearchProvider>
          </RouterContext.Provider>
        </SWRConfig>
      </GraphQLMocker>
    );
  },
];

// Setup router via storybook nextjs framework
export const parameters = {
  nextjs: {
    router: memoryRouter,
  },
};
