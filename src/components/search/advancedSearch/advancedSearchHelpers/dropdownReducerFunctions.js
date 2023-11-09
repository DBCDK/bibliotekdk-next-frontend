import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";
import isEmpty from "lodash/isEmpty";

export function initializeMenuItem(menuItem) {
  return {
    ...menuItem,
    ...(FormTypeEnum.CHECKBOX === menuItem?.formType && {
      isSelected: false,
    }),
    ...(FormTypeEnum.RADIO_BUTTON === menuItem?.formType && {
      isSelected: false,
    }),
    ...(FormTypeEnum.RADIO_LINK === menuItem?.formType && {
      isSelected: false,
    }),
  };
}

function toggleMenuItem(itemUpdate, currentMenuItem) {
  const radioLinkNonEmptyValues = Object.values(itemUpdate.value).every(
    (val) => !isEmpty(val)
  );

  return {
    ...currentMenuItem,
    ...itemUpdate,
    ...(FormTypeEnum.CHECKBOX === itemUpdate?.formType && {
      isSelected: !itemUpdate?.isSelected,
    }),
    ...(FormTypeEnum.RADIO_BUTTON === itemUpdate?.formType && {
      isSelected: true,
    }),
    ...(FormTypeEnum.RADIO_LINK === itemUpdate?.formType && {
      isSelected: radioLinkNonEmptyValues,
    }),
  };
}

export function reducerForToggleMenuItemsState({
  currentMenuItems,
  itemUpdate,
}) {
  const nextItem = toggleMenuItem(
    itemUpdate,
    currentMenuItems.find((currentItem) => currentItem.name === itemUpdate.name)
  );

  return currentMenuItems?.map((currentItem) => {
    return currentItem.name === nextItem.name
      ? nextItem
      : [FormTypeEnum.RADIO_BUTTON, FormTypeEnum.RADIO_LINK].includes(
          currentItem?.formType
        )
      ? initializeMenuItem(currentItem)
      : currentItem;
  });
}
