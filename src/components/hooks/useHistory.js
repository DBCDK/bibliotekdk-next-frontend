import { useState } from "react";

export const useHistory = () => {
  const [storedValue, setStoredValue, clearStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem("history");
      return item ? JSON.parse(item) : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  });

  const setValue = (value) => {
    try {
      // Fetch clean
      let freshStoredValue = JSON.parse(
        window.localStorage.getItem("history") || "[]"
      );
      // New history obj
      const obj = {
        __typename: "History",
        value,
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
      window.localStorage.setItem("history", JSON.stringify(valueToStore));
    } catch (err) {
      console.error(err);
    }
  };

  const clearValue = () => {
    try {
      setStoredValue([]);
      window.localStorage.setItem("history", JSON.stringify([]));
    } catch (err) {
      console.error(err);
    }
  };

  return [storedValue, setValue, clearValue];
};

export default useHistory;
