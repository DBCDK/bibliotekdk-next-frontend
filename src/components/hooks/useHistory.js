import { useState } from "react";
import { SuggestTypeEnum } from "@/lib/enums";

const KEY = "bibdk-search-history";

export const useHistory = () => {
  const [storedValue, setStoredValue, _clearStoredValue] = useState(() => {
    try {
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(KEY);
        return item ? JSON.parse(item) : [];
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
        let freshStoredValue = JSON.parse(localStorage.getItem(KEY) || "[]");
        // New history obj
        const obj = {
          // TODO: På sigt skal "__typename" og "value" fjernes til fordel for kun "type" og "term"
          __typename: "History",
          type: SuggestTypeEnum.HISTORY,
          value,
          term: value,
        };
        // Remove duplicates if any
        let valueToStore = freshStoredValue.filter(
          (h) => h.value.toLowerCase() !== value.toLowerCase()
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
