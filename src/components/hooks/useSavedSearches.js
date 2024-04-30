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

  //todo rename to saveSearch

  const saveSearch = (value) => {
    try {
      if (typeof window !== "undefined") {
        // Check if cql (and facets) is already stored
        const index = savedSearches.findIndex(
          (stor) => stor?.key?.trim() === value?.key?.trim()
        );

        value["timestamp"] = getTimeStamp(getUnixTimeStamp());
        value["unixtimestamp"] = getUnixTimeStamp();

        if (index !== -1) {
          // Update the existing entry if found
          savedSearches[index] = value;
        } else {
          // Add to the beginning of saved items array if not found
          savedSearches.unshift(value);
        }

        // Update localstorage and state
        setLocalStorageItem(KEY, JSON.stringify(savedSearches));
        mutate();
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
    saveSearch,
    deleteSearch,
  };
};

export default useSavedSearches;
