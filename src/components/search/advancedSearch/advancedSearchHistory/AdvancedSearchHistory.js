import React, { useEffect, useMemo, useState } from "react";
import useSearchHistory, {
  getDateTime,
  getTimeStamp,
} from "@/components/hooks/useSearchHistory";
import styles from "./AdvancedSearchHistory.module.css";
import Text from "@/components/base/text";
import { Checkbox } from "@/components/base/forms/checkbox/Checkbox";
import { FormatFieldSearchIndexes } from "@/components/search/advancedSearch/topBar/TopBar";
import Link from "@/components/base/link/Link";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import Translate, { hasTranslation } from "@/components/base/translate";
import Title from "@/components/base/title/Title";
import cx from "classnames";
import { cyKey } from "@/utils/trim";
import Icon from "@/components/base/icon/Icon";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import MenuDropdown from "@/components/base/dropdown/menuDropdown/MenuDropdown";
import Button from "@/components/base/button";
import CombinedSearch from "@/components/search/advancedSearch/combinedSearch/CombinedSearch";
import { useSavedSearches } from "@/components/hooks/useSearchHistory";
import { useModal } from "@/components/_modal";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import Pagination from "@/components/search/pagination/Pagination";

//Component to render facets
export function FormatedFilters({ facets, quickFilters = [], className }) {
  if (isEmpty(facets) && isEmpty(quickFilters)) {
    return null;
  }
  const flatfilters = [];
  !isEmpty(facets) &&
    facets?.forEach((facet) => {
      facet?.values?.map((val) => {
        flatfilters.push({
          name: val.name,
        });
      });
    });

  !isEmpty(quickFilters) &&
    quickFilters?.forEach((quick) => flatfilters.push({ name: quick.value }));

  return (
    <div className={cx(styles.historyFilters, className)}>
      <Text tag="span" type="text1" className={styles.filterLabel}>
        {Translate({ context: "search", label: "history-filter-label" })}:
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

/**
 * Renders a clickable link based on search item details.
 * search history item
 * @param {object} item
 * @returns  {JSX.Element}
 */
export function SearchQueryDisplay({ item }) {
  const isSimple = item.mode === "simpel";
  const isAdvanced = !isSimple && !isEmpty(item.fieldSearch);
  const isCql = !isSimple && isEmpty(item.fieldSearch);

  const goToItemUrl = item?.goToItemUrl;

  return (
    <div className={styles.link}>
      <Text type="text4" tag="div" className={styles.searchType}>
        {item?.translations?.type}
      </Text>
      <Link
        onClick={(e) => {
          e.preventDefault();
          goToItemUrl(item);
        }}
      >
        {isSimple && <FormatSimpleSearch item={item} />}
        {isAdvanced && (
          <FormatFieldSearchIndexes fieldsearch={item.fieldSearch} />
        )}
        {isCql && <FormatCql item={item} />}
      </Link>
      {/* move this to seperate component and reuse in combined search */}
      <FormatedFilters
        facets={item?.selectedFacets}
        quickFilters={item.selectedQuickFilters}
      />
    </div>
  );
}
function FormatSimpleSearch({ item }) {
  const filters = useMemo(() => {
    let arr = [];
    if (item?.filters) {
      Object.values(item?.filters).forEach((filter) => {
        arr = [...arr, ...filter];
      });
    }
    return arr?.map((filter) =>
      hasTranslation({ context: "facets", label: "label-" + filter })
        ? Translate({ context: "facets", label: "label-" + filter })
        : filter
    );
  }, [item]);

  return (
    <>
      <Text type="text2">{item?.q?.all}</Text>
      {filters.length > 0 && (
        <>
          <Text type="text1" className={styles.inline}>
            {Translate({ context: "search", label: "history-filter-label" })}:
          </Text>{" "}
          <Text
            type="text2"
            className={`${styles.inline} ${styles.simplefilters}`}
          >
            {filters.join(", ")}
          </Text>
        </>
      )}
    </>
  );
}
function HistoryItem({ item, index, checked, onSelect, checkboxKey }) {
  const modal = useModal();
  const breakpoint = useBreakpoint();
  const { isAuthenticated } = useAuthentication();

  const { deleteSearches, useSavedSearchByCql } = useSavedSearches();
  //check if search has already been saved in userdata
  const { savedObject, mutate } = useSavedSearchByCql({ cql: item.key });

  //check user has saved the search item
  const isSaved = !!savedObject?.id;
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
      className={styles.table_row}
      data-cy={cyKey({
        name: `history-item`,
        prefix: "advanced-search",
      })}
    >
      <div className={styles.checkbox}>
        <Checkbox
          id={`select-item-${checkboxKey}`}
          tabIndex="-1"
          onChange={(e) => {
            onSelect(item, e);
          }}
          checked={checked}
          ariaLabelledBy={`select-item-${index}`}
          ariaLabel={`select-item-${index}`}
        />
      </div>

      <Text
        className={styles.timestamp}
        type="text2"
        title={getDateTime(item.unixtimestamp)}
      >
        {itemText()}
      </Text>
      <SearchQueryDisplay item={item} />
      <Text type="text2" className={styles.hitcount}>
        {item.hitcount}
        {breakpoint === "xs" && item.hitcount >= 0 && (
          <> {Translate({ context: "search", label: "title" }).toLowerCase()}</>
        )}
      </Text>

      {isAuthenticated && (
        <Text
          className={styles.saveSearch}
          type="text3"
          onClick={async () => {
            if (isSaved) {
              //remove search
              await deleteSearches({ idsToDelete: [savedObject?.id] });
              mutate();
            } else {
              //open save search modal
              modal.push("saveSearch", {
                item: item,
                onSaveDone: mutate,
              });
            }
          }}
        >
          <Icon
            className={styles.saveSearchIcon}
            size={3}
            src={`${isSaved ? "heart_filled" : "heart"}.svg`}
          />
        </Text>
      )}
    </div>
  );
}

function FormatCql({ item }) {
  return (
    <>
      <Text type="text2" className={styles.inline}>
        {item.cql}
      </Text>
    </>
  );
}

/**
 * Action header for advanced search history.
 * Has functionaluty to show combined search view + trigger the select all/remove buttons,
 * @returns
 */

export function HistoryHeaderActions({
  deleteSelected,
  partiallyChecked,
  disabled,
  setShowCombinedSearch,
  setAllChecked,
  checked,
  selectedCount,
  className,
}) {
  const breakpoint = useBreakpoint();

  const showCombineSearch = () => setShowCombinedSearch(true);

  const deleteSelectedLabel = Translate({
    context: "bookmark",
    label: "remove-selected",
  });
  const combineSearchLabel = Translate({
    context: "search",
    label: "combineSearch",
  });

  const MENUITEMS = [
    { child: deleteSelectedLabel, callback: deleteSelected },
    { child: combineSearchLabel, callback: showCombineSearch },
  ];

  if (breakpoint === "xs") {
    return (
      <div className={cx(styles.menuDropdown, className)}>
        <div className={styles.checkbox}>
          <Checkbox
            ariaLabel={Translate({ context: "bookmark", label: "select-all" })}
            onClick={setAllChecked}
            id="selectall"
            checked={checked}
            disabled={disabled}
            dataCy="advanced-search-history-selectall-checkbox"
          />
        </div>
        <Text
          tag="label"
          for="selectall"
          type="text3"
          className={styles.checkboxLabel}
        >
          {Translate({ context: "bookmark", label: "select-all" })}
        </Text>
        <div className={styles.menuDropdownContainer}>
          {" "}
          <MenuDropdown options={MENUITEMS} />{" "}
        </div>
      </div>
    );
  }

  const isDeleteDisabled = !partiallyChecked || disabled;

  return (
    <div className={cx(styles.actionheader)}>
      {selectedCount > 0 && (
        <Text type="text3">{`${selectedCount} ${Translate({
          context: "form",
          label: "icon-label-selected",
        })}`}</Text>
      )}
      <Button
        type="secondary"
        size="small"
        onClick={() => {
          deleteSelected();
        }}
        disabled={!partiallyChecked || disabled}
        className={styles.removeItemsButton}
      >
        {deleteSelectedLabel}
        <Icon
          src={isDeleteDisabled ? "close_grey.svg" : "close.svg"}
          size={{ w: 2, h: 2 }}
        />
      </Button>
      <Button
        type="primary"
        size="small"
        onClick={showCombineSearch}
        disabled={disabled}
      >
        {Translate({ context: "search", label: "combineSearch" })}
      </Button>
    </div>
  );
}

export function SearchHistoryNavigation() {
  const router = useRouter();
  const { hitcount } = useSavedSearches();
  const breakpoint = useBreakpoint();

  // Check if the current path matches any button url
  const isButtonVisible = (path) => router.pathname === path;

  return (
    <div className={styles.navigationButtons}>
      <Link
        onClick={() => router.push("/find/historik/seneste")}
        border={{
          top: false,
          bottom: {
            keepVisible: isButtonVisible("/find/historik/seneste"),
          },
        }}
      >
        <Title type="title5" tag="span">
          {Translate({
            context: "search",
            label:
              breakpoint === "xs"
                ? "advanced-search-history-latest-mobile"
                : "advanced-search-history-latest",
          })}
        </Title>
      </Link>
      <Link
        onClick={() => router.push("/find/historik/gemte")}
        border={{
          top: false,
          bottom: {
            keepVisible: isButtonVisible("/find/historik/gemte"),
          },
        }}
      >
        <Title
          type="title5"
          tag="span"
          dataCy="searchHistory-navigation-saved-search"
        >
          {Translate({
            context: "search",
            label:
              breakpoint === "xs"
                ? "advanced-search-saved-search-mobile"
                : "advanced-search-saved-search",
            vars: [hitcount ? String(hitcount) : "0"],
          })}
        </Title>
      </Link>
    </div>
  );
}
function HistoryHeader({ setAllChecked, checked, disabled, isAuthenticated }) {
  return (
    <div className={styles.table_header}>
      <div className={styles.checkbox}>
        <Checkbox
          ariaLabel="vælg alle"
          tabIndex="-1"
          onClick={setAllChecked}
          id="selectall"
          checked={checked}
          disabled={disabled}
          dataCy="advanced-search-history-selectall-checkbox"
        />
      </div>
      <Text type="text4" className={styles.timestamp}>
        {Translate({ context: "search", label: "timeForSearch" })}
      </Text>
      <Text type="text4" className={styles.link}>
        {Translate({ context: "search", label: "yourSearch" })}
      </Text>
      <Text type="text4" className={styles.hitcount}>
        {Translate({ context: "search", label: "title" })}
      </Text>
      {isAuthenticated && (
        <Text type="text4" className={styles.saveSearch}>
          {Translate({ context: "advanced_search_savedSearch", label: "save" })}
        </Text>
      )}
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
 * Split stored history into daily groups with labels
 * @param {Array} storedValues - Array of history items with unixtimestamp
 * @returns {Array} Array of objects with label and items
 */
function splitHistoryItems(storedValues) {
  if (!storedValues?.length) {
    return [];
  }

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Group items by specific days
  const groups = new Map();

  storedValues.forEach((item) => {
    const itemDate = new Date(item.unixtimestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Compare dates (not times) by setting time to 00:00:00
    const itemDateOnly = new Date(
      itemDate.getFullYear(),
      itemDate.getMonth(),
      itemDate.getDate()
    );
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    let groupKey;
    let dateLabel;
    let groupTimestamp;
    let isToday = false;

    if (itemDateOnly.getTime() === todayOnly.getTime()) {
      // Today
      groupKey = "today";
      dateLabel = Translate({ context: "search", label: "history-today" });
      groupTimestamp = now; // Use current time for today
      isToday = true;
    } else if (itemDateOnly.getTime() === yesterdayOnly.getTime()) {
      // Yesterday
      groupKey = "yesterday";
      dateLabel = Translate({ context: "search", label: "history-yesterday" });
      groupTimestamp = now - oneDay; // Use yesterday's timestamp
    } else {
      // Specific date - format as "24. feb 2024"
      const day = itemDate.getDate();
      const month = itemDate.toLocaleDateString("da-DK", { month: "short" });
      const year = itemDate.getFullYear();
      groupKey = `date-${itemDate.toDateString()}`;
      dateLabel = `${day}. ${month} ${year}`;
      groupTimestamp = item.unixtimestamp; // Use the item's timestamp
    }

    if (!groups.has(groupKey)) {
      groups.set(groupKey, {
        dateLabel,
        items: [],
        unixtimestamp: groupTimestamp,
        isToday,
      });
    }
    groups.get(groupKey).items.push(item);
  });

  // Convert Map to array and sort by timestamp (newest first)
  const result = Array.from(groups.values()).sort(
    (a, b) => b.unixtimestamp - a.unixtimestamp
  );

  return result;
}

export function AdvancedSearchHistory() {
  const { storedValue, deleteValue } = useSearchHistory();
  const [checkboxSet, setCheckboxSet] = useState(() => new Set());
  const [showCombinedSearch, setShowCombinedSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const breakpoint = useBreakpoint();
  const { isAuthenticated } = useAuthentication();

  const isMobile = breakpoint === "xs";
  const ITEMS_PER_PAGE = 10;

  const totalPages = useMemo(() => {
    const hitcount = storedValue?.length || 0;
    return Math.max(1, Math.ceil(hitcount / ITEMS_PER_PAGE));
  }, [storedValue]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, isMobile]);

  const pagedStoredValue = useMemo(() => {
    if (!Array.isArray(storedValue)) return [];
    if (isMobile) {
      // Mobile UX: "se mere" shows accumulated pages
      return storedValue.slice(0, currentPage * ITEMS_PER_PAGE);
    }
    // Desktop UX: traditional pages
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return storedValue.slice(start, start + ITEMS_PER_PAGE);
  }, [storedValue, currentPage, isMobile]);

  const onPageChange = (newPage) => {
    const clamped = Math.min(Math.max(1, newPage), totalPages);
    setCurrentPage(clamped);
  };

  /**
   * Set or unset ALL checkboxes in search history
   */
  const setAllChecked = () => {
    if (!pagedStoredValue?.length) {
      setCheckboxSet(new Set());
      return;
    }
    const visibleKeys = pagedStoredValue.map((stored) => stored.key);
    const allVisibleChecked = visibleKeys.every((k) => checkboxSet.has(k));
    setCheckboxSet((prev) => {
      const next = new Set(prev);
      if (allVisibleChecked) {
        visibleKeys.forEach((k) => next.delete(k));
      } else {
        visibleKeys.forEach((k) => next.add(k));
      }
      return next;
    });
  };

  /**
   * Delete selected entries in search history
   */
  const onDeleteSelected = () => {
    if (!storedValue?.length || checkboxSet.size === 0) {
      return;
    }
    const keysToDelete = Array.from(checkboxSet);
    keysToDelete.forEach((key) => {
      const item = storedValue.find((v) => v.key === key);
      item && deleteValue(item);
    });
    setCheckboxSet(new Set());
  };

  /**
   * Add/remove item in list when selected/deselected
   */
  const onSelect = (item, selected = false) => {
    if (!item?.key) return;
    setCheckboxSet((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(item.key);
      } else {
        next.delete(item.key);
      }
      return next;
    });
  };

  const splittedValues = splitHistoryItems(pagedStoredValue);

  const HistoryItemPerDay = ({ group, groupIndex }) => {
    return (
      <>
        {!group.isToday && group.dateLabel && group.items.length > 0 && (
          <Text type="text3" className={styles.itemsheader}>
            {group.dateLabel}
          </Text>
        )}
        {group.items.length > 0 &&
          group.items.map((item, index) => (
            <HistoryItem
              checkboxKey={`${groupIndex}-${index}`}
              key={item.key}
              item={item}
              index={index}
              checked={checkboxSet.has(item.key)}
              deleteSelected={onDeleteSelected}
              onSelect={onSelect}
            />
          ))}
      </>
    );
  };

  const checkedObjects = useMemo(() => {
    if (!storedValue?.length || checkboxSet.size === 0) return [];
    return storedValue.filter((obj) => checkboxSet.has(obj.key));
  }, [storedValue, checkboxSet]);

  return (
    <div className={styles.container}>
      <>
        <SearchHistoryNavigation />
        {showCombinedSearch ? (
          <CombinedSearch
            cancelCombinedSearch={() => setShowCombinedSearch(false)}
            queries={checkedObjects}
          />
        ) : (
          <HistoryHeaderActions
            deleteSelected={onDeleteSelected}
            setAllChecked={setAllChecked}
            checked={
              pagedStoredValue?.length > 0 &&
              pagedStoredValue.every((i) => checkboxSet.has(i.key))
            }
            partiallyChecked={checkboxSet.size > 0}
            disabled={storedValue?.length === 0}
            selectedCount={checkboxSet.size}
            checkedObjects={checkedObjects}
            showCombinedSearch={showCombinedSearch}
            setShowCombinedSearch={setShowCombinedSearch}
          />
        )}
      </>
      <div className={styles.table_container}>
        {breakpoint !== "xs" && (
          <HistoryHeader
            setAllChecked={setAllChecked}
            checked={
              pagedStoredValue?.length > 0 &&
              pagedStoredValue.every((i) => checkboxSet.has(i.key))
            }
            disabled={storedValue?.length === 0}
            isAuthenticated={isAuthenticated}
          />
        )}
        {/*// if there is no search history*/}
        {isEmpty(storedValue) || storedValue?.length < 1 ? (
          <EmptySearchHistory />
        ) : (
          // Render each time group
          splittedValues.map((group, groupIndex) => (
            <HistoryItemPerDay
              key={`history-group-${groupIndex}`}
              group={group}
              groupIndex={groupIndex}
            />
          ))
        )}
      </div>
      {storedValue?.length > 0 && totalPages > 1 && (
        <Pagination
          className={styles.pagination}
          numPages={totalPages}
          currentPage={currentPage}
          onChange={onPageChange}
        />
      )}
    </div>
  );
}
