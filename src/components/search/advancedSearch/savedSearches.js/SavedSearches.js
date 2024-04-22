import React, { useState } from "react";

import styles from "./SavedSearches.module.css";
import Text from "@/components/base/text";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import { FormatFieldSearchIndexes } from "@/components/search/advancedSearch/advancedSearchResult/topBar/TopBar";
import isEmpty from "lodash/isEmpty";
import Translate from "@/components/base/translate";
import Title from "@/components/base/title/Title";
import cx from "classnames";
import Icon from "@/components/base/icon/Icon";
import useSavedSearches from "../../../hooks/useSavedSearches";
import {
  SearchHistoryNavigation,
  HistoryHeaderActions,
  SearchQueryDisplay,
} from "@/components/search/advancedSearch/advancedSearchHistory/AdvancedSearchHistory";
import Accordion, { Item } from "@/components/base/accordion";

const formatDate = (unixtimestamp) => {
  const date = new Date(unixtimestamp);

  const monthNames = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day}. ${month} ${year}`;
};
function SavedItemRow({ item, index, checked, onSelect, expanded, ...props }) {
  const formatedDate = formatDate(item.unixtimestamp);
  const { saveSerach, deleteSearch } = useSavedSearches();
  const isSaved = true; //if an element is shown here it means it is saved//savedSearchKeys?.includes(item.key);
  return (
    <div className={styles.savedItemRow} {...props}>
      <div
        onClick={(e) => {
          e.stopPropagation(); // Prevent the accordion from expanding
          e.preventDefault();
          onSelect(item, !checked);
        }}
      >
        <Checkbox
          id={`select-item-${index}`}
          tabIndex="-1"
          ariaLabelledBy={`select-item-${index}`}
          ariaLabel={`select-item-${index}`}
          checked={checked}
          onMouseDown={(e) => {
            e.stopPropagation(); // Stop the mouse down event from propagating
          }}
          className={styles.checkbox}
        />
      </div>

      <Text>{formatedDate}</Text>
      <Text className={styles.searchPreview}>
        {!isEmpty(item?.fieldSearch) ? (
          <div>
            <FormatFieldSearchIndexes fieldsearch={item.fieldSearch} />
          </div>
        ) : (
          <Text type="text2">{item?.cql}</Text>
        )}
      </Text>
      <Text>{item.hitcount} </Text>
      <Icon
        style={{ cursor: "pointer" }}
        size={3}
        src={`${isSaved ? "heart_filled" : "heart"}.svg`}
        onClick={() => {
          if (isSaved) {
            //remove search
            deleteSearch(item);
          } else {
            saveSerach(item);
          }
        }}
      />
      <Icon
        className={`${styles.accordionIcon} ${
          expanded ? styles.accordionExpanded : styles.accordionCollapsed
        }`}
        size={3}
        src={`${expanded ? "collapseCircle" : "expand"}.svg`}
      />
    </div>
  );
}

export function SavedSearches() {
  const { deleteSearch, savedSearches } = useSavedSearches();
  const [checkboxList, setCheckboxList] = useState([]);
  /**
   * Set or unset ALL checkboxes in saved search table
   */
  const setAllChecked = () => {
    if (savedSearches?.length === checkboxList.length) {
      setCheckboxList([]);
    } else {
      setCheckboxList(savedSearches.map((stored) => stored.key));
    }
  };

  /**
   * Delete selected entries in saved search table
   */
  const onDeleteSelected = () => {
    checkboxList.forEach((check) => {
      const savedItem = savedSearches.find((stored) => stored.key === check);
      savedItem && deleteSearch(savedItem);
      //remove item from checklist too
      onSelect(savedItem, false);
    });
  };

  const checkedObjects = savedSearches?.filter((obj) =>
    checkboxList.includes(obj.key)
  );

  /**
   * Add/remove item in list when selected/deselected
   * * @param item
   * @param item
   * @param selected
   *  The checkbox component (components/base/forms/checkbox) returns if it has been
   *  selected or not
   */
  const onSelect = (item, selected = false) => {
    const newCheckList = [...checkboxList];
    // if item is already in checkboxlist -> remove
    const checkindex = checkboxList.findIndex((check) => check === item.key);
    if (checkindex !== -1) {
      // item found in list - if deselected remove it
      if (!selected) {
        newCheckList.splice(checkindex, 1);
      }
    }
    // if not -> add it to list .. if selected
    else if (selected) {
      newCheckList.push(item.key);
    }
    setCheckboxList(newCheckList);
  };

  return (
    <div className={styles.container}>
      <Title
        type="title3"
        data-cy="advanced-search-search-history"
        className={styles.title}
      >
        {Translate({ context: "suggester", label: "historyTitle" })}
      </Title>
      <SearchHistoryNavigation />
      <HistoryHeaderActions
        checkedObjects={checkedObjects}
        deleteSelected={onDeleteSelected}
        checked={
          savedSearches?.length === checkboxList?.length &&
          checkboxList?.length > 0
        }
        partiallyChecked={checkboxList?.length > 0}
        disabled={savedSearches?.length === 0}
        setAllChecked={setAllChecked}
      />
      <div className={styles.tableContainer}>
        <div
          className={cx(styles.tableHeader, {
            [styles.tableHeaderBorder]: savedSearches?.length === 0,
          })}
        >
          <Text type="text4" className={styles.hitcount}>
            {Translate({ context: "search", label: "date" })}
          </Text>
          <Text type="text4">
            {Translate({ context: "search", label: "search" })}
          </Text>
          <Text type="text4" className={styles.link}>
            {Translate({ context: "search", label: "results" })}
          </Text>
        </div>
        {savedSearches?.length > 0 ? (
          <Accordion>
            {savedSearches?.map((item) => (
              <Item
                CustomHeaderCompnent={(props) => (
                  <SavedItemRow
                    {...props}
                    onSelect={onSelect}
                    item={item}
                    checked={
                      checkboxList.findIndex((check) => check === item.key) !==
                      -1
                    }
                  />
                )}
                key={item.key}
                eventKey={item.key}
              >
                <div className={styles.accordionContentContainer}>
                  <div className={styles.accordionContent}>
                    <SearchQueryDisplay item={item} />
                  </div>
                </div>
              </Item>
            ))}
          </Accordion>
        ) : (
          <div className={styles.emptyListMessage}>
            {
              <Text type="text2">
                {Translate({
                  context: "advanced_search_savedSearch",
                  label: "emptyListMessage1",
                })}
              </Text>
            }
            {
              <Text type="text1" className={styles.empyListTitle}>
                {Translate({
                  context: "advanced_search_savedSearch",
                  label: "emptyListMessage2",
                })}
              </Text>
            }
            {
              <Text type="text2">
                {Translate({
                  context: "advanced_search_savedSearch",
                  label: "emptyListMessage3",
                })}
              </Text>
            }
            {
              <Text type="text2">
                {Translate({
                  context: "advanced_search_savedSearch",
                  label: "emptyListMessage4",
                })}
              </Text>
            }
          </div>
        )}
      </div>
    </div>
  );
}
