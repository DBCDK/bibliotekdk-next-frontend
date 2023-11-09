import { StoryDescription, StoryTitle } from "@/storybook";
import DropdownInputs from "@/components/search/advancedSearch/dropdownInputs/DropdownInputs";

const exportedObject = {
  title: "AdvancedSearch/DropdownItems",
};

export default exportedObject;

export function DropdownItemsBase() {
  const storyTitle = "Dropdown Items";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a simple test
      </StoryDescription>
      <DropdownInputs />
    </div>
  );
}
