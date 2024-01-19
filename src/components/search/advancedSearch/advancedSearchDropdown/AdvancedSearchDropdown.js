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

import { useId, useState } from "react";
import List from "@/components/base/forms/list";
import isEmpty from "lodash/isEmpty";
import {
  CheckboxItem,
  ClearBar,
  FormTypeEnum,
  RadioButtonItem,
  SearchBar,
  Toggler,
  TogglerContent,
  YearRange,
} from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";
import styles from "./AdvancedSearchDropdown.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import cx from "classnames";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { getNameForActionLinkContainer } from "@/components/search/advancedSearch/advancedSearchHelpers/dummy__default_advanced_search_fields";

const specialFormTypes = new Set([FormTypeEnum.ACTION_LINK_CONTAINER]);

/**
 * If the dropdown has a search, and the searchQuery includes a dropdownItem
 * We give it text4 (meaning it is bolded)
 * @param dropdownQuery
 * @param item
 * @returns {false|{textType: string}}
 */
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
}) {
  const {
    getItemFromDropdownSearchIndices,
    getIsSelected,
    toggleIsSelected,
    dropdownSearchIndices,
    resetSingleIndex,
  } = useAdvancedSearchContext();

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

  const sortedMenuItems = [
    ...(!isEmpty(dropdownQuery)
      ? [...menuItems]
          .sort((a, b) => sorterForMenuItems(a, b, dropdownQuery))
          .filter((item) => ![FormTypeEnum.DIVIDER].includes(item.formType))
      : [...menuItems]),
  ];

  const hasSpecialFormTypes = menuItems.some((item) =>
    specialFormTypes.has(item.formType)
  );

  return (
    <Dropdown className={styles.nav_element}>
      <Toggler
        TogglerContent={() => (
          <TogglerContent
            menuItems={menuItems}
            selectedItems={
              dropdownSearchIndices?.find(
                (singleIndex) => singleIndex.searchIndex === indexName
              )?.value
            }
            dropdownSearchIndices={dropdownSearchIndices}
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
          {sortedMenuItems
            // Action_Link_Container is filtered away from List.Group
            //  to be added sticky to bottom of Dropdown.Menu
            .filter(
              (item) =>
                ![FormTypeEnum.ACTION_LINK_CONTAINER].includes(item.formType)
            )
            .map((item, index) => {
              function toggler() {
                toggleIsSelected(item);
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
                      getIsSelected={getIsSelected}
                      {...getTextType(dropdownQuery, item)}
                    />
                  </List.Select>
                );
              } else if (item?.formType === FormTypeEnum.RADIO_BUTTON) {
                return (
                  <List.Radio
                    key={`${item.name}-${index}`}
                    selected={getIsSelected(item)}
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
              } else if (item?.formType === FormTypeEnum.ACTION_LINK) {
                return (
                  <List.Select
                    key={index}
                    label={item.name}
                    onSelect={() => toggleIsSelected(item)}
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
            indexName={indexName}
            toggleIsSelected={toggleIsSelected}
            yearRangeItem={getItemFromDropdownSearchIndices(
              getNameForActionLinkContainer(
                FormTypeEnum.ACTION_LINK_CONTAINER,
                indexName
              ),
              indexName
            )}
            className={cx(styles.sticky_base_class, styles.range_bar)}
            placeholder={Translate({
              context: "advanced_search_dropdown",
              label: `range_placeholder_${indexName}`,
            })}
          />
        )}

        <ClearBar
          onClick={() => resetSingleIndex(indexName)}
          className={cx(styles.sticky_base_class, styles.clear_content_bar)}
        />
      </Dropdown.Menu>
    </Dropdown>
  );
}
