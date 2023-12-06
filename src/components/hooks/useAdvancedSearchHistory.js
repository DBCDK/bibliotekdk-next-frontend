/**
 * @file - Hook for advanced search history - localstorage
 */

import useSWR from "swr";

const KEY = "advanced-search-history";

/**
 * Get a date on a stored search history object
 */
function getTimeStamp() {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
  };

  const now = new Date();
  const stamp = now.toLocaleTimeString("en-us", options);
  // remove the " AM/PM" part
  return stamp.replace("AM", "").replace("PM", "").replace(":", ".").trim();
}

export const useAdvancedSearchHistory = () => {
  let { data: storedValue, mutate } = useSWR(KEY, (key) =>
    JSON.parse(localStorage.getItem(key) || "[]")
  );

  const setValue = (value) => {
    try {
      if (typeof window !== "undefined") {
        // check if cql is already stored
        const alreadyStored = !!storedValue.find(
          (stor) => stor?.cql?.trim() === value?.cql?.trim()
        );
        value["timestamp"] = getTimeStamp();
        if (!alreadyStored) {
          // Add to beginning of history array
          storedValue.unshift(value);
          // maintain localstorage
          localStorage.setItem(KEY, JSON.stringify(storedValue));
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
          localStorage.setItem(KEY, JSON.stringify(storedValue));
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
        localStorage.setItem(KEY, JSON.stringify(storedValue));
        mutate();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { storedValue, setValue, deleteValue, clearValues };
};

export default useAdvancedSearchHistory;
