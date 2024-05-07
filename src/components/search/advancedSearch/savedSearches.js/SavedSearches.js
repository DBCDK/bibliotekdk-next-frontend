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
import useSavedSearches from "@/components/hooks/useSavedSearches";
import {
  SearchHistoryNavigation,
  HistoryHeaderActions,
  SearchQueryDisplay,
} from "@/components/search/advancedSearch/advancedSearchHistory/AdvancedSearchHistory";
import Accordion, { Item } from "@/components/base/accordion";
import { unixToFormatedDate } from "@/lib/utils";
import Link from "@/components/base/link";
import { useModal } from "@/components/_modal";

function SavedItemRow({ item, index, checked, onSelect, expanded, ...props }) {
  const formatedDate = unixToFormatedDate(item.unixtimestamp);
  const { deleteSearch } = useSavedSearches();

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
        />
      </div>

      <Text className={styles.date}>{formatedDate}</Text>
      <Text className={styles.searchPreview}>
        {item?.name ? (
          <Text type="text2">{item?.name}</Text>
        ) : !isEmpty(item?.fieldSearch) ? (
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
        src={`heart_filled.svg`}
        onClick={() => {
          deleteSearch(item);
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

export default function SavedSearches() {
  const { deleteSearch, savedSearches } = useSavedSearches();
  const [checkboxList, setCheckboxList] = useState([]);
  const modal = useModal();

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
          className={cx(styles.newTableHeader, {
            [styles.tableHeaderBorder]: savedSearches?.length === 0,
          })}
        >
          <div />
          <Text type="text4" className={styles.date}>
            {Translate({ context: "search", label: "date" })}
          </Text>
          <Text type="text4">
            {Translate({ context: "search", label: "search" })}
          </Text>
          <Text type="text4">
            {Translate({ context: "search", label: "results" })}
          </Text>
        </div>
        {savedSearches?.length > 0 ? (
          <Accordion>
            {savedSearches?.map((item, index) => (
              <Item
                CustomHeaderCompnent={(props) => (
                  <SavedItemRow
                    {...props}
                    index={index}
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
                    <div />
                    <div />
                    <div>
                      <SearchQueryDisplay item={item} />
                    </div>
                    <Text type="text3" tag="span">
                      <Link
                        onClick={() => {
                          //show edit name modal
                          modal.push("saveSearch", {
                            item: item,
                            fromEditSearch: true,
                          });
                        }}
                        border={{
                          top: false,
                          bottom: {
                            keepVisible: true,
                          },
                        }}
                      >
                        {Translate({ context: "search", label: "editSearch" })}
                      </Link>
                    </Text>{" "}
                    <div />
                    <div />
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
