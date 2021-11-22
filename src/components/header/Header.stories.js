import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { useState } from "react";
import { Header } from "./Header";

import useFilters from "@/components/hooks/useFilters";

export default {
  title: "layout/Header",
};

/**
 * Returns Header
 *
 */
export function NavHeader() {
  // Storybook handle suggester internal state (url params not working in storybook)
  const [suggesterVisibleMobile, setSuggesterVisibleMobile] = useState(false);

  const story = { suggesterVisibleMobile, setSuggesterVisibleMobile };

  const filters = useFilters();

  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>Header</StoryTitle>
      <StoryDescription>Full header component</StoryDescription>
      <Header
        story={story}
        user={{ isAuthenticated: false }}
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
