/**
 * @file - search history for mobile suggester
 */

import { useState } from "react";

const KEY = "advanced-search-history";

export const useAdvancedSearchHistory = () => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return JSON.parse(localStorage?.getItem(KEY));
    } catch (e) {
      return [];
    }
  });

  const setValue = (value) => {
    try {
      if (typeof window !== "undefined") {
        // Fetch clean

        const localstore = JSON.parse(localStorage.getItem(KEY) || "[]");
        // check if cql is already stored
        const alreadyStored = !!localstore.find(
          (stor) => stor.cql === value.cql
        );
        if (!alreadyStored) {
          // Add to beginning of history array
          localstore.unshift(value);
          // maintain localstorage
          localStorage.setItem(KEY, JSON.stringify(localstore));
          // maintain state
          setStoredValue(localstore);
        }

        console.log(storedValue, "USE STORED VALUE");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteValue = (value) => {
    try {
      if (typeof window !== "undefined") {
        // Fetch clean
        const localstore = JSON.parse(localStorage.getItem(KEY) || "[]");

        // get index of value to delete
        const valueIndex = localstore.findIndex(
          (stor) => stor.cql === value.cql
        );
        if (valueIndex > -1) {
          // Add to beginning of history array
          localstore.splice(valueIndex, 1);
          // maintain state
          setStoredValue(localstore);
          // update localstorage
          localStorage.setItem(KEY, JSON.stringify(localstore));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const clearValues = () => {
    try {
      if (typeof window !== "undefined") {
        setStoredValue([]);
        localStorage.setItem(KEY, JSON.stringify([]));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return [storedValue, deleteValue, setValue, clearValues];
};

export default useAdvancedSearchHistory;
