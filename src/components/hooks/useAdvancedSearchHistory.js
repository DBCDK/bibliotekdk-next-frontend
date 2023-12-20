/**
 * @file - Hook for advanced search history - localstorage
 */

import { getLocalStorageItem, setLocalStorageItem } from "@/lib/utils";
import useSWR from "swr";

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

function getUnixTimeStamp() {
  return new Date().getTime();
}

export const useAdvancedSearchHistory = () => {
  let { data: storedValue, mutate } = useSWR(KEY, (key) =>
    JSON.parse(getLocalStorageItem(key) || "[]")
  );

  const setValue = (value) => {
    try {
      if (typeof window !== "undefined") {
        // check if cql is already stored
        const alreadyStored = !!storedValue.find(
          (stor) => stor?.cql?.trim() === value?.cql?.trim()
        );
        value["timestamp"] = getTimeStamp(getUnixTimeStamp());
        value["unixtimestamp"] = getUnixTimeStamp();
        if (!alreadyStored) {
          // Add to beginning of history array
          storedValue.unshift(value);
          // maintain localstorage
          setLocalStorageItem(KEY, JSON.stringify(storedValue));
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
          setLocalStorageItem(KEY, JSON.stringify(storedValue));
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
        setLocalStorageItem(KEY, JSON.stringify(storedValue));
        mutate();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { storedValue, setValue, deleteValue, clearValues };
};

export default useAdvancedSearchHistory;
