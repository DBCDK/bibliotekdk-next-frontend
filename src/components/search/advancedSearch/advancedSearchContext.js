/**
 * @file
 * This file manages the state for advanced search.
 */

import React, { createContext, useContext, useState } from "react";
import { LogicalOperatorsEnum } from "@/components/search/enums";

const AdvancedSearchContext = createContext();

export function useAdvancedSearchContext() {
  return useContext(AdvancedSearchContext);
}

export default function AdvancedSearchProvider({ children }) {
  //prefixLogicalOperator is an enum of AND, OR , NOT
  const [inputFields, setInputFields] = useState([
    { value: "", prefixLogicalOperator: null, searchIndex: "all" },
    {
      value: "",
      prefixLogicalOperator: LogicalOperatorsEnum.AND,
      searchIndex: "all",
    },
  ]);
  //TODO: Akri will implement dis
  // const [dropDowns, setDropdown] = useState([
  //   { index: "language", value: "da" },
  //   { index: "2-3", value: "age" },
  // ]);

  /**
   * Add an extra input field
   */
  function addInputField() {
    setInputFields((prevFields) => [
      ...prevFields,
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
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
  function handleLogicalOperatorChange(index, newOperator) {
    setInputFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index].prefixLogicalOperator = newOperator;
      return newFields;
    });
  }

  /**
   * Handle input field value change
   * @param {*} index
   * @param {*} newOperator
   */
  function handleInputFieldChange(index, newValue) {
    console.log("handleInputFieldChange.index", index);
    console.log("handleInputFieldChange.newValue", newValue);

    setInputFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index].value = newValue;
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

    handleLogicalOperatorChange,
    //  dropDowns,
    handleIndexChange,
    handleInputFieldChange,
  };

  return (
    <AdvancedSearchContext.Provider value={value}>
      {children}
    </AdvancedSearchContext.Provider>
  );
}
