import React, { createContext, useContext, useState } from "react";
import { LogicalOperatorsEnum } from "../enums";

const TextInputsContext = createContext();

export function useTextInputsContext() {
  return useContext(TextInputsContext);
}

export default function TextInputsProvider({ children }) {
  //prefixOperator is an enum of AND, OR , NOT
  const [inputFields, setInputFields] = useState([
    { value: "", prefixOperator: null, searchIndex: "all" },
    { value: "", prefixOperator: LogicalOperatorsEnum.AND, searchIndex: "all" },
  ]);
  //TODO snak med akri
  const [dropDowns, setDropdown] = useState([
    { index: "language", value: "da" },
    { index: "2-3", value: "age" },
  ]);

  /**
   * add an extra input field
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

  //change logical operator between input fields in advanced search
  function handlePrefixChange(index, newOperator) {
    setInputFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index].prefixOperator = newOperator;
      return newFields;
    });
  }

  //Handle field index change in indexDropdown (e.g. "all", "author","title" etc.)
  function handleIndexChange(index, newOperator) {
    console.log(index, "newOperator");
    console.log(index, "newOperator");

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
    <TextInputsContext.Provider value={value}>
      {children}
    </TextInputsContext.Provider>
  );
}
