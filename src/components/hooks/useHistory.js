/**
 * @file - search history for mobile suggester
 */

import { useState } from "react";
import { SuggestTypeEnum } from "@/lib/enums";

const KEY = "bibdk-search-history";

/**
 * @function extractStoredValue
 * Ensures the localStorage uses the proper fields in `bibdk-search-history`.
 * That is `type` instead of `__typename` and `term` instead of `value`
 * @param {Array<Object>} prevItemArray -- The previous array of items
 * @returns {Array<Object>} -- The new and updated array of items
 */
function extractStoredValue(prevItemArray) {
  let newItemArray = [];

  for (let i = 0; i < prevItemArray?.length; i++) {
    newItemArray.push({});
    if (prevItemArray?.[i]?.type && prevItemArray?.[i]?.term) {
      newItemArray[i] = prevItemArray[i];
      continue;
    }
    if (prevItemArray?.[i]?.__typename) {
      newItemArray[i].type = SuggestTypeEnum.HISTORY;
    }
    if (prevItemArray?.[i]?.value) {
      newItemArray[i].term = prevItemArray[i].value;
    }
  }

  return newItemArray;
}

export const useHistory = () => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(KEY);
        return item ? extractStoredValue(JSON.parse(item)) : [];
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  });

  const setValue = (value) => {
    try {
      if (typeof window !== "undefined") {
        // Fetch clean
        let freshStoredValue =
          extractStoredValue(JSON.parse(localStorage.getItem(KEY))) || "[]";

        // New history obj
        const obj = {
          type: SuggestTypeEnum.HISTORY,
          term: value,
        };
        // Remove duplicates if any
        let valueToStore = freshStoredValue?.filter(
          (h) => h?.term?.toLowerCase() !== value?.toLowerCase()
        );
        // Add to beginning of history array
        valueToStore.unshift(obj);
        // only save last 8 searches
        valueToStore = valueToStore.slice(0, 8);
        // Store again
        setStoredValue(valueToStore);
        localStorage.setItem(KEY, JSON.stringify(valueToStore));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearValue = () => {
    try {
      if (typeof window !== "undefined") {
        setStoredValue([]);
        localStorage.setItem(KEY, JSON.stringify([]));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return [storedValue, setValue, clearValue];
};

export default useHistory;
