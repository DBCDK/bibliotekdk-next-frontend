import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { useState } from "react";
import HeaderWrapped, { Header } from "./Header";

import useFilters from "@/components/hooks/useFilters";

export default {
  title: "layout/Header",
};

const graphql = {
  debug: true,
  resolvers: {
    SuggestResponse: {
      result: ({ variables }) =>
        variables?.q === "hest" || "suggest.".startsWith(variables?.q)
          ? [...new Array(3).fill({})]
          : [],
    },
  },
};

/**
 * Returns Header
 *
 */
export function NavHeader() {
  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>Header</StoryTitle>
      <StoryDescription>Try to input "hest" or "suggest"</StoryDescription>
      <HeaderWrapped />
    </div>
  );
}
NavHeader.story = {
  parameters: {
    graphql,
    nextRouter: {
      showInfo: true,
      pathname: "/find",
      query: {},
    },
  },
};

export function NavHeaderPrefilled() {
  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>Header</StoryTitle>
      <StoryDescription>
        URL query parameters are reflected as default values in input fields
      </StoryDescription>
      <HeaderWrapped />
    </div>
  );
}
NavHeaderPrefilled.story = {
  parameters: {
    graphql,
    nextRouter: {
      showInfo: true,
      pathname: "/find",
      query: {
        "q.all": "some all",
        "q.title": "some title",
        "q.creator": "some creator",
        "q.subject": "some subject",
        workType: "movie",
      },
    },
  },
};

/**
 * Returns Header with user logged in
 *
 */
export function NavHeaderUserLoggedIn() {
  // Storybook handle suggester internal state (url params not working in storybook)
  const [suggesterVisibleMobile, setSuggesterVisibleMobile] = useState(false);

  const story = { suggesterVisibleMobile, setSuggesterVisibleMobile };

  const filters = useFilters();

  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>Header</StoryTitle>
      <StoryDescription>
        Full header component - with user logged in
      </StoryDescription>
      <Header
        story={story}
        user={{ isAuthenticated: true }}
        filters={{
          ...filters,
          getQuery: () => ({
            workType: "all",
          }),
        }}
      />
    </div>
  );
}
