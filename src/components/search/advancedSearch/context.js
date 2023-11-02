/**
 * @file
 * This file manages the state for advanced search.
 */

import React, { createContext, useContext, useState } from "react";
import { LogicalOperatorsEnum } from "../enums";

const AdvancedSearchContext = createContext();

export function useAdvancedSearchContext() {
  return useContext(AdvancedSearchContext);
}

export default function AdvancedSearchProvider({ children }) {
  //prefixOperator is an enum of AND, OR , NOT
  const [inputFields, setInputFields] = useState([
    { value: "", prefixOperator: null, searchIndex: "all" },
    { value: "", prefixOperator: LogicalOperatorsEnum.AND, searchIndex: "all" },
  ]);
  const [dropDowns, setDropdown] = useState([
    { index: "language", value: "da" },
    { index: "2-3", value: "age" },
  ]);

  /**
   * Add an extra input field
   */
  function addInputField() {
    setInputFields((prevFields) => [
      ...prevFields,
      {
        value: "",
        prefixOperator: LogicalOperatorsEnum.AND,
        searchIndex: "all",
      },
    ]);
  }
  /**
   * Remove input field from advanced search
   * @param {*} indexToRemove
   */
  function removeInputField(indexToRemove) {
    setInputFields((prevFields) =>
      prevFields.filter((_, index) => index !== indexToRemove)
    );
  }
/**
 * change logical operator between input fields in advanced search
 * @param {*} index 
 * @param {*} newOperator 
 */
  function handlePrefixChange(index, newOperator) {
    setInputFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index].prefixOperator = newOperator;
      return newFields;
    });
  }
/**
 * Handle field index change in indexDropdown (e.g. "all", "author","title" etc.)
 * @param {*} index 
 * @param {*} newOperator 
 */
  function handleIndexChange(index, newOperator) {
    setInputFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index].searchIndex = newOperator;
      return newFields;
    });
  }
  const value = {
    inputFields,
    addInputField,
    removeInputField,
    handlePrefixChange,
    dropDowns,
    handleIndexChange,
  };

  return (
    <AdvancedSearchContext.Provider value={value}>
      {children}
    </AdvancedSearchContext.Provider>
  );
}
