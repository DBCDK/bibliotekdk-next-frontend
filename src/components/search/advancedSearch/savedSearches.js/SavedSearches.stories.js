import React from "react";
import { StoryTitle, StoryDescription } from "@/storybook";
import SavedSearches from "./SavedSearches";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const exportedObject = {
  title: "AdvancedSearch/savedSearches",
};

const { SAVED_SEARCHES } = automock_utils();

export default exportedObject;

export function Default() {
  return (
    <div>
      <StoryTitle>Advanced Search - Saved search</StoryTitle>
      <StoryDescription>saved searches</StoryDescription>

      <SavedSearches />
    </div>
  );
}

Default.story = merge(
  {},
  {
    parameters: {
      session: {
        accessToken: "dummy-token",
        user: { uniqueId: null, userId: "mocked-uniqueId" },
      },
      graphql: {
        debug: true,
        resolvers: {
          Query: {
            user: () => ({
              savedSearches: SAVED_SEARCHES,
            }),
          },
        },
      },
      nextRouter: {
        showInfo: true,
        pathname: "/avanceret/gemte-soegninger",
        query: {},
      },
    },
  }
);

export function NoAuthenticated() {
  return (
    <div>
      <StoryTitle>
        Advanced Search - Saved search for not logged in user
      </StoryTitle>
      <StoryDescription>
        Display login button if user is not logged in
      </StoryDescription>

      <SavedSearches />
    </div>
  );
}

NoAuthenticated.story = merge(
  {},
  {
    parameters: {
      session: {
        // accessToken: "dummy-token",
        // user: { uniqueId: null, userId: "mocked-uniqueId" },
      },
      graphql: {
        debug: true,
        resolvers: {
          Query: {
            user: () => ({
              savedSearches: { hitcount: 0, result: [] },
            }),
          },
        },
      },
      nextRouter: {
        showInfo: true,
        pathname: "/avanceret/gemte-soegninger",
        query: {},
      },
    },
  }
);
