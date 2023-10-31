import { StoryDescription, StoryTitle } from "@/storybook";
import { DialogForPublicationYear } from "@/components/base/dropdown/advancedSearchDropdown/templatesAdvancedSearch/TemplatesAdvancedSearch";

const exportedObject = {
  title: "base/AdvancedSearchDropdown/TemplatesAdvancedSearch",
};

export default exportedObject;

export function TemplatesAdvancedSearchPublicationYearBase() {
  // const value = { lower: 10, upper: 100 };
  const value = {};
  const setValue = () => {};

  const storyTitle = "Publication Year Base";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a simple test
      </StoryDescription>
      <DialogForPublicationYear value={value} setValue={setValue} />
    </div>
  );
}
