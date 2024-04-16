import React, { useState } from "react";
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
import useSavedSearches from "../../../hooks/useSavedSearches";
import IconButton from "../../../base/iconButton/IconButton";

//Component to render facets
export function FormatedFacets({ facets, className }) {
  if (isEmpty(facets)) {
    return null;
  }

  const flatfilters = [];
  facets?.forEach((facet) => {
    facet.values.map((val) => {
      flatfilters.push({
        name: val.name,
      });
    });
  });

  return (
    <div className={cx(styles.historyFilters, className)}>
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
  );
}
function HistoryItem({ item, index, checked, onSelect }) {
  const router = useRouter();
  const breakpoint = useBreakpoint();
  const { saveSerach, deleteSearch, savedSearchKeys } = useSavedSearches();
  const { restartFacetsHook } = useFacets();
  const isSaved = savedSearchKeys?.includes(item.key);
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
        {/* move this to seperate component and reuse in combined search */}
        <FormatedFacets facets={item?.selectedFacets} />
      </div>
      <Text type="text2" className={styles.hitcount}>
        {item.hitcount}{" "}
        {breakpoint === "xs" &&
          Translate({ context: "search", label: "title" }).toLowerCase()}
      </Text>

      <Icon
        style={{ cursor: "pointer" }}
        size={3}
        src={`${isSaved ? "heart_filled" : "heart"}.svg`}
        onClick={() => {
          if (isSaved) {
            //remove search
            deleteSearch(item)
          } else {
            saveSerach(item);
          }
          isSaved;
        }}
      />
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
        {Translate({ context: "search", label: "combineSearch" })}
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
      <Text type="text4">
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
  const { savedSearches, saveSerach } = useSavedSearches();
  console.log("savedSearches", savedSearches);
  const [checkboxList, setCheckboxList] = useState([]);
  const [showCombinedSearch, setShowCombinedSearch] = useState(false);

  const breakpoint = useBreakpoint();
  const router = useRouter();

  /**
   * Set or unset ALL checkboxes in search history
   */
  const setAllChecked = () => {
    if (storedValue.length === checkboxList.length) {
      setCheckboxList([]);
    } else {
      setCheckboxList(storedValue.map((stored) => stored.key));
    }
  };

  /**
   * Delete selected entries in search history
   */
  const onDeleteSelected = () => {
    checkboxList.forEach((check) => {
      const historyItem = storedValue.find((stored) => stored.key === check);
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
              key={item.key}
              item={item}
              index={index}
              checked={
                checkboxList.findIndex((check) => check === item.key) !== -1
              }
              deleteSelected={onDeleteSelected}
              onSelect={onSelect}
            />
          ))}
      </>
    );
  };

  const checkedObjects = storedValue?.filter((obj) =>
    checkboxList.includes(obj.key)
  );
  // Check if the current path matches any button path
  const isButtonVisible = (path) => router.pathname === path;

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
      <div className={styles.navigationButtons}>
        <Link
          onClick={() => router.push("/avanceret/soegehistorik")}
          // href="/avanceret/soegehistorik"
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
          // href="/avanceret/gemte-soegninger"
          border={{
            top: false,
            bottom: {
              keepVisible: isButtonVisible("/avanceret/gemte-soegninger"),
            },
          }}
        >
          <Text type="text1" tag="span">
            Gemte søgninger{" "}
          </Text>
        </Link>
      </div>

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
