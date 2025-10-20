/**
 * @file - Hook for advanced search history - localstorage
 */

import { getSessionStorageItem, setSessionStorageItem } from "@/lib/utils";
import useSWR from "swr";
import { getLanguage } from "@/components/base/translate";
import { useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import Translate from "@/components/base/translate";
import { hasTranslation } from "@/components/base/translate";
import { useFacets } from "../search/advancedSearch/useFacets";
import { useQuickFilters } from "../search/advancedSearch/useQuickFilters";
import { useRouter } from "next/router";
import { useAdvancedSearchContext } from "../search/advancedSearch/advancedSearchContext";
import {
  convertStateToCql,
  getCqlAndFacetsQuery,
} from "../search/advancedSearch/utils";
import { useData } from "@/lib/api/api";

import * as searchFragments from "@/lib/api/search.fragments";
import { hitcount as advancedHitcount } from "@/lib/api/complexSearch.fragments";
import useQ from "./useQ";
import useFilters from "./useFilters";

const KEY = "advanced-search-history";

/**
 * Get a date on a stored search history object
 */
export function getTimeStamp(now) {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
  };
  const stamp = new Date(now).toLocaleTimeString("en-GB", options);
  // remove the " AM/PM" part
  return stamp.replace("AM", "").replace("PM", "").replace(":", ".").trim();
}

function getSearchValueString(item) {
  // Generate searchValue string based on content
  let searchValue = "";

  // Simple search: q.all
  if (item?.q?.all) {
    searchValue += item.q.all;
  }
  const filters = [];
  if (item?.filters) {
    Object.values(item?.filters).forEach((value) => {
      value?.forEach((v) => {
        filters.push(v);
      });
    });
  }
  item?.selectedQuickFilters?.forEach((quickFilter) => {
    filters.push(quickFilter.value);
  });
  item?.selectedFacets?.forEach((facet) => {
    facet?.values?.forEach((v) => {
      filters.push(v.name);
    });
  });
  item?.fieldSearch?.inputFields?.forEach((inputField) => {
    const indexTranslation = hasTranslation({
      context: "search",
      label: `advanced-dropdown-${
        inputField?.label || inputField?.searchIndex
      }`,
    })
      ? Translate({
          context: "search",
          label: `advanced-dropdown-${
            inputField?.label || inputField?.searchIndex
          }`,
        })
      : inputField?.label || inputField?.searchIndex;
    searchValue += indexTranslation + ": " + inputField.value;

    // searchValue += `${indexTranslation}: "${inputField.value}"`;
  });
  if (!item?.fieldSearch?.inputFields?.length && item?.cql) {
    searchValue += item.cql;
  }
  if (filters.length > 0) {
    searchValue += ` (${Translate({
      context: "search",
      label: "history-filter-label",
    })}: ${filters
      .map((f) =>
        hasTranslation({ context: "facets", label: "label-" + f })
          ? Translate({ context: "facets", label: "label-" + f })
          : f
      )
      .join(", ")})`;
  }
  return searchValue;
}

/**
 * Get a date on a stored search history object
 */
export function getDateTime(now) {
  const options = {
    hourCycle: "h24",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const stamp = new Date(now).toLocaleTimeString(
    getLanguage() === "EN_GB" ? "en-GB" : "da-DK",
    options
  );
  // remove the " AM/PM" part
  return stamp.replace("AM", "").replace("PM", "").replace(":", ".").trim();
}

function getUnixTimeStamp() {
  return new Date().getTime();
}

export function useCurrentSearchHistoryItem() {
  const { getQuery } = useQ();
  const q = getQuery();
  const { filters } = useFilters();
  const router = useRouter();
  const advCtx = useAdvancedSearchContext();
  const { selectedFacets } = useFacets();
  const { selectedQuickFilters } = useQuickFilters();

  const mode = router?.query?.mode;

  const isSimple = mode === "simpel";
  const isAdvanced = !isSimple;

  const hasAdvancedSearch = !isEmpty(advCtx?.fieldSearchFromUrl);
  const hasCqlSearch = !isEmpty(advCtx?.cqlFromUrl);
  const cql = advCtx?.cqlFromUrl;
  const fieldSearch = advCtx?.fieldSearchFromUrl;
  const simpleRes = useData(
    isSimple && searchFragments.hitcount({ q, filters })
  );

  const cqlAndFacetsQuery = getCqlAndFacetsQuery({
    cql,
    selectedFacets,
    quickFilters: selectedQuickFilters,
  });

  const fieldSearchQuery = convertStateToCql(fieldSearch);

  const advancedCql =
    cqlAndFacetsQuery ||
    convertStateToCql({
      ...fieldSearch,
      facets: selectedFacets,
      quickFilters: selectedQuickFilters,
    });
  const advancedRes = useData(
    !isSimple &&
      (hasAdvancedSearch || hasCqlSearch) &&
      advancedHitcount({ cql: advancedCql })
  );

  const rawcql = cqlAndFacetsQuery ? cql : fieldSearchQuery;

  const hitcount = isAdvanced
    ? advancedRes?.data?.complexSearch?.hitcount || 0
    : simpleRes?.data?.search?.hitcount || 0;

  let item = simpleRes?.data
    ? {
        mode,
        key: JSON.stringify({ mode, q, filters }),
        q,
        filters,
      }
    : advancedRes?.data
    ? {
        key: advancedCql,
        hitcount,
        fieldSearch,
        cql: rawcql,
        selectedFacets,
        selectedQuickFilters,
        mode,
      }
    : null;

  // return the item as a memoized value in order to avoid unnecessary re-renders
  return useMemo(() => {
    if (!item) {
      return null;
    }
    return {
      ...item,
      timestamp: getTimeStamp(getUnixTimeStamp()),
      unixtimestamp: getUnixTimeStamp(),
    };
  }, [JSON.stringify(item)]);
}

export function useEnhanceSearchHistoryItem() {
  const { restartFacetsHook } = useFacets();
  const { resetQuickFilters } = useQuickFilters();
  const { changeWorkType } = useAdvancedSearchContext();

  function enhanceItem(item) {
    const isSimple = item.mode === "simpel";
    const isAdvanced = !isSimple && !isEmpty(item.fieldSearch);
    const type = Translate({
      context: "improved-search",
      label: isSimple ? "simple" : isAdvanced ? "advanced" : "cql",
    });

    const goToItemUrl = () => {
      if (item.mode === "simpel") {
        let qKey = "";
        let qValue = "";
        if (item?.q?.subject) {
          qKey = "q.subject";
          qValue = item?.q?.subject;
        } else if (item?.q?.creator) {
          qKey = "q.creator";
          qValue = item?.q?.creator;
        } else {
          qKey = "q.all";
          qValue = item?.q?.all;
        }
        let filtersStr = "";
        if (item?.filters) {
          Object.entries(item?.filters).forEach(([key, value]) => {
            if (value.length > 0) {
              filtersStr += `&${key}=${encodeURIComponent(value.join(","))}`;
            }
          });
        }

        router.push(
          `/find/simpel?${qKey}=${encodeURIComponent(qValue)}${filtersStr}`
        );
        return;
      }
      // restart the useFacets hook - this is a 'new' search
      restartFacetsHook();
      resetQuickFilters();

      // set worktype from item
      changeWorkType(item.fieldSearch?.workType || "all");
      if (!isEmpty(item.fieldSearch)) {
        const query = {
          fieldSearch: JSON.stringify(item.fieldSearch),
          facets: JSON.stringify(item.selectedFacets || "[]"),
          quickfilters: JSON.stringify(item.selectedQuickFilters || "[]"),
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
            quickfilters: JSON.stringify(item.quickfilters || "[]"),
          },
        });
      }
    };

    return {
      ...item,
      goToItemUrl,
      translations: {
        type,
        searchValue: getSearchValueString(item),
      },
    };
  }
  return enhanceItem;
}

export const useAdvancedSearchHistory = () => {
  let { data: storedValue, mutate } = useSWR(KEY, (key) =>
    JSON.parse(getSessionStorageItem(key) || "[]")
  );
  const enhanceItem = useEnhanceSearchHistoryItem();

  const setValue = (value) => {
    try {
      if (typeof window !== "undefined") {
        // check if cql (and facets) is already stored
        const alreadyStored = storedValue.find(
          (stor) => value?.key === stor?.key
        );

        value["timestamp"] = getTimeStamp(getUnixTimeStamp());
        value["unixtimestamp"] = getUnixTimeStamp();
        if (!alreadyStored) {
          // Add to beginning of history array
          storedValue.unshift(value);
          // maintain localstorage
          setSessionStorageItem(KEY, JSON.stringify(storedValue));
          // maintain state
          mutate();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteValue = (value) => {
    try {
      if (typeof window !== "undefined") {
        // get index of value to delete
        const valueIndex = storedValue.findIndex(
          (stor) => stor.cql === value?.cql
        );
        if (valueIndex > -1) {
          // Add to beginning of history array
          storedValue.splice(valueIndex, 1);
          // update localstorage
          setSessionStorageItem(KEY, JSON.stringify(storedValue));
          mutate();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearValues = () => {
    try {
      if (typeof window !== "undefined") {
        storedValue = [];
        setSessionStorageItem(KEY, JSON.stringify(storedValue));
        mutate();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const parsedStoredValue = useMemo(() => {
    return storedValue?.map((item) => {
      return enhanceItem(item);
    });
  }, [storedValue]);

  return { storedValue: parsedStoredValue, setValue, deleteValue, clearValues };
};

export default useAdvancedSearchHistory;
