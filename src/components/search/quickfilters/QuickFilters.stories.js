import { StoryTitle, StoryDescription } from "@/storybook";
import { useState } from "react";
import QuickFilters from "../quickfilters";

const exportedObject = {
  title: "search/QuickFilters",
};

export default exportedObject;

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
