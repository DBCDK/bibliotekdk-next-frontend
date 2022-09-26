import { StoryTitle, StoryDescription } from "@/storybook";
import { useState } from "react";
import HeaderWrapped, { Header } from "./Header";
import Searchbar from "@/components/search/searchbar";

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
      <Searchbar />
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
      <Searchbar />
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
        workTypes: "movie",
      },
    },
  },
};

export function NavHeaderMaterialPage() {
  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>Header</StoryTitle>
      <StoryDescription>
        URL query parameters are reflected as default values in input fields
      </StoryDescription>
      <HeaderWrapped />
      <Searchbar />
    </div>
  );
}

NavHeaderMaterialPage.story = {
  parameters: {
    graphql,
    nextRouter: {
      showInfo: true,
      pathname: "/materiale/[title_author]/[workId]",
      query: {
        title_author: "den-vaade-fisk_volker-kutscher",
        workId: "work-of:870970-basis:27644317",
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
            workTypes: "all",
          }),
        }}
      />
    </div>
  );
}
