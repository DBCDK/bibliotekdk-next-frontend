import { StoryDescription, StoryTitle } from "@/storybook";
import automock_utils from "@/lib/automock_utils.fixture";
import AdvancedSearchDropdown, {
  FormTypeEnum,
} from "@/components/base/dropdown/advancedSearchDropdown/AdvancedSearchDropdown";
import merge from "lodash/merge";

const exportedObject = {
  title: "base/AdvancedSearchDropdown",
};

export default exportedObject;

const { DEFAULT_STORY_PARAMETERS } = automock_utils();

export function AdvancedSearchDropdownOnlyCheckboxes() {
  const indices = [
    { itemName: "kat", formType: FormTypeEnum.CHECKBOX },
    { itemName: "hund", formType: FormTypeEnum.CHECKBOX },
    { itemName: "hest", formType: FormTypeEnum.CHECKBOX },
    { itemName: "gris", formType: FormTypeEnum.CHECKBOX },
  ];

  const storyTitle = "Only checkboxes";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a simple test
      </StoryDescription>
      <AdvancedSearchDropdown indexName={storyTitle} menuItems={indices} />
    </div>
  );
}
export function AdvancedSearchDropdownOnlyRadioButtons() {
  const indices = [
    { itemName: "kat", formType: FormTypeEnum.RADIO_BUTTON },
    { itemName: "hund", formType: FormTypeEnum.RADIO_BUTTON },
    { itemName: "hest", formType: FormTypeEnum.RADIO_BUTTON },
    { itemName: "gris", formType: FormTypeEnum.RADIO_BUTTON },
  ];

  const storyTitle = "Only radio buttons";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a simple test
      </StoryDescription>
      <AdvancedSearchDropdown indexName={storyTitle} menuItems={indices} />
    </div>
  );
}
AdvancedSearchDropdownOnlyRadioButtons.story = merge(
  {},
  DEFAULT_STORY_PARAMETERS,
  {
    parameters: {
      graphql: {
        resolvers: {},
      },
    },
  }
);
