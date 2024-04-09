import React, { useEffect, useState } from "react";
import useAdvancedSearchHistory, {
  getDateTime,
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
import { useFacets } from "@/components/search/advancedSearch/useFacets";
import Button from "@/components/base/button";
import CombinedSearch from "@/components/search/advancedSearch/combinedSearch/CombinedSearch";

function HistoryItem({ item, index, checked, onSelect }) {
  const router = useRouter();
  const breakpoint = useBreakpoint();

  const { restartFacetsHook } = useFacets();

  const goToItemUrl = (item) => {
    // restart the useFacets hook - this is a 'new' search
    restartFacetsHook();
    if (!isEmpty(item.fieldSearch)) {
      const query = {
        fieldSearch: JSON.stringify(item.fieldSearch),
        facets: JSON.stringify(item.selectedFacets || "[]"),
      };
      router.push({
        pathname: "/avanceret/",
        query: query,
      });
    } else if (item.cql) {
      router.push({
        pathname: "/avanceret/",
        query: {
          cql: item.cql,
          facets: JSON.stringify(item.selectedFacets || "[]"),
        },
      });
    }
  };

  const timestamp = item.unixtimestamp
    ? getTimeStamp(item.unixtimestamp)
    : item.timestamp;

  const flatfilters = [];
  item?.selectedFacets?.forEach((facet) =>
    facet.values.map((val) =>
      flatfilters.push({
        name: val.name,
      })
    )
  );

  const itemText = () => {
    return Translate({
      context: "search",
      label: "timestamp",
      vars: [timestamp],
    });
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
      <Text
        className={styles.timestamp}
        type="text2"
        title={getDateTime(item.unixtimestamp)}
      >
        {itemText()}
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
        {!isEmpty(item.selectedFacets) && (
          <div className={styles.historyFilters}>
            <Text tag="span" type="text1">
              {Translate({ context: "search", label: "filters" })} :
            </Text>
            {flatfilters.map((val, index) => (
              <Text
                tag="span"
                type="text2"
                key={`${val.name}-${index}`}
                className={styles.filteritem}
              >
                {`${val.name} ${flatfilters.length > index + 1 ? "," : ""}`}
              </Text>
            ))}
          </div>
        )}
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
  onCombineSearch,
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
        onClick={setAllChecked}
        id="selectall"
        className={styles.checkbox}
        checked={checked}
        disabled={disabled}
        dataCy="advanced-search-history-selectall-checkbox"
      />
      <label htmlFor="selectall">
        <Text type="text3" className={cx(styles.action, styles.lessergap)}>
          {selectAllLabel}
        </Text>
      </label>

      <Button type="secondary" size="small" onClick={onCombineSearch}>
        Kombiner søgninger
      </Button>
      <Link
        className={cx(styles.removeItems, {
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

/**
 * split stored history in 3 - Today, Yesterday and older :)
 * @param storedValues
 */
function splitHistoryItems(storedValues) {
  const oneday = 24 * 60 * 60 * 1000;
  const today = [];
  const yesterday = [];
  const older = [];

  storedValues?.map((val) => {
    if (Date.now() - val.unixtimestamp < oneday) {
      today.push(val);
    } else if (Date.now() - val.unixtimestamp < oneday * 2) {
      yesterday.push(val);
    } else {
      older.push(val);
    }
  });

  return { today: today, yesterday: yesterday, older: older };
}

export function AdvancedSearchHistory() {
  const { storedValue, deleteValue } = useAdvancedSearchHistory();
  const [checkboxList, setCheckboxList] = useState([]);
  const [showCombinedSearch, setShowCombinedSearch] = useState(false);
  console.log("checkboxList", checkboxList);
  console.log("storedValue", storedValue);

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
      //remove item from checklist too
      onSelect(historyItem, false);
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

  const splittedValues = splitHistoryItems(storedValue);

  const HistoryItemPerDay = ({ title, items }) => {
    return (
      <>
        {title && items.length > 0 && (
          <Text type="text4" className={styles.itemsheader}>
            {title}
          </Text>
        )}
        {items.length > 0 &&
          items.map((item, index) => (
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
          ))}
      </>
    );
  };

  const checkedObjects = storedValue?.filter((obj) =>
    checkboxList.includes(obj.cql)
  );

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
      {showCombinedSearch ? (
        <CombinedSearch
          cancelCombinedSearch={() => setShowCombinedSearch(false)}
          queries={checkedObjects}
        />
      ) : (
        <HistoryHeaderActions
          deleteSelected={onDeleteSelected}
          setAllChecked={setAllChecked}
          checked={storedValue?.length === checkboxList?.length}
          partiallyChecked={checkboxList?.length > 0}
          disabled={storedValue?.length === 0}
          onCombineSearch={() => setShowCombinedSearch(true)}
        />
      )}

      <div className={styles.table_grid}>
        {breakpoint !== "xs" && <HistoryHeader />}
        {/*// if there is no search history*/}
        {isEmpty(storedValue) || storedValue?.length < 1 ? (
          <EmptySearchHistory />
        ) : (
          // today
          <>
            <HistoryItemPerDay
              key="search-history-today"
              items={splittedValues.today}
              title={Translate({ context: "search", label: "history-today" })}
            />
            <HistoryItemPerDay
              key="search-history-yesterday"
              items={splittedValues.yesterday}
              title={Translate({
                context: "search",
                label: "history-yesterday",
              })}
            />
            <HistoryItemPerDay
              key="search-history-older"
              items={splittedValues.older}
            />
          </>
        )}
      </div>
    </div>
  );
}
