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
import { SessionProvider } from "next-auth/react";
import { createMemoryRouter, useMemoryRouter } from "./nextMemoryRouter";
import AdvancedSearchProvider from "@/components/search/advancedSearch/advancedSearchContext";

const memoryRouter = createMemoryRouter();
Router.router = memoryRouter;

export const decorators = [
  (Story, context) => {
    const { showInfo, pathname, query } = context?.parameters?.nextRouter || {};

    // Register to router changes
    // Will trigger rerender when change occurs
    useMemoryRouter({ memoryRouter, pathname, query });

    return (
      <>
        {showInfo && <StoryRouter router={memoryRouter} />}
        <Story />
      </>
    );
  },
  (Story) => {
    return (
      <AdvancedSearchProvider router={memoryRouter}>
        <Story />
      </AdvancedSearchProvider>
    );
  },
  (Story, context) => {
    return (
      <SessionProvider
        session={
          context?.parameters?.session
            ? { accessToken: "dummy-token", ...context?.parameters?.session }
            : {
                accessToken: "dummy-token",
                user: {
                  uniqueId: "mocked-uniqueId",
                  userId: "mocked-uniqueId",
                },
              }
        }
      >
        <Story />
      </SessionProvider>
    );
  },
  (Story) => {
    return (
      <ModalContextProvider router={memoryRouter}>
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
];

// Setup router via storybook nextjs framework
export const parameters = {
  nextjs: {
    router: memoryRouter,
  },
};
