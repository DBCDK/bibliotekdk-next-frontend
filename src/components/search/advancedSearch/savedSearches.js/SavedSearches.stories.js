import { StoryTitle, StoryDescription } from "@/storybook";

import SavedSearches from "./SavedSearches";

const exportedObject = {
  title: "AdvancedSearch/savedSearches",
};

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
