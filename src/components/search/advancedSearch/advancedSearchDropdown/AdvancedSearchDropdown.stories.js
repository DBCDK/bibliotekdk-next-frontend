import { StoryDescription, StoryTitle } from "@/storybook";
import AdvancedSearchDropdown from "@/components/search/advancedSearch/advancedSearchDropdown/AdvancedSearchDropdown";
import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";

const exportedObject = {
  title: "AdvancedSearch/AdvancedSearchDropdown",
};

export default exportedObject;

export function AdvancedSearchDropdownOnlyCheckboxes() {
  const indices = [
    { name: "kat", value: "kat", formType: FormTypeEnum.CHECKBOX },
    { name: "hund", value: "hund", formType: FormTypeEnum.CHECKBOX },
    { name: "hest", value: "hest", formType: FormTypeEnum.CHECKBOX },
    { name: "gris", value: "gris", formType: FormTypeEnum.CHECKBOX },
  ];
  const updateIndex = () => {};

  const storyTitle = "Only checkboxes";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a simple test
      </StoryDescription>
      <AdvancedSearchDropdown
        indexName={storyTitle}
        indexTitle={storyTitle}
        menuItems={indices}
        updateIndex={updateIndex}
      />
    </div>
  );
}
export function AdvancedSearchDropdownOnlyRadioButtons() {
  const indices = [
    { name: "kat", value: "kat", formType: FormTypeEnum.RADIO_BUTTON },
    { name: "hund", value: "hund", formType: FormTypeEnum.RADIO_BUTTON },
    { name: "hest", value: "hest", formType: FormTypeEnum.RADIO_BUTTON },
    { name: "gris", value: "gris", formType: FormTypeEnum.RADIO_BUTTON },
  ];

  const updateIndex = () => {};

  const storyTitle = "Only radio buttons";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a simple test
      </StoryDescription>
      <AdvancedSearchDropdown
        indexName={storyTitle}
        indexTitle={storyTitle}
        menuItems={indices}
        updateIndex={updateIndex}
      />
    </div>
  );
}

export function AdvancedSearchDropdownCheckboxesAndRadioButtons() {
  const indices = [
    { name: "kat", value: "kat", formType: FormTypeEnum.CHECKBOX },
    { name: "hund", value: "hund", formType: FormTypeEnum.CHECKBOX },
    { name: "hest", value: "hest", formType: FormTypeEnum.CHECKBOX },
    { name: "gris", value: "gris", formType: FormTypeEnum.CHECKBOX },
    { name: "giraf", value: "giraf", formType: FormTypeEnum.RADIO_BUTTON },
    { name: "løve", value: "løve", formType: FormTypeEnum.RADIO_BUTTON },
    { name: "elefant", value: "elefant", formType: FormTypeEnum.RADIO_BUTTON },
    { name: "søløve", value: "søløve", formType: FormTypeEnum.RADIO_BUTTON },
  ];

  const updateIndex = () => {};

  const storyTitle = "Checkboxes and radio buttons";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a more complicated test
      </StoryDescription>
      <AdvancedSearchDropdown
        indexName={storyTitle}
        indexTitle={storyTitle}
        menuItems={indices}
        updateIndex={updateIndex}
      />
    </div>
  );
}

export function AdvancedSearchDropdownCheckboxesAndDividerAndRadioButtons() {
  const indices = [
    { name: "kat", value: "kat", formType: FormTypeEnum.CHECKBOX },
    { name: "hund", value: "hund", formType: FormTypeEnum.CHECKBOX },
    { name: "hest", value: "hest", formType: FormTypeEnum.CHECKBOX },
    { name: "gris", value: "gris", formType: FormTypeEnum.CHECKBOX },
    { formType: FormTypeEnum.DIVIDER },
    { name: "giraf", value: "giraf", formType: FormTypeEnum.RADIO_BUTTON },
    { name: "løve", value: "løve", formType: FormTypeEnum.RADIO_BUTTON },
    { name: "elefant", value: "elefant", formType: FormTypeEnum.RADIO_BUTTON },
    { name: "søløve", value: "søløve", formType: FormTypeEnum.RADIO_BUTTON },
  ];

  const updateIndex = () => {};

  const storyTitle = "Checkboxes and divider and radio buttons";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a more complicated test
      </StoryDescription>
      <AdvancedSearchDropdown
        indexName={storyTitle}
        indexTitle={storyTitle}
        menuItems={indices}
        updateIndex={updateIndex}
      />
    </div>
  );
}

export function AdvancedSearchDropdownRadioButtonsAndRadioLink() {
  const indices = [
    { name: "kat", value: "kat", formType: FormTypeEnum.RADIO_BUTTON },
    { name: "hund", value: "hund", formType: FormTypeEnum.RADIO_BUTTON },
    { name: "hest", value: "hest", formType: FormTypeEnum.RADIO_BUTTON },
    { name: "gris", value: "gris", formType: FormTypeEnum.RADIO_BUTTON },
    { name: "giraf", value: {}, formType: FormTypeEnum.RADIO_LINK },
  ];
  const updateIndex = () => {};

  const storyTitle = "Radio buttons and radio link";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a more complicated test
      </StoryDescription>
      <AdvancedSearchDropdown
        indexName={storyTitle}
        indexTitle={storyTitle}
        menuItems={indices}
        updateIndex={updateIndex}
      />
    </div>
  );
}

export function AdvancedSearchDropdownActionLink() {
  const indices = [
    {
      name: "I år (2023)",
      value: { lower: 2023, upper: 2024 },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: "Seneste to år",
      value: { lower: 2021, upper: 2024 },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: "Seneste tre år",

      value: { lower: 2020, upper: 2024 },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: "Seneste fem år",
      value: { lower: 2018, upper: 2024 },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: "Seneste 10 år",
      value: { lower: 2013, upper: 2024 },
      formType: FormTypeEnum.ACTION_LINK,
    },
    {
      name: "container",
      value: {},
      formType: FormTypeEnum.ACTION_LINK_CONTAINER,
    },
  ];

  const updateIndex = () => {};

  const storyTitle = "Action Link";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a more complicated test
      </StoryDescription>
      <AdvancedSearchDropdown
        indexName={storyTitle}
        indexTitle={storyTitle}
        menuItems={indices}
        updateIndex={updateIndex}
      />
    </div>
  );
}
