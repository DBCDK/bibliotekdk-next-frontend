import { useEffect, useState } from "react";
import { SuggestTypeEnum } from "@/lib/enums";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/utils";

const KEY = "bibdk-search-history";

/**
 * Konverterer gamle entries til korrekt format med `type` og `term`
 * @param {Array<Object>} prevItemArray
 * @returns {Array<Object>}
 */
function extractStoredValue(prevItemArray = []) {
  return prevItemArray.map((item) => {
    if (item?.type && item?.term) return item;
    return {
      type: SuggestTypeEnum.HISTORY,
      term: item?.value || "",
    };
  });
}

/**
 * Henter historik fra localStorage og parser den sikkert
 * @returns {Array<Object>}
 */
function getHistory() {
  try {
    const raw = getLocalStorageItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return extractStoredValue(parsed);
  } catch (err) {
    console.error("Failed to read history from localStorage:", err);
    return [];
  }
}

/**
 * Gemmer historik både i localStorage og lokal state
 * @param {Array<Object>} data
 * @param {Function} setStoredValue
 */
function saveHistory(data, setStoredValue) {
  try {
    setStoredValue(data);
    setLocalStorageItem(KEY, JSON.stringify(data));
  } catch (err) {
    console.error("Failed to save history:", err);
  }
}

/**
 * @hook useHistory
 * Returnerer søgehistorik, samt funktioner til at tilføje og rydde den
 */
export const useHistory = () => {
  const [storedValue, setStoredValue] = useState([]);

  // Hent historik efter første render (kun på klienten)
  useEffect(() => {
    const history = getHistory();
    setStoredValue(history);
  }, []);

  /**
   * Tilføjer en ny søgeterm til historikken
   * @param {string} value
   */
  const setValue = (value) => {
    const current = getHistory();

    const newItem = {
      type: SuggestTypeEnum.HISTORY,
      term: value,
    };

    // Fjern evt. duplikater
    let updated = current.filter(
      (item) => item.term?.toLowerCase() !== value?.toLowerCase()
    );

    updated.unshift(newItem); // Tilføj forrest
    updated = updated.slice(0, 8); // Max 8 elementer

    saveHistory(updated, setStoredValue);
  };

  /**
   * Rydder hele historikken
   */
  const clearValue = () => {
    saveHistory([], setStoredValue);
  };

  return [storedValue, setValue, clearValue];
};

export default useHistory;
