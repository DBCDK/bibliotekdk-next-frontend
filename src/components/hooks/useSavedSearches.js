/**
 * @file - Hook for advanced search saved searches. functions to get, save and delete searches from userdata db
 */

import { getLocalStorageItem, setLocalStorageItem } from "@/lib/utils";
import useSWR from "swr";
import { useMemo } from "react";

const KEY = "saved-advanced-search-items";

/**
 * Get a date on a stored saved search object
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

export const useSavedSearches = () => {
  let { data: savedSearches, mutate } = useSWR(KEY, (key) =>
    JSON.parse(getLocalStorageItem(key) || "[]")
  );

  const saveSerach = (value) => {
    try {
      if (typeof window !== "undefined") {
        // check if cql (and facets) is already stored
        const alreadyStored = savedSearches.find(
          (stor) => stor?.key?.trim() === value?.key?.trim()
        );
        value["timestamp"] = getTimeStamp(getUnixTimeStamp());
        value["unixtimestamp"] = getUnixTimeStamp();
        if (!alreadyStored) {
          // Add to beginning of saved items array
          savedSearches.unshift(value);
          // maintain localstorage
          setLocalStorageItem(KEY, JSON.stringify(savedSearches));
          // maintain state
          mutate();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSearch = (value) => {
    try {
      if (typeof window !== "undefined") {
        // get index of value to delete
        const valueIndex = savedSearches.findIndex(
          (stor) => stor.key === value?.key
        );
        if (valueIndex > -1) {
          // remove from array
          savedSearches.splice(valueIndex, 1);
          // update localstorage
          setLocalStorageItem(KEY, JSON.stringify(savedSearches));
          mutate();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const savedSearchKeys = useMemo(
    () => savedSearches?.map((search) => search?.key),
    [savedSearches]
  );

  return {
    savedSearches,
    savedSearchKeys,
    saveSerach,
    deleteSearch,
  };
};

export default useSavedSearches;
