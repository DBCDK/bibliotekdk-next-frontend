import { StoryDescription, StoryTitle } from "@/storybook";
import { DialogForPublicationYear } from "@/components/search/advancedSearch/advancedSearchHelpers/dialogForPublicationYear/DialogForPublicationYear";
import {
  initializeMenuItem,
  useMenuItemsState,
} from "@/components/search/advancedSearch/advancedSearchHelpers/dropdownReducerFunctions";
import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";

const exportedObject = {
  title: "advancedSearch/DialogForPublicationYear",
};

export default exportedObject;

export function PublicationYearBase() {
  const items = [{ name: "gris", formType: FormTypeEnum.RADIO_LINK }];
  const updateIndex = () => {};

  let menuItems = items.map(initializeMenuItem);

  const { menuItemsState, toggleMenuItemsState } = useMenuItemsState(
    menuItems,
    updateIndex
  );

  const storyTitle = "Publication Year Base";

  return (
    <div>
      <StoryTitle>AdvancedSearchDropdown - {storyTitle}</StoryTitle>
      <StoryDescription>
        AdvancedSearch dropdown - {storyTitle}, aka a simple test
      </StoryDescription>
      <DialogForPublicationYear
        items={items}
        toggleMenuItemsState={toggleMenuItemsState}
      />
      <pre>{JSON.stringify(menuItemsState, null, 2)}</pre>
    </div>
  );
}
