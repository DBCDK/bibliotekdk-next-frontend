/**
 * @file - Hook for advanced search history - localstorage
 */

import { getLocalStorageItem, setLocalStorageItem } from "@/lib/utils";
import useSWR from "swr";
import { getLanguage } from "@/components/base/translate";
import { useMemo } from "react";

const KEY = "saved-advanced-search-items";

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

export const useSavedSearches = () => {
  let { data: savedSearches, mutate } = useSWR(KEY, (key) =>
    JSON.parse(getLocalStorageItem(key) || "[]")
  );

  const saveSerach = (value) => {
    console.log("setValue.value", value);
    try {
      if (typeof window !== "undefined") {
        // check if cql (and facets) is already stored
        const alreadyStored = savedSearches.find(
          (stor) => stor?.key?.trim() === value?.key?.trim()
        );

        value["timestamp"] = getTimeStamp(getUnixTimeStamp());
        value["unixtimestamp"] = getUnixTimeStamp();
        if (!alreadyStored) {
          // Add to beginning of history array
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
          // Add to beginning of history array
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

  const clearValues = () => {
    try {
      if (typeof window !== "undefined") {
        savedSearches = [];
        setLocalStorageItem(KEY, JSON.stringify(savedSearches));
        mutate();
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
    clearValues,
  };
};

export default useSavedSearches;
