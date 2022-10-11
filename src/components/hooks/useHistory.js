import { useState } from "react";
import { SuggestTypeEnum } from "@/lib/enums";

const KEY = "bibdk-search-history";

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

  function extractStoredValue(oldItemArray) {
    let newItemArray = [];

    for (let i = 0; i < oldItemArray.length; i++) {
      newItemArray.push({});
      if (oldItemArray?.[i]?.type && oldItemArray?.[i]?.term) {
        newItemArray[i] = oldItemArray[i];
        continue;
      }
      if (oldItemArray?.[i]?.__typename) {
        newItemArray[i].type = SuggestTypeEnum.HISTORY;
      }
      if (oldItemArray?.[i]?.value) {
        newItemArray[i].term = oldItemArray[i].value;
      }
    }

    return newItemArray;
  }

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
        let valueToStore = freshStoredValue.filter(
          (h) => h.term.toLowerCase() !== value.toLowerCase()
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
