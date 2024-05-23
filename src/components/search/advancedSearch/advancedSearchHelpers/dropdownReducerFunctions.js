import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";
import isEmpty from "lodash/isEmpty";
import { useEffect, useReducer } from "react";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import { DropdownReducerEnum } from "@/components/search/advancedSearch/useDropdownSearchIndices";

export function resetMenuItem(menuItem) {
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
      value: {},
    }),
    ...(FormTypeEnum.ACTION_LINK_CONTAINER === menuItem?.formType && {
      isSelected: false,
      value: {},
    }),
  };
}

export function initializeMenuItem(menuItem) {
  return {
    ...menuItem,
    ...(FormTypeEnum.CHECKBOX === menuItem?.formType && {
      isSelected: menuItem?.isSelected || false,
    }),
    ...(FormTypeEnum.RADIO_BUTTON === menuItem?.formType && {
      isSelected: menuItem?.isSelected || false,
    }),
    ...(FormTypeEnum.RADIO_LINK === menuItem?.formType && {
      isSelected: menuItem?.isSelected || false,
    }),
    ...(FormTypeEnum.ACTION_LINK_CONTAINER === menuItem?.formType && {
      isSelected: menuItem?.isSelected || false,
    }),
  };
}

function toggleMenuItem(itemUpdate, currentMenuItem) {
  const radioLinkNonEmptyValues = Object.values(itemUpdate.value).every(
    (val) => !isEmpty(val)
  );
  const actionLinkAnyNonEmptyValue = Object.values(itemUpdate.value).some(
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
    ...(FormTypeEnum.ACTION_LINK_CONTAINER === itemUpdate?.formType && {
      isSelected: actionLinkAnyNonEmptyValue,
    }),
  };
}

export const ToggleMenuItemsEnum = Object.freeze({
  RESET: "RESET",
  UPDATE: "UPDATE",
});

export function reducerForToggleMenuItemsState({ currentMenuItems, action }) {
  const { type, payload } = action;

  switch (type) {
    case ToggleMenuItemsEnum.RESET:
      return payload;
    case ToggleMenuItemsEnum.UPDATE:
      const nextItem = toggleMenuItem(
        payload,
        currentMenuItems.find(
          (currentItem) => currentItem.name === payload.name
        )
      );

      return currentMenuItems?.map((currentItem) => {
        return currentItem.name === nextItem.name
          ? nextItem
          : [FormTypeEnum.RADIO_BUTTON, FormTypeEnum.RADIO_LINK].includes(
              currentItem?.formType
            ) &&
            [FormTypeEnum.RADIO_BUTTON, FormTypeEnum.RADIO_LINK].includes(
              nextItem?.formType
            )
          ? resetMenuItem(currentItem)
          : currentItem;
      });
    default:
      return currentMenuItems;
  }
}

export function useMenuItemsState(menuItems, updateIndex) {
  const { resetMenuItemsEvent } = useAdvancedSearchContext();

  // console.log(menuItems, "MENU ITEMS");
  const [menuItemsState, toggleMenuItemsState] = useReducer(
    (currentMenuItems, action) =>
      reducerForToggleMenuItemsState({
        currentMenuItems: currentMenuItems,
        action: { payload: action.payload, type: action.type },
      }),
    menuItems,
    undefined
  );

  useEffect(() => {
    toggleMenuItemsState({
      type: ToggleMenuItemsEnum.RESET,
      payload: menuItems,
    });
  }, [menuItems.length]);

  useEffect(() => {
    function resetOnResetSearch() {
      toggleMenuItemsState({
        type: ToggleMenuItemsEnum.RESET,
        payload: menuItems,
      });
    }

    window.addEventListener(resetMenuItemsEvent, resetOnResetSearch);

    return () => {
      window.removeEventListener(resetMenuItemsEvent, resetOnResetSearch);
    };
  }, []);

  useEffect(() => {
    updateIndex(menuItemsState);
  }, [JSON.stringify(menuItemsState)]);

  return { menuItemsState, toggleMenuItemsState };
}
