import { useEffect, useState } from "react";
import { LogicalOperatorsEnum } from "@/components/search/enums";
import { getInitialInputFields } from "@/components/search/advancedSearch/advancedSearchContext";
import { useRouter } from "next/router";

export function useInputFields({ fieldSearchFromUrl }) {
  //prefixLogicalOperator is an enum of AND, OR , NOT
  /** @typedef {("AND"|"OR"|"NOT"|null)} PrefixLogicalOperator */
  /** @typedef {{value: string, prefixLogicalOperator: PrefixLogicalOperator, searchIndex: string}} InputField */
  const [/** @type Array.<InputField> */ inputFields, setInputFields] =
    useState(fieldSearchFromUrl.inputFields || getInitialInputFields());

  const router = useRouter();

  // update inputfields when url changes
  useEffect(() => {
    const fields = router?.query?.fieldSearch || null;
    let inputFromUrl;
    try {
      inputFromUrl = JSON.parse(fields);
    } catch (e) {
      inputFromUrl = null;
    }

    if (inputFromUrl?.inputFields) {
      const newState = getInitialInputFields()
      setInputFields(inputFromUrl?.inputFields);
    }
  }, [router?.query?.fieldSearch]);

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
    setInputFields((prevFields) => {
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
