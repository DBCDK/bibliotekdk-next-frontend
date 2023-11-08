/**
 * @file
 * This is a custom component.
 * We use it to create a dropdown for advanced search
 *
 * This component handles the state of the dropdown
 * Given a list of menuItems, it will dynamically generate the
 * menuItemsState, and then when the menuItems are selected, changed, etc.
 * the menuItemsState updates, and the updateIndex reducer sends the
 * data back to the context.
 */

import { useEffect, useReducer, useState } from "react";
import List from "@/components/base/forms/list";
import isEmpty from "lodash/isEmpty";
import { DialogForPublicationYear } from "@/components/search/advancedSearch/advancedSearchHelpers/dialogForPublicationYear/DialogForPublicationYear";
import {
  CheckboxItem,
  FormTypeEnum,
  RadioButtonItem,
  RadioLinkItem,
  Toggler,
} from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";
import {
  initializeMenuItem,
  reducerForToggleMenuItemsState,
} from "@/components/search/advancedSearch/advancedSearchHelpers/dropdownReducerFunctions";
import styles from "./AdvancedSearchDropdown.module.css";

export function useMenuItemsState(menuItems, updateIndex) {
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

  return { menuItemsState, toggleMenuItemsState };
}

export default function AdvancedSearchDropdown({
  indexName,
  indexPlaceholder,
  menuItems = [],
  updateIndex,
}) {
  menuItems = menuItems.map(initializeMenuItem);

  const [expandMenu, setExpandMenu] = useState(false);

  const { menuItemsState, toggleMenuItemsState } = useMenuItemsState(
    menuItems,
    updateIndex
  );

  return (
    <nav className={styles.nav_element}>
      <Toggler
        setExpandMenu={setExpandMenu}
        expandMenu={expandMenu}
        indexName={indexName}
        indexPlaceholder={indexPlaceholder}
      />
      {expandMenu && (
        <List.Group
          enabled={true}
          label={indexName}
          className={styles.dropdown_items}
          disableGroupOutline={false}
        >
          {menuItemsState.map((item) => {
            if (item?.formType === FormTypeEnum.CHECKBOX) {
              return (
                <List.Select
                  key={item.name}
                  onSelect={() => toggleMenuItemsState(item)}
                  label={item.name}
                >
                  <CheckboxItem item={item} />
                </List.Select>
              );
            } else if (item?.formType === FormTypeEnum.RADIO_BUTTON) {
              return (
                <List.Radio
                  key={item.name}
                  selected={item?.isSelected}
                  moveItemRightOnFocus={true}
                  onSelect={() => toggleMenuItemsState(item)}
                  label={item.name}
                >
                  <RadioButtonItem item={item} />
                </List.Radio>
              );
            } else if (item?.formType === FormTypeEnum.RADIO_LINK) {
              return (
                <List.Radio
                  key={item.name}
                  selected={item?.isSelected}
                  moveItemRightOnFocus={true}
                  onSelect={() =>
                    !isEmpty(item?.value) && toggleMenuItemsState(item)
                  }
                  label={item.name}
                >
                  <RadioLinkItem
                    item={item}
                    toggleMenuItemsState={toggleMenuItemsState}
                    DialogBox={DialogForPublicationYear}
                  />
                </List.Radio>
              );
            } else if (item?.formType === FormTypeEnum.DIVIDER) {
              return <List.Divider key={Math.random()} />;
            }
          })}
        </List.Group>
      )}
    </nav>
  );
}
