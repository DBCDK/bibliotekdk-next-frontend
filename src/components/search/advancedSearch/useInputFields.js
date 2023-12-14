import { useEffect, useState } from "react";
import { LogicalOperatorsEnum } from "@/components/search/enums";
import { getInitialInputFields } from "@/components/search/advancedSearch/advancedSearchContext";

export function useInputFields({ fieldSearchFromUrl }) {
  //prefixLogicalOperator is an enum of AND, OR , NOT
  /** @typedef {("AND"|"OR"|"NOT"|null)} PrefixLogicalOperator */
  /** @typedef {{value: string, prefixLogicalOperator: PrefixLogicalOperator, searchIndex: string}} InputField */
  const [/** @type Array.<InputField> */ inputFields, setInputFields] =
    useState([]);

  useEffect(() => {
    setInputFields(fieldSearchFromUrl.inputFields || getInitialInputFields());
  }, [JSON.stringify(fieldSearchFromUrl)]);

  /**
   * Add an extra input field
   */
  function addInputField() {
    setInputFields((prevFields) => [
      ...prevFields,
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.default",
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
   * @param {*} newValue
   */
  function handleInputFieldChange(index, newValue) {
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
    console.log("handleIndexChange.newOperator", newOperator);
    console.log("handleIndexChange.index", index);

    setInputFields((prevFields) => {
      console.log("handleIndexChange.setInputFields.prevFields", prevFields);
      const newFields = [...prevFields];
      newFields[index].searchIndex = newOperator;
      return newFields;
    });
  }

  function resetInputFields() {
    setInputFields(getInitialInputFields());
  }

  return {
    inputFields,
    setInputFields,
    addInputField,
    removeInputField,
    handleLogicalOperatorChange,
    handleInputFieldChange,
    handleIndexChange,
    resetInputFields,
  };
}
