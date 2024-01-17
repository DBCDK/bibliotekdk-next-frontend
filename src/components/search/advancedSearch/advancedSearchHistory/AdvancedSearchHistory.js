import React, { useState } from "react";
import useAdvancedSearchHistory, {
  getTimeStamp,
} from "@/components/hooks/useAdvancedSearchHistory";
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
import Icon from "@/components/base/icon/Icon";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import MenuDropdown from "@/components/base/dropdown/menuDropdown/MenuDropdown";

function HistoryItem({ item, index, checked, onSelect }) {
  const router = useRouter();
  const breakpoint = useBreakpoint();

  const goToItemUrl = (item) => {
    if (item.fieldSearch) {
      const query = {
        fieldSearch: JSON.stringify(item.fieldSearch),
      };
      router.push({
        pathname: "/avanceret/",
        query: query,
      });
    } else if (item.cql) {
      router.push({ pathname: "/avanceret/", query: { cql: item.cql } });
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
      <Text className={styles.timestamp} type="text2">
        {item.unixtimestamp ? getTimeStamp(item.unixtimestamp) : item.timestamp}
      </Text>
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
      <Text type="text2" className={styles.hitcount}>
        {item.hitcount}{" "}
        {breakpoint === "xs" &&
          Translate({ context: "search", label: "title" }).toLowerCase()}
      </Text>
    </div>
  );
}

function FormatCql({ item }) {
  return (
    <>
      <Text type="text1" className={styles.inline}>
        {Translate({ context: "search", label: "cqlsearchlabel" })}:
      </Text>
      <Text type="text2" className={styles.inline}>
        {item.cql}
      </Text>
    </>
  );
}

function HistoryHeaderActions({
  setAllChecked,
  deleteSelected,
  checked,
  partiallyChecked,
  disabled,
}) {
  const breakpoint = useBreakpoint();

  const selectAllLabel = Translate({
    context: "bookmark",
    label: "select-all",
  });
  const deleteSelectedLabel = Translate({
    context: "bookmark",
    label: "remove-selected",
  });

  const MENUITEMS = [
    { child: selectAllLabel, callback: setAllChecked },
    { child: deleteSelectedLabel, callback: deleteSelected },
  ];

  if (breakpoint === "xs") {
    return (
      <div className={cx(styles.actionheader)}>
        <MenuDropdown options={MENUITEMS} isLeftAlligned={true} />
      </div>
    );
  }

  return (
    <div className={cx(styles.actionheader)}>
      <Checkbox
        ariaLabelledBy={`selectall`}
        ariaLabel="vælg alle"
        tabIndex="-1"
        onChange={setAllChecked}
        id="selectall"
        className={styles.checkbox}
        checked={checked}
        disabled={disabled}
      />
      <label htmlFor="selectall">
        <Text type="text3" className={cx(styles.action, styles.lessergap)}>
          {selectAllLabel}
        </Text>
      </label>

      <Link
        className={cx(styles.flex, {
          [styles.disabled_link]: !partiallyChecked || disabled,
        })}
        border={{
          top: false,
          bottom: { keepVisible: partiallyChecked && !disabled },
        }}
        disabled={!partiallyChecked || disabled}
        onClick={(e) => {
          e.preventDefault();
          deleteSelected();
        }}
      >
        <Text type="text3">{deleteSelectedLabel}</Text>
        <Icon
          src="close_grey.svg"
          size={{ w: 2, h: 2 }}
          className={styles.icon}
        />
      </Link>
    </div>
  );
}

function HistoryHeader() {
  return (
    <div className={cx(styles.header, styles.grid)}>
      <div className={styles.checkbox}> </div>
      <Text type="text4" className={styles.timestamp}>
        {/*{@TODO translations}*/}
        {Translate({ context: "search", label: "timeForSearch" })}
      </Text>
      <Text type="text4" className={styles.link}>
        {Translate({ context: "search", label: "yourSearch" })}
      </Text>
      <Text type="text4" className={styles.hitcount}>
        {Translate({ context: "search", label: "title" })}
      </Text>
    </div>
  );
}

function EmptySearchHistory() {
  return (
    <div className={styles.emptysearchpage}>
      <div className={cx(styles.actionheader)}>
        <Text type="text2" className={styles.inline}>
          {Translate({
            context: "search",
            label: "advanced-empty-search-history",
          })}
        </Text>
      </div>
    </div>
  );
}

export function AdvancedSearchHistory() {
  const { storedValue, deleteValue } = useAdvancedSearchHistory();
  const [checkboxList, setCheckboxList] = useState([]);

  const breakpoint = useBreakpoint();

  /**
   * Set or unset ALL checkboxes in search history
   */
  const setAllChecked = () => {
    if (storedValue.length === checkboxList.length) {
      setCheckboxList([]);
    } else {
      setCheckboxList(storedValue.map((stored) => stored.cql));
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
   * @param item
   * @param selected
   *  The checkbox component (components/base/forms/checkbox) returns if it has been
   *  selected or not
   */
  const onSelect = (item, selected = false) => {
    // if select is FALSE it has been deselected on gui
    const newCheckList = [...checkboxList];
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
    <div className={styles.container}>
      <Title
        type="title3"
        data-cy="advanced-search-search-history"
        className={styles.title}
      >
        {Translate({
          context: "search",
          label: "advanced-search-history-latest",
        })}
      </Title>
      <HistoryHeaderActions
        deleteSelected={onDeleteSelected}
        setAllChecked={setAllChecked}
        checked={storedValue?.length === checkboxList?.length}
        partiallyChecked={checkboxList?.length > 0}
        disabled={storedValue?.length === 0}
      />
      <div className={styles.table_grid}>
        {breakpoint !== "xs" && <HistoryHeader />}
        {/*// if there is no search history*/}
        {isEmpty(storedValue) || storedValue?.length < 1 ? (
          <EmptySearchHistory />
        ) : (
          storedValue?.map((item, index) => {
            return (
              <HistoryItem
                key={item.cql}
                item={item}
                index={index}
                checked={
                  checkboxList.findIndex((check) => check === item.cql) !== -1
                }
                deleteSelected={onDeleteSelected}
                onSelect={onSelect}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
