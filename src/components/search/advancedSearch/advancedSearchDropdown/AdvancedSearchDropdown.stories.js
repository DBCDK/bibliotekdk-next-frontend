import { StoryDescription, StoryTitle } from "@/storybook";
import AdvancedSearchDropdown from "@/components/search/advancedSearch/advancedSearchDropdown/AdvancedSearchDropdown";
import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";
import { getNameForActionLinkContainer } from "@/components/search/advancedSearch/advancedSearchHelpers/dummy__default_advanced_search_fields";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

const exportedObject = {
  title: "AdvancedSearch/AdvancedSearchDropdown",
};

export default exportedObject;

export function AdvancedSearchDropdownOnlyCheckboxes() {
  const storyTitle = "Only checkboxes";

  const indices = [
    {
      name: "kat",
      key: "kat",
      value: "kat",
      formType: FormTypeEnum.CHECKBOX,
      indexName: storyTitle,
    },
    {
      name: "hund",
      key: "hund",
      value: "hund",
      formType: FormTypeEnum.CHECKBOX,
      indexName: storyTitle,
    },
    {
      name: "hest",
      key: "hest",
      value: "hest",
      formType: FormTypeEnum.CHECKBOX,
      indexName: storyTitle,
    },
    {
      name: "gris",
      key: "gris",
      value: "gris",
      formType: FormTypeEnum.CHECKBOX,
      indexName: storyTitle,
    },
  ];

  const advancedSearchContext = useAdvancedSearchContext();

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a simple test
      </StoryDescription>
      <AdvancedSearchDropdown
        indexTitle={storyTitle}
        indexName={storyTitle}
        indexPlaceholder={storyTitle}
        menuItems={indices}
        advancedSearchContext={advancedSearchContext}
      />
    </div>
  );
}
export function AdvancedSearchDropdownOnlyRadioButtons() {
  const storyTitle = "Only radio buttons";

  const indices = [
    {
      name: "kat",
      key: "kat",
      value: "kat",
      formType: FormTypeEnum.RADIO_BUTTON,
      indexName: storyTitle,
    },
    {
      name: "hund",
      key: "hund",
      value: "hund",
      formType: FormTypeEnum.RADIO_BUTTON,
      indexName: storyTitle,
    },
    {
      name: "hest",
      key: "hest",
      value: "hest",
      formType: FormTypeEnum.RADIO_BUTTON,
      indexName: storyTitle,
    },
    {
      name: "gris",
      key: "gris",
      value: "gris",
      formType: FormTypeEnum.RADIO_BUTTON,
      indexName: storyTitle,
    },
  ];

  const advancedSearchContext = useAdvancedSearchContext();

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a simple test
      </StoryDescription>
      <AdvancedSearchDropdown
        indexTitle={storyTitle}
        indexName={storyTitle}
        indexPlaceholder={storyTitle}
        menuItems={indices}
        advancedSearchContext={advancedSearchContext}
      />
    </div>
  );
}

export function AdvancedSearchDropdownCheckboxesAndRadioButtons() {
  const storyTitle = "Checkboxes and radio buttons";

  const indices = [
    {
      name: "kat",
      key: "kat",
      value: "kat",
      formType: FormTypeEnum.CHECKBOX,
      indexName: storyTitle,
    },
    {
      name: "hund",
      key: "hund",
      value: "hund",
      formType: FormTypeEnum.CHECKBOX,
      indexName: storyTitle,
    },
    {
      name: "hest",
      key: "hest",
      value: "hest",
      formType: FormTypeEnum.CHECKBOX,
      indexName: storyTitle,
    },
    {
      name: "gris",
      key: "gris",
      value: "gris",
      formType: FormTypeEnum.CHECKBOX,
      indexName: storyTitle,
    },
    {
      name: "giraf",
      key: "giraf",
      value: "giraf",
      formType: FormTypeEnum.RADIO_BUTTON,
      indexName: storyTitle,
    },
    {
      name: "løve",
      key: "løve",
      value: "løve",
      formType: FormTypeEnum.RADIO_BUTTON,
      indexName: storyTitle,
    },
    {
      name: "elefant",
      key: "elefant",
      value: "elefant",
      formType: FormTypeEnum.RADIO_BUTTON,
      indexName: storyTitle,
    },
    {
      name: "søløve",
      key: "søløve",
      value: "søløve",
      formType: FormTypeEnum.RADIO_BUTTON,
      indexName: storyTitle,
    },
  ];

  const advancedSearchContext = useAdvancedSearchContext();

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a more complicated test
      </StoryDescription>
      <AdvancedSearchDropdown
        indexTitle={storyTitle}
        indexName={storyTitle}
        indexPlaceholder={storyTitle}
        menuItems={indices}
        advancedSearchContext={advancedSearchContext}
      />
    </div>
  );
}

export function AdvancedSearchDropdownCheckboxesAndDividerAndRadioButtons() {
  const storyTitle = "Checkboxes and divider and radio buttons";

  const indices = [
    {
      name: "kat",
      key: "kat",
      value: "kat",
      formType: FormTypeEnum.CHECKBOX,
      indexName: storyTitle,
    },
    {
      name: "hund",
      key: "hund",
      value: "hund",
      formType: FormTypeEnum.CHECKBOX,
      indexName: storyTitle,
    },
    {
      name: "hest",
      key: "hest",
      value: "hest",
      formType: FormTypeEnum.CHECKBOX,
      indexName: storyTitle,
    },
    {
      name: "gris",
      key: "gris",
      value: "gris",
      formType: FormTypeEnum.CHECKBOX,
      indexName: storyTitle,
    },
    { formType: FormTypeEnum.DIVIDER, indexName: storyTitle },
    {
      name: "giraf",
      key: "giraf",
      value: "giraf",
      formType: FormTypeEnum.RADIO_BUTTON,
      indexName: storyTitle,
    },
    {
      name: "løve",
      key: "løve",
      value: "løve",
      formType: FormTypeEnum.RADIO_BUTTON,
      indexName: storyTitle,
    },
    {
      name: "elefant",
      key: "elefant",
      value: "elefant",
      formType: FormTypeEnum.RADIO_BUTTON,
      indexName: storyTitle,
    },
    {
      name: "søløve",
      key: "søløve",
      value: "søløve",
      formType: FormTypeEnum.RADIO_BUTTON,
      indexName: storyTitle,
    },
  ];

  const advancedSearchContext = useAdvancedSearchContext();

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a more complicated test
      </StoryDescription>
      <AdvancedSearchDropdown
        indexTitle={storyTitle}
        indexName={storyTitle}
        indexPlaceholder={storyTitle}
        menuItems={indices}
        advancedSearchContext={advancedSearchContext}
      />
    </div>
  );
}

export function AdvancedSearchDropdownActionLink() {
  const storyTitle = "Action Link";
  const indices = [
    {
      name: "I år (2023)",
      key: "I år (2023)",
      value: { lower: 2023, upper: 2024 },
      formType: FormTypeEnum.ACTION_LINK,
      indexName: storyTitle,
    },
    {
      name: "Seneste to år",
      key: "Seneste to år",
      value: { lower: 2021, upper: 2024 },
      formType: FormTypeEnum.ACTION_LINK,
      indexName: storyTitle,
    },
    {
      name: "Seneste tre år",
      key: "Seneste tre år",

      value: { lower: 2020, upper: 2024 },
      formType: FormTypeEnum.ACTION_LINK,
      indexName: storyTitle,
    },
    {
      name: "Seneste fem år",
      key: "Seneste fem år",
      value: { lower: 2018, upper: 2024 },
      formType: FormTypeEnum.ACTION_LINK,
      indexName: storyTitle,
    },
    {
      name: "Seneste 10 år",
      key: "Seneste 10 år",
      value: { lower: 2013, upper: 2024 },
      formType: FormTypeEnum.ACTION_LINK,
      indexName: storyTitle,
    },
    {
      name: getNameForActionLinkContainer(
        FormTypeEnum.ACTION_LINK_CONTAINER,
        storyTitle
      ),
      key: "container",
      value: {},
      formType: FormTypeEnum.ACTION_LINK_CONTAINER,
      indexName: storyTitle,
    },
  ];

  const advancedSearchContext = useAdvancedSearchContext();

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a more complicated test
      </StoryDescription>
      <AdvancedSearchDropdown
        indexTitle={storyTitle}
        indexName={storyTitle}
        indexPlaceholder={storyTitle}
        menuItems={indices}
        advancedSearchContext={advancedSearchContext}
      />
    </div>
  );
}
