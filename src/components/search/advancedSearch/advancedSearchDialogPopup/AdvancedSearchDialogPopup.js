import { DialogChecklistBase } from "@/components/search/advancedSearch/advancedSearchHelpers/dialogChecklistBase/DialogChecklistBase";
import StatefulDialog from "@/components/base/statefulDialog/StatefulDialog";
import { useEffect, useReducer } from "react";

import {
  initializeMenuItem,
  reducerForToggleMenuItemsState,
} from "@/components/search/advancedSearch/advancedSearchHelpers/dropdownReducerFunctions";

export default function AdvancedSearchDialogPopup({
  menuItems,
  indexName,
  updateIndex,
}) {
  menuItems = menuItems.map(initializeMenuItem);
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

  return (
    <StatefulDialog title={indexName}>
      <DialogChecklistBase
        items={menuItemsState}
        toggleMenuItemsState={toggleMenuItemsState}
      />
    </StatefulDialog>
  );
}
