import { StoryDescription, StoryTitle } from "@/storybook";
import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";
import { DialogChecklistBase } from "@/components/search/advancedSearch/advancedSearchHelpers/dialogChecklistBase/DialogChecklistBase";
import { useEffect, useReducer } from "react";
import {
  initializeMenuItem,
  reducerForToggleMenuItemsState,
} from "@/components/search/advancedSearch/advancedSearchHelpers/dropdownReducerFunctions";

const exportedObject = {
  title: "AdvancedSearch/DialogChecklistBase",
};

export default exportedObject;

export function DialogPopupBase() {
  const items = [
    { name: "kat", value: "kat", formType: FormTypeEnum.CHECKBOX },
    { name: "hund", value: "hund", formType: FormTypeEnum.CHECKBOX },
    { name: "hest", value: "hest", formType: FormTypeEnum.CHECKBOX },
    { name: "gris", value: "gris", formType: FormTypeEnum.CHECKBOX },
    { formType: FormTypeEnum.DIVIDER },
    { name: "giraf", value: "giraf", formType: FormTypeEnum.CHECKBOX },
    { name: "løve", value: "løve", formType: FormTypeEnum.CHECKBOX },
    { name: "elefant", value: "elefant", formType: FormTypeEnum.CHECKBOX },
    { name: "søløve", value: "søløve", formType: FormTypeEnum.CHECKBOX },
  ];

  const updateIndex = () => {};

  let menuItems = items.map(initializeMenuItem);
  const [menuItemsState, toggleMenuItemsState] = useReducer(
    (currentMenuItems, itemUpdate) =>
      reducerForToggleMenuItemsState({
        currentMenuItems: currentMenuItems,
        itemUpdate: itemUpdate,
      }),
    menuItems,
    undefined
  );

  useEffect(() => {
    updateIndex(menuItemsState);
  }, [JSON.stringify(menuItemsState)]);

  const storyTitle = "Popup Dialog";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a simple test
      </StoryDescription>
      <DialogChecklistBase
        items={menuItemsState}
        toggleMenuItemsState={toggleMenuItemsState}
      />
      <pre>{JSON.stringify(menuItemsState, null, 2)}</pre>
    </div>
  );
}
