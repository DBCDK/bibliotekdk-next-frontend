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
import useAuthentication from "@/components/hooks/user/useAuthentication";
import Button from "@/components/base/button";
import { openLoginModal } from "@/components/_modal/pages/login/utils";

function SavedItemRow({ item, index, checked, onSelect, expanded, ...props }) {
  const formatedDate = unixToFormatedDate(item.unixtimestamp);
  const { deleteSearches } = useSavedSearches();

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
          id={`select-item-${item.id}`}
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
        onClick={(e) => {
          e.stopPropagation();
          if (item?.id) {
            console.log("item?.id", item?.id);
            //deleteSavedSearches({ idsToDelete: [item.id], userDataMutation });
            deleteSearches({ idsToDelete: [item.id] });
            //todo mutate refresh
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

export default function SavedSearches() {
  const { deleteSearches, savedSearches } = useSavedSearches();
  const [checkboxList, setCheckboxList] = useState([]);
  const modal = useModal();
  const { isAuthenticated } = useAuthentication();

  /**
   * Set or unset ALL checkboxes in saved search table
   */
  const setAllChecked = () => {
    if (savedSearches?.length === checkboxList.length) {
      setCheckboxList([]);
    } else {
      setCheckboxList(savedSearches.map((stored) => stored.id));
    }
  };

  /**
   * Delete selected entries in saved search table
   */
  const onDeleteSelected = () => {
    //filter for checked items and map for ids to delete
    const idsToDelete = savedSearches
      ?.filter((item) => checkboxList.includes(item.id) && item.id)
      .map((item) => item.id);
    deleteSearches({ idsToDelete });
  };

  const checkedObjects = savedSearches?.filter((obj) =>
    checkboxList.includes(obj.id)
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
    const checkindex = checkboxList.findIndex((check) => check === item.id);
    if (checkindex !== -1) {
      // item found in list - if deselected remove it
      if (!selected) {
        newCheckList.splice(checkindex, 1);
      }
    }
    // if not -> add it to list .. if selected
    else if (selected) {
      newCheckList.push(item.id);
    }
    setCheckboxList(newCheckList);
  };

  return (
    <div className={styles.container}>
      <Title type="title3" className={styles.title}>
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
        disabled={!isAuthenticated || savedSearches?.length === 0}
        setAllChecked={setAllChecked}
      />
      <div className={styles.tableContainer}>
        <div
          className={cx(styles.newTableHeader, {
            [styles.tableHeaderBorder]:
              !isAuthenticated || savedSearches?.length === 0,
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
        {!isAuthenticated && (
          <div>
            <Text type="text2" className={styles.loginText}>
              {Translate({
                context: "advanced_search_savedSearch",
                label: "loginText",
              })}
            </Text>

            <Button
              className={styles.loginButton}
              dataCy="saved-search-login-button"
              size="large"
              type="primary"
              onClick={() => openLoginModal({ modal })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.keyCode === 13)
                  openLoginModal({ modal });
              }}
            >
              {Translate({
                context: "header",
                label: "login",
              })}
            </Button>
          </div>
        )}
        {savedSearches?.length > 0 && isAuthenticated ? (
          <Accordion dataCy="saved-searches-accordion">
            {savedSearches?.map((item, index) => (
              <Item
                //              dataCy="accordion-item"
                dataCy={`accordion-item-${index}`}
                CustomHeaderCompnent={(props) => (
                  <SavedItemRow
                    {...props}
                    index={index}
                    onSelect={onSelect}
                    item={item}
                    checked={
                      checkboxList.findIndex((check) => check === item.id) !==
                      -1
                    }
                  />
                )}
                key={item.id}
                eventKey={item.id}
              >
                <div
                  className={styles.accordionContentContainer}
                  data-cy={`accordion-expanded-content-${index + 1}`}
                >
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
                        {Translate({ context: "search", label: "editName" })}
                      </Link>
                    </Text>
                    <div />
                    <div />
                  </div>
                </div>
              </Item>
            ))}
          </Accordion>
        ) : (
          isAuthenticated && (
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
          )
        )}
      </div>
    </div>
  );
}
