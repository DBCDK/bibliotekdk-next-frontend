import { useEffect, useState } from "react";
import { LogicalOperatorsEnum } from "@/components/search/enums";
import { getInitialInputFields } from "@/components/search/advancedSearch/advancedSearchContext";

export function useInputFields(fieldSearchFromUrl, workType) {
  //prefixLogicalOperator is an enum of AND, OR , NOT
  const [inputFields, setInputFields] = useState([]);

  useEffect(() => {
    setInputFields(getInitialInputFields(workType));
  }, [workType]);

  
  useEffect(() => {
    setInputFields(
      fieldSearchFromUrl.inputFields || getInitialInputFields(workType)
    );
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
  function handleIndexChange(index, elem) {
    setInputFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index].searchIndex = elem.index;
      if (elem?.label) {
        newFields[index].label = elem.label;
      } else {
        delete newFields[index].label;
      }

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
