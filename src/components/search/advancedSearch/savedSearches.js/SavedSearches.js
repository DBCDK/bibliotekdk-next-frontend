import React, { useEffect, useRef, useState } from "react";
import useAdvancedSearchHistory, {
  getDateTime,
  getTimeStamp,
} from "@/components/hooks/useAdvancedSearchHistory";
import styles from "./SavedSearches.module.css";
import Text from "@/components/base/text";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import { FormatFieldSearchIndexes } from "@/components/search/advancedSearch/advancedSearchResult/topBar/TopBar";
import Link from "@/components/base/link/Link";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import Translate from "@/components/base/translate";
import Title from "@/components/base/title/Title";
import cx from "classnames";
import { cyKey } from "@/utils/trim";
import Icon from "@/components/base/icon/Icon";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import MenuDropdown from "@/components/base/dropdown/menuDropdown/MenuDropdown";
import { useFacets } from "@/components/search/advancedSearch/useFacets";
import Button from "@/components/base/button";
import CombinedSearch from "@/components/search/advancedSearch/combinedSearch/CombinedSearch";
import useSavedSearches from "../../../hooks/useSavedSearches";
import {
  FormatedFacets,
  HistoryHeaderActions,
} from "@/components/search/advancedSearch/advancedSearchHistory/AdvancedSearchHistory";
import Accordion, { Item } from "@/components/base/accordion";
import ExpandIcon from "@/components/base/animation/expand";

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
  const { saveSerach, deleteSearch, savedSearchKeys } = useSavedSearches();
  const { restartFacetsHook } = useFacets();
  const isSaved = true; //if an element is shown here it means it is saved//savedSearchKeys?.includes(item.key);
  return (
    <div className={styles.savedItemRow} {...props}>
      <div
        onClick={(e) => {
          console.log("checkbox on change!!!!");
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
          //   onChange={(e) => {
          //     console.log("checkbox on change!!!!");
          //     e.stopPropagation(); // Prevent the accordion from expanding
          //     e.preventDefault();
          //     onSelect(item, e);
          //   }}
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
          console.log("on click!!");
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
  const breakpoint = useBreakpoint();
  const router = useRouter();
  const { saveSerach, deleteSearch, savedSearchKeys, savedSearches } =
    useSavedSearches();
  const [checkboxList, setCheckboxList] = useState([]);
  /**
   * Set or unset ALL checkboxes in search history
   */
  const setAllChecked = () => {
    if (savedSearches.length === checkboxList.length) {
      setCheckboxList([]);
    } else {
      setCheckboxList(savedSearches.map((stored) => stored.key));
    }
  };

  /**
   * Delete selected entries in search history
   */
  const onDeleteSelected = () => {
    checkboxList.forEach((check) => {
      const savedItem = savedSearches.find((stored) => stored.key === check);
      savedItem && deleteSearch(savedItem);
      //remove item from checklist too
      onSelect(savedItem, false);
    });
  };
  const isButtonVisible = (path) => router.pathname === path;

  const checkedObjects = savedSearches?.filter((obj) =>
    checkboxList.includes(obj.key)
  );
  console.log("checkedObjects", checkedObjects);
  console.log("savedSearches", savedSearches);
  /**
   * Add/remove item in list when selected/deselected
   * * @param item
   * @param item
   * @param selected
   *  The checkbox component (components/base/forms/checkbox) returns if it has been
   *  selected or not
   */
  const onSelect = (item, selected = false) => {
    console.log("inside onSelect", item);
    // if select is FALSE it has been deselected on gui
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
    console.log("newCheckList", newCheckList);
    setCheckboxList(newCheckList);
  };
  console.log("checkboxList", checkboxList);
  return (
    <div className={styles.container}>
      <Title
        type="title3"
        data-cy="advanced-search-search-history"
        className={styles.title}
      >
        Søgehistorik
      </Title>
      <div className={styles.navigationButtons}>
        {/**TODO: export this to a seperate component? reuse from search history */}
        <Link
          onClick={() => router.push("/avanceret/soegehistorik")}
          border={{
            top: false,
            bottom: {
              keepVisible: isButtonVisible("/avanceret/soegehistorik"),
            },
          }}
        >
          <Text type="text1" tag="span">
            Seneste søgninger
          </Text>
        </Link>

        <Link
          onClick={() => router.push("/avanceret/gemte-soegninger")}
          border={{
            top: false,
            bottom: {
              keepVisible: isButtonVisible("/avanceret/gemte-soegninger"),
            },
          }}
        >
          <Text type="text1" tag="span">
            Gemte søgninger
          </Text>
        </Link>
      </div>
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
            [styles.tableHeaderBorder]: savedSearches.length === 0,
          })}
        >
          <Text>Dato</Text>
          <Text type="text4" className={styles.link}>
            {Translate({ context: "search", label: "yourSearch" })}
          </Text>
          <Text type="text4" className={styles.hitcount}>
            {Translate({ context: "search", label: "title" })}
          </Text>
        </div>
        {savedSearches?.length > 0 ? (
          <Accordion>
            {savedSearches?.map((item, index) => (
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
                    {!isEmpty(item?.fieldSearch) ? (
                      <FormatFieldSearchIndexes
                        fieldsearch={item.fieldSearch}
                      />
                    ) : (
                      <Text type="text2">{item?.cql}</Text>
                    )}
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

            <p></p>
            <p></p>
          </div>
        )}
      </div>
    </div>
  );
}
