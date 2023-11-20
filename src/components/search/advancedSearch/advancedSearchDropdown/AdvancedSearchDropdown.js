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

import { useEffect, useId, useReducer, useState } from "react";
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
import Dropdown from "react-bootstrap/Dropdown";
import Input from "@/components/base/forms/input";
import cx from "classnames";
import Translate from "@/components/base/translate";

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

function getTextType(dropdownQuery, item) {
  return (
    !isEmpty(dropdownQuery) &&
    item.name.toLowerCase().includes(dropdownQuery.toLowerCase()) && {
      textType: "text4",
    }
  );
}

function inFormType(formType) {
  return [FormTypeEnum.DIVIDER, FormTypeEnum.RADIO_LINK].includes(formType);
}

function sorterForMenuItems(a, b, dropdownQuery) {
  if (inFormType(a.formType)) {
    if (inFormType(b.formType)) {
      return 0;
    }
    return 1;
  } else if (inFormType(b.formType)) {
    return -1;
  } else {
    return (
      b?.name?.toLowerCase().includes(dropdownQuery.toLowerCase()) -
      a?.name?.toLowerCase().includes(dropdownQuery.toLowerCase())
    );
  }
}

export default function AdvancedSearchDropdown({
  indexTitle,
  indexName,
  indexPlaceholder,
  menuItems = [],
  updateIndex,
}) {
  const [dropdownQuery, setDropdownQuery] = useState("");

  const dropdownMenuId = useId();
  const listGroupId = useId();
  const inputId = useId();

  function handleKeyDown(e) {
    const currentElement = document?.activeElement;
    if (e.key === "ArrowDown" && currentElement?.id === inputId) {
      e.preventDefault();
      currentElement?.blur();
      document.getElementById(listGroupId).firstElementChild?.focus();
    }
  }

  function getCharCodeEvents(e) {
    return [
      [e.key === " ", () => e.preventDefault()],
      [
        e.key.length === 1 && e.key !== " ",
        () => {
          setDropdownQuery("");
          document.getElementById(inputId).focus();
          document
            .getElementById(dropdownMenuId)
            .scrollTo({ top: 0, behavior: "smooth" });
          return e;
        },
      ],
    ];
  }

  menuItems = menuItems.map(initializeMenuItem);

  const { menuItemsState, toggleMenuItemsState } = useMenuItemsState(
    menuItems,
    updateIndex
  );

  const sortedMenuItemsState = [
    ...(!isEmpty(dropdownQuery)
      ? [...menuItemsState]
          .sort((a, b) => sorterForMenuItems(a, b, dropdownQuery))
          .filter((item) => ![FormTypeEnum.DIVIDER].includes(item.formType))
      : [...menuItemsState]),
  ];

  return (
    <Dropdown className={styles.nav_element}>
      <Toggler
        indexName={indexName}
        indexPlaceholder={indexPlaceholder}
        className={styles.toggler}
      />
      <Dropdown.Menu
        id={dropdownMenuId}
        className={styles.dropdown_items}
        tabIndex="-1"
      >
        <Input
          id={inputId}
          value={dropdownQuery}
          className={cx(styles.sticky_search_bar)}
          placeholder={Translate({
            context: "advanced_search_dropdown",
            label: "search_dropdown",
            vars: [indexTitle.toLowerCase()],
          })}
          onChange={(e) => setDropdownQuery(() => e.target.value)}
          onKeyDown={handleKeyDown}
          overrideValueControl={true}
        />
        <List.Group
          id={listGroupId}
          enabled={true}
          label={indexName}
          disableGroupOutline={false}
          charCodeEvents={(e) => getCharCodeEvents(e)}
        >
          {sortedMenuItemsState.map((item, index) => {
            if (item?.formType === FormTypeEnum.CHECKBOX) {
              return (
                <List.Select
                  key={`${item.name}-${index}`}
                  onSelect={() => toggleMenuItemsState(item)}
                  label={item.name}
                >
                  <CheckboxItem
                    item={item}
                    {...getTextType(dropdownQuery, item)}
                  />
                </List.Select>
              );
            } else if (item?.formType === FormTypeEnum.RADIO_BUTTON) {
              return (
                <List.Radio
                  key={`${item.name}-${index}`}
                  selected={item?.isSelected}
                  moveItemRightOnFocus={true}
                  onSelect={() => toggleMenuItemsState(item)}
                  label={item.name}
                >
                  <RadioButtonItem
                    item={item}
                    {...getTextType(dropdownQuery, item)}
                  />
                </List.Radio>
              );
            } else if (item?.formType === FormTypeEnum.RADIO_LINK) {
              return (
                <List.Radio
                  key={`${item.name}-${index}`}
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
                    label={item.name}
                  />
                </List.Radio>
              );
            } else if (item?.formType === FormTypeEnum.DIVIDER) {
              return <List.Divider key={Math.random() + "-" + index} />;
            }
          })}
        </List.Group>
      </Dropdown.Menu>
    </Dropdown>
  );
}
