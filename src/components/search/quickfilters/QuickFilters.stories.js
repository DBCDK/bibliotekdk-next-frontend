import { StoryTitle, StoryDescription } from "@/storybook";
import { useState } from "react";
import QuickFilters from "../quickfilters";

export default {
  title: "search/QuickFilters",
};

export function Default() {
  const [viewSelected, setSelectedView] = useState();

  return (
    <div>
      <StoryTitle>QuickFilters</StoryTitle>
      <StoryDescription>
        Quickfilters for sorting the search result
      </StoryDescription>
      <div style={{ maxWidth: "200px" }}>
        <QuickFilters
          onViewSelect={setSelectedView}
          viewSelected={viewSelected}
        />
      </div>
    </div>
  );
}
