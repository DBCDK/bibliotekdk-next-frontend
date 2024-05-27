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
import CombinedSearch from "@/components/search/advancedSearch/combinedSearch/CombinedSearch";

import Accordion, { Item } from "@/components/base/accordion";
import { unixToFormatedDate } from "@/lib/utils";
import Link from "@/components/base/link";
import { useModal } from "@/components/_modal";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import Button from "@/components/base/button";
import { openLoginModal } from "@/components/_modal/pages/login/utils";
import useBreakpoint from "@/components/hooks/useBreakpoint";

function SavedItemRow({ item, index, checked, onSelect, expanded, ...props }) {
  const formatedDate = unixToFormatedDate(item.unixtimestamp);
  const { deleteSearches } = useSavedSearches();
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs";

  if (isMobile) {
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

        <div className={styles.mobilePreview}>
          {item?.name ? (
            <Text className={styles.searchPreview} type="text2">
              {item?.name}
            </Text>
          ) : !isEmpty(item?.fieldSearch) ? (
            <div>
              <FormatFieldSearchIndexes fieldsearch={item.fieldSearch} />
            </div>
          ) : (
            <Text className={styles.searchPreview} type="text2">
              {item?.cql}
            </Text>
          )}
          <Text type="text2">
            {`${item.hitcount} ${Translate({
              context: "search",
              label: "results",
            }).toLowerCase()}`}{" "}
          </Text>
        </div>
        <Icon
          className={cx(styles.accordionIcon, {
            [styles.accordionExpanded]: expanded,
            [styles.accordionCollapsed]: !expanded,
          })}
          size={3}
          src={`${expanded ? "collapseCircle" : "expand"}.svg`}
        />
      </div>
    );
  }

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

      <Text type="text2">{formatedDate}</Text>
      {item?.name ? (
        <Text className={styles.searchPreview} type="text2">
          {item?.name}
        </Text>
      ) : !isEmpty(item?.fieldSearch) ? (
        <div>
          <FormatFieldSearchIndexes fieldsearch={item.fieldSearch} />
        </div>
      ) : (
        <Text className={styles.searchPreview} type="text2">
          {item?.cql}
        </Text>
      )}
      <Text type="text2">{item.hitcount} </Text>
      <Icon
        className={styles.removeItemIcon}
        size={3}
        src={`trash-2.svg`}
        onClick={(e) => {
          e.stopPropagation();
          if (item?.id) {
            deleteSearches({ idsToDelete: [item.id] });
          }
        }}
      />
      <Icon
        className={cx(styles.accordionIcon, {
          [styles.accordionExpanded]: expanded,
          [styles.accordionCollapsed]: !expanded,
        })}
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
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs";

  const [showCombinedSearch, setShowCombinedSearch] = useState(false);

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
  const onDeleteSelected = async () => {
    //filter for checked items and map for ids to delete
    const idsToDelete = savedSearches
      ?.filter((item) => checkboxList.includes(item.id) && item.id)
      .map((item) => item.id);
    await deleteSearches({ idsToDelete });
    //uncheck deleted items
    setCheckboxList(checkboxList.filter((id) => !idsToDelete.includes(id)));
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
      {isMobile ? (
        <>
          <div className={styles.titleAndActionHeader}>
            <Title type="title3" className={styles.title}>
              {Translate({ context: "suggester", label: "historyTitle" })}
            </Title>
            <HistoryHeaderActions
              checkedObjects={checkedObjects} //TODO REMOVE??
              deleteSelected={onDeleteSelected}
              checked={
                savedSearches?.length === checkboxList?.length &&
                checkboxList?.length > 0
              }
              partiallyChecked={checkboxList?.length > 0}
              disabled={!isAuthenticated || savedSearches?.length === 0}
              setAllChecked={setAllChecked}
              setShowCombinedSearch={setShowCombinedSearch}
            />
          </div>
          <SearchHistoryNavigation />
          {showCombinedSearch && (
            <CombinedSearch
              cancelCombinedSearch={() => setShowCombinedSearch(false)}
              queries={checkedObjects}
            />
          )}
        </>
      ) : (
        <>
          <Title type="title3" className={styles.title}>
            {Translate({ context: "suggester", label: "historyTitle" })}
          </Title>
          <SearchHistoryNavigation />
          {showCombinedSearch ? (
            <CombinedSearch
              cancelCombinedSearch={() => setShowCombinedSearch(false)}
              queries={checkedObjects}
            />
          ) : (
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
              setShowCombinedSearch={setShowCombinedSearch}
            />
          )}
        </>
      )}
      <div className={styles.tableContainer}>
        <div
          className={cx(styles.tableHeader, {
            [styles.tableHeaderBorder]:
              !isAuthenticated || savedSearches?.length === 0,
          })}
        >
          <div />
          <Text type="text4">
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
            {savedSearches?.map((item, index) => {
              const formatedDate = unixToFormatedDate(item.unixtimestamp);
              return (
                <Item
                  dataCy={`accordion-item-${index}`}
                  className={styles.accordionContainer}
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
                      <Text type="text2" tag="span">
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
                    {isMobile && (
                      <div className={styles.mobileContent}>
                        <Text type="text2">{formatedDate}</Text>

                        <Icon
                          className={styles.removeItemIcon}
                          size={3}
                          src={`trash-2.svg`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item?.id) {
                              deleteSearches({ idsToDelete: [item.id] });
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </Item>
              );
            })}
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
