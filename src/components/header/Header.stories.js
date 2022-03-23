import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { useState } from "react";
import HeaderWrapped, { Header } from "./Header";

import useFilters from "@/components/hooks/useFilters";

export default {
  title: "layout/Header",
};

/**
 * Returns Header
 *
 */
export function NavHeader() {
  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>Header</StoryTitle>
      <StoryDescription>Try to input "hest"</StoryDescription>
      <HeaderWrapped />
    </div>
  );
}

NavHeader.story = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        SuggestResponse: {
          result: ({ variables }) =>
            variables?.q === "hest" ? [...new Array(10).fill({})] : [],
        },
        SuggestRow: {
          __resolveType: ({ getNext }) =>
            getNext(["Subject", "Creator", "Work"]),
        },
        Subject: {
          value: ({ getNext }) => getNext(["heste", "oste", "halløj"]),
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/find",
      query: {
        "q.title": "hest",
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
