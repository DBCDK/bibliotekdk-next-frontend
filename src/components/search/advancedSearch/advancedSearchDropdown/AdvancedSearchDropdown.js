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

import { useEffect, useId, useState } from "react";
import List from "@/components/base/forms/list";
import isEmpty from "lodash/isEmpty";
import { DialogForPublicationYear } from "@/components/search/advancedSearch/advancedSearchHelpers/dialogForPublicationYear/DialogForPublicationYear";
import {
  CheckboxItem,
  ClearBar,
  FormTypeEnum,
  RadioButtonItem,
  RadioLinkItem,
  SearchBar,
  Toggler,
  TogglerContent,
  YearRange,
} from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";
import {
  resetMenuItem,
  ToggleMenuItemsEnum,
  useMenuItemsState,
} from "@/components/search/advancedSearch/advancedSearchHelpers/dropdownReducerFunctions";
import styles from "./AdvancedSearchDropdown.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import cx from "classnames";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import Text from "@/components/base/text";

const specialFormTypes = new Set([FormTypeEnum.ACTION_LINK_CONTAINER]);

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

function toggleYearRange(toggleMenuItemsState, targetItem, valueItem) {
  const payload = {
    ...targetItem,
    value: {
      lower: `${valueItem.value.lower}`,
      upper: `${valueItem.value.upper}`,
    },
  };

  toggleMenuItemsState({
    type: ToggleMenuItemsEnum.UPDATE,
    payload: payload,
  });
}

export default function AdvancedSearchDropdown({
  indexTitle,
  indexName,
  indexPlaceholder,
  menuItems = [],
  updateIndex,
}) {
  const { fieldSearchFromUrl } = useAdvancedSearchContext();

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

  const { menuItemsState, toggleMenuItemsState } = useMenuItemsState(
    menuItems,
    updateIndex
  );

  useEffect(() => {
    toggleMenuItemsState({
      type: ToggleMenuItemsEnum.RESET,
      payload: menuItems,
    });
  }, [JSON.stringify(fieldSearchFromUrl.dropdownSearchIndices)]);

  const sortedMenuItemsState = [
    ...(!isEmpty(dropdownQuery)
      ? [...menuItemsState]
          .sort((a, b) => sorterForMenuItems(a, b, dropdownQuery))
          .filter((item) => ![FormTypeEnum.DIVIDER].includes(item.formType))
      : [...menuItemsState]),
  ];

  const hasSpecialFormTypes = menuItemsState.some((item) =>
    specialFormTypes.has(item.formType)
  );

  return (
    <Dropdown className={styles.nav_element}>
      <Toggler
        TogglerContent={() => (
          <TogglerContent
            menuItemsState={menuItemsState}
            indexName={indexName}
            indexPlaceholder={indexPlaceholder}
          />
        )}
        indexName={indexName}
        indexPlaceholder={indexPlaceholder}
        className={styles.toggler}
      />
      <Dropdown.Menu
        id={dropdownMenuId}
        className={styles.dropdown_items}
        tabIndex="-1"
      >
        {/* Search Bar - don't show if there is an ACTION_LINK_CONTAINER */}
        {!hasSpecialFormTypes && (
          <SearchBar
            id={inputId}
            value={dropdownQuery}
            indexTitle={indexTitle}
            onChange={(e) => setDropdownQuery(() => e.target.value)}
            onKeyDown={handleKeyDown}
            className={cx(styles.sticky_base_class, styles.search_bar)}
          />
        )}

        <List.Group
          id={listGroupId}
          enabled={true}
          label={indexName}
          disableGroupOutline={false}
          charCodeEvents={(e) => getCharCodeEvents(e)}
          className={styles.list_group}
        >
          {sortedMenuItemsState
            // Action_Link_Container is filtered away from List.Group
            //  to be added sticky to bottom of Dropdown.Menu
            .filter(
              (item) =>
                ![FormTypeEnum.ACTION_LINK_CONTAINER].includes(item.formType)
            )
            .map((item, index) => {
              function toggler() {
                toggleMenuItemsState({
                  type: ToggleMenuItemsEnum.UPDATE,
                  payload: item,
                });
              }

              if (item?.formType === FormTypeEnum.CHECKBOX) {
                return (
                  <List.Select
                    key={`${item.name}-${index}`}
                    onSelect={toggler}
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
                    onSelect={toggler}
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
                    onSelect={() => !isEmpty(item?.value) && toggler}
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
              } else if (item?.formType === FormTypeEnum.ACTION_LINK) {
                return (
                  <List.Select
                    key={index}
                    label={item.name}
                    onSelect={() =>
                      toggleYearRange(
                        toggleMenuItemsState,
                        menuItemsState.filter(
                          (item) =>
                            item.formType === FormTypeEnum.ACTION_LINK_CONTAINER
                        )?.[0],
                        item
                      )
                    }
                  >
                    <Text type="text3">{item.name}</Text>
                  </List.Select>
                );
              } else if (item?.formType === FormTypeEnum.DIVIDER) {
                return <List.Divider key={Math.random() + "-" + index} />;
              }
            })}
        </List.Group>

        {/* Only shown when there is an ACTION_LINK_CONTAINER */}
        {hasSpecialFormTypes && (
          <YearRange
            menuItemsState={menuItemsState}
            toggleMenuItemsState={toggleMenuItemsState}
            className={cx(styles.sticky_base_class, styles.range_bar)}
          />
        )}

        <ClearBar
          onClick={() =>
            toggleMenuItemsState({
              type: ToggleMenuItemsEnum.RESET,
              payload: [...menuItems.map((item) => resetMenuItem(item))],
            })
          }
          className={cx(styles.sticky_base_class, styles.clear_content_bar)}
        />
      </Dropdown.Menu>
    </Dropdown>
  );
}
