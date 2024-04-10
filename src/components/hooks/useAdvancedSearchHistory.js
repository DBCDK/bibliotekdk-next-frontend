/**
 * @file - Hook for advanced search history - localstorage
 */

import { getSessionStorageItem, setSessionStorageItem } from "@/lib/utils";
import useSWR from "swr";
import { getLanguage } from "@/components/base/translate";

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

export const useAdvancedSearchHistory = () => {
  let { data: storedValue, mutate } = useSWR(KEY, (key) =>
    JSON.parse(getSessionStorageItem(key) || "[]")
  );

  const setValue = (value) => {
    try {
      if (typeof window !== "undefined") {
        // check if cql (and facets) is already stored
        const alreadyStored = storedValue.find(
          (stor) =>
            stor?.cql?.trim() === value?.cql?.trim() &&
            JSON.stringify(stor?.selectedFacets) ===
              JSON.stringify(value?.selectedFacets)
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

  return { storedValue, setValue, deleteValue, clearValues };
};

export default useAdvancedSearchHistory;
