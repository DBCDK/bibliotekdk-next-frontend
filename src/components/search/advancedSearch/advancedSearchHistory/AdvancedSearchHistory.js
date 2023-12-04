import React, { useState } from "react";
import useAdvancedSearchHistory from "@/components/hooks/useAdvancedSearchHistory";
import styles from "./AdvancedSearchHistory.module.css";
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

function HistoryItem({ item, index, checked, onSelect }) {
  const router = useRouter();

  const goToItemUrl = (item) => {
    if (item.fieldSearch) {
      const query = {
        fieldSearch: JSON.stringify(item.fieldSearch),
      };
      router.replace({
        pathname: router.pathname,
        query: query,
      });
    } else if (item.cql) {
      router.replace({ pathname: router.pathname, query: { cql: item.cql } });
    }
  };

  return (
    <div
      className={cx(styles.row, styles.grid)}
      data-cy={cyKey({
        name: `history-item`,
        prefix: "advanced-search",
      })}
    >
      <Checkbox
        id={`select-item-${index}`}
        tabIndex="-1"
        onChange={(e) => {
          onSelect(item, e);
        }}
        checked={checked}
        ariaLabelledBy={`select-item-${index}`}
        ariaLabel={`select-item-${index}`}
        className={styles.checkbox}
      />
      <Text type="text3">{item.timestamp}</Text>
      <div className={styles.link}>
        <Link
          onClick={(e) => {
            e.preventDefault();
            goToItemUrl(item);
          }}
        >
          {!isEmpty(item.fieldSearch) ? (
            <FormatFieldSearchIndexes fieldsearch={item.fieldSearch} />
          ) : (
            <FormatCql item={item} />
          )}
        </Link>
      </div>
      <Text type="text3" className={styles.hitcount}>
        {item.hitcount}
      </Text>
    </div>
  );
}

function FormatCql({ item }) {
  return (
    <>
      <Text type="text4" className={styles.inline}>
        {Translate({ context: "search", label: "cqlsearchlabel" })}:
      </Text>
      <Text type="text3" className={styles.inline}>
        {item.cql}
      </Text>
    </>
  );
}

function HistoryHeaderActions({ setAllChecked, deleteSelected }) {
  return (
    <div className={cx(styles.actionheader)}>
      <Checkbox
        ariaLabelledBy={`selectall`}
        ariaLabel="vælg alle"
        tabIndex="-1"
        onChange={setAllChecked}
        id="selectall"
        className={styles.checkbox}
      />
      <label htmlFor="selectall">
        <Text type="text3">
          {Translate({ context: "bookmark", label: "select-all" })}
        </Text>
      </label>
      <div onClick={deleteSelected} className={styles.action}>
        <Text type="text3">
          {Translate({ context: "bookmark", label: "remove-selected" })}
        </Text>
      </div>
    </div>
  );
}

function HistoryHeader() {
  return (
    <div className={cx(styles.header, styles.grid)}>
      <div>&nbsp;</div>
      <Text type="text4">
        {/*{@TODO translations}*/}
        {Translate({ context: "search", label: "timeForSearch" })}
      </Text>
      <Text type="text4">
        {Translate({ context: "search", label: "yourSearch" })}
      </Text>
      <Text type="text4">
        {Translate({ context: "search", label: "title" })}
      </Text>
    </div>
  );
}

export function AdvancedSearchHistory() {
  const { storedValue, deleteValue } = useAdvancedSearchHistory();
  const [checkboxList, setCheckboxList] = useState([]);
  /**
   * Set or unset ALL checkboxes in search history
   * @param e
   *  if the checkbox is selected or not
   */
  const setAllChecked = (e) => {
    if (e) {
      // full list
      setCheckboxList(storedValue.map((stored) => stored.cql));
    } else {
      // empty list
      setCheckboxList([]);
    }
  };

  /**
   * Delete selected entries in search history
   */
  const onDeleteSelected = () => {
    checkboxList.forEach((check) => {
      const historyItem = storedValue.find((stored) => stored.cql === check);
      historyItem && deleteValue(historyItem);
    });
  };

  /**
   * Add/remove item in list when selected/deselected
   * * @param item
   * @param selected
   *  The checkbox component (components/base/forms/checkbox) returns if it has been
   *  selected or not
   */
  const onSelect = (item, selected = false) => {
    // if select is FALSE it has been deselected on gui
    const newCheckList = checkboxList;
    // if item is already in checkboxlist -> remove
    const checkindex = checkboxList.findIndex((check) => check === item.cql);
    if (checkindex !== -1) {
      // item found in list - if deselected remove it
      if (!selected) {
        newCheckList.splice(checkindex, 1);
      }
    }
    // if not -> add it to list .. if selected
    else if (selected) {
      newCheckList.push(item.cql);
    }
    setCheckboxList(newCheckList);
  };

  return (
    <>
      <Title
        type="title3"
        data-cy="advanced-search-search-history"
        className={styles.title}
      >
        {Translate({ context: "suggester", label: "historyTitle" })}
      </Title>
      <HistoryHeaderActions
        deleteSelected={onDeleteSelected}
        setAllChecked={setAllChecked}
      />
      <HistoryHeader />
      {storedValue?.map((item, index) => {
        return (
          <div key={index}>
            <HistoryItem
              // checkboxList={checkboxList}
              item={item}
              index={index}
              checked={
                checkboxList.findIndex((check) => check === item.cql) !== -1
              }
              deleteSelected={onDeleteSelected}
              onSelect={onSelect}
            />
          </div>
        );
      })}
    </>
  );
}
