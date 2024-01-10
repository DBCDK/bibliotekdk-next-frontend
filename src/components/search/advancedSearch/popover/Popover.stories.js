import { StoryTitle, StoryDescription } from "@/storybook";

import AdvancedSearchPopover from "@/components/search/advancedSearch/popover/Popover";

const exportedObject = {
  title: "AdvancedSearch/Popover",
};

export function Default() {
  return (
    <div>
      <StoryTitle>Advanced Search Popover</StoryTitle>
      <StoryDescription>Search Popover</StoryDescription>
      <div>
        <AdvancedSearchPopover />
      </div>
    </div>
  );
}

export default exportedObject;
