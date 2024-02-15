import { StoryTitle, StoryDescription } from "@/storybook";
import { useState } from "react";
import HeaderWrapped, { Header } from "./Header";
import Searchbar from "@/components/search/searchbar";

import useFilters from "@/components/hooks/useFilters";

const urlParams =
  typeof window === "undefined"
    ? new URLSearchParams("")
    : new URLSearchParams(document.location.search);

const exportedObject = {
  title: "layout/Header",
};

export default exportedObject;

const graphql = {
  debug: true,
  resolvers: {
    SuggestResponse: {
      result: ({ variables }) =>
        variables?.q === "hest" || "suggest.".startsWith(variables?.q)
          ? [...new Array(3).fill({ type: "CREATOR" })]
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
      <StoryDescription>{`Try to input "hest" or "suggest"`}</StoryDescription>
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
      pathname: urlParams.get("nextRouter.pathname") || "/find",
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
        user={{ hasCulrUniqueId: true }}
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

export function NavHeaderFFU() {
  const filters = useFilters();

  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>Header</StoryTitle>
      <StoryDescription>
        User with no culr id can not use profile functionality
      </StoryDescription>
      <Header
        user={{ hasCulrUniqueId: false, isAuthenticated: true }}
        filters={{
          ...filters,
          getQuery: () => ({
            workTypes: "all",
          }),
        }}
      />

      <Searchbar />
    </div>
  );
}
