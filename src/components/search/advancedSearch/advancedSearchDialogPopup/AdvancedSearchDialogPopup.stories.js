import { StoryDescription, StoryTitle } from "@/storybook";
import AdvancedSearchDialogPopup from "@/components/search/advancedSearch/advancedSearchDialogPopup/AdvancedSearchDialogPopup";
import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";

const exportedObject = {
  title: "AdvancedSearch/AdvancedSearchDialogPopup",
};

export default exportedObject;

export function AdvancedSearchDialogPopupBase() {
  const items = [
    { name: "kat", value: "kat", formType: FormTypeEnum.CHECKBOX },
    { name: "hund", value: "hund", formType: FormTypeEnum.CHECKBOX },
    { name: "hest", value: "hest", formType: FormTypeEnum.CHECKBOX },
    { name: "gris", value: "gris", formType: FormTypeEnum.CHECKBOX },
  ];

  const updateIndex = () => {};

  const storyTitle = "Popup Dialog";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a simple test
      </StoryDescription>
      <AdvancedSearchDialogPopup
        indexName={storyTitle}
        menuItems={items}
        updateIndex={updateIndex}
      />
    </div>
  );
}
