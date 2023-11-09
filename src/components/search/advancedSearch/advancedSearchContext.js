/**
 * @file
 * This file manages the state for advanced search.
 */

import React, { createContext, useContext, useReducer, useState } from "react";
import { LogicalOperatorsEnum } from "@/components/search/enums";
import {
  DropdownIndicesEnum,
  useDefaultItemsForDropdownUnits,
} from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";
import isEmpty from "lodash/isEmpty";
// import { useRouter } from "next/router";

export const defaultDropdownIndices = [
  { searchIndex: DropdownIndicesEnum.LANGUAGES, value: [] },
  { searchIndex: DropdownIndicesEnum.MATERIAL_TYPES_SPECIFIC, value: [] },
];

const AdvancedSearchContext = createContext();

/**
 * @returns {AdvancedSearchContextType}
 */
export function useAdvancedSearchContext() {
  return useContext(AdvancedSearchContext);
}

function dropdownReducer(prev, current) {
  return prev?.map((singleDropdownIndex) => {
    if (current.indexName === singleDropdownIndex.searchIndex) {
      return {
        searchIndex: current.indexName,
        value: current.menuItemsState
          .filter((item) => item.isSelected === true)
          .map((item) => item.value),
      };
    } else {
      return singleDropdownIndex;
    }
  });
}

const initialInputFields = [
  { value: "", prefixLogicalOperator: null, searchIndex: "term.default" },
  {
    value: "",
    prefixLogicalOperator: LogicalOperatorsEnum.AND,
    searchIndex: "term.title",
  },
];

export default function AdvancedSearchProvider({ children }) {
  // TODO: Move this part of the state into Context
  //  So we are able to control default view from context as well
  // const router = useRouter();
  // const { page: pageNo = 1 } = router.query;
  // const cql = router?.query?.cql || null;
  // let fieldSearch = router?.query?.fieldSearch;
  // if (fieldSearch) {
  //   fieldSearch = JSON.parse(fieldSearch);
  // }

  //prefixLogicalOperator is an enum of AND, OR , NOT
  /** @typedef {("AND"|"OR"|"NOT"|null)} PrefixLogicalOperator */
  /** @typedef {{value: string, prefixLogicalOperator: PrefixLogicalOperator, searchIndex: string}} InputField */
  const [/** @type Array.<InputField> */ inputFields, setInputFields] =
    useState(initialInputFields);

  const [dropdownInitState, setDropdownInitState] = useState([]);

  /** @typedef {<A>(value: A) => void} UpdateDropdownSearchIndices */
  /** @typedef {{value: (Array.<string>|Array.<Object<>>), searchIndex: string}} DropdownSearchIndex */
  const [
    /** @type {Array.<DropdownSearchIndex>} */ dropdownSearchIndices,
    /** @type {UpdateDropdownSearchIndices} */ updateDropdownSearchIndices,
  ] = useReducer(dropdownReducer, defaultDropdownIndices, (initState) =>
    !isEmpty(dropdownInitState) ? dropdownInitState : initState
  );

  /** @typedef {({code: string, display: string} | {key: string, term: string})} SingleItem */
  /** @typedef {prioritisedFormType: string, prioritisedItems: Array.<SingleItem>, unprioritisedFormType: string, unprioritisedItems: Array.<SingleItem>} Items */
  /** @typedef {indexName: string, items: Items} DropdownUnit */
  const dropdownUnits = useDefaultItemsForDropdownUnits();

  //field search valued parsed as cql. Will be shown in cql input view.
  const [parsedCQL, setParsedCQL] = useState(null);

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

  /**
   *overrides state to the given input. For field search only.
   * @param {*} stateObject
   */
  function updateStatesFromObject(stateObject) {
    if (stateObject?.inputFields) {
      setInputFields(stateObject.inputFields);
    }
    //TODO: implement when dropdowns are ready
    if (stateObject.dropdownSearchIndices) {
      setDropdownInitState(stateObject.dropdownSearchIndices);
    }
  }

  function resetObjectState() {
    setInputFields(initialInputFields);
    setDropdownInitState(defaultDropdownIndices);
  }

  /** @typedef {{
        inputFields: Array.<InputField>,
        removeInputField: (indexToRemove: number) => void,
        addInputField: () => void,
        handleLogicalOperatorChange: (index: number, newOperator: string) => void,
        handleInputFieldChange: (index: number, newValue: string) => void,
        handleIndexChange: (index: number, newOperator: string) => void,
        dropdownUnits: Array.<DropdownUnit>,
        dropdownSearchIndices: Array.<DropdownSearchIndex>,
        updateDropdownSearchIndices: UpdateDropdownSearchIndices,
        updateStatesFromObject: ({inputFields?: Array.<InputField>, dropdownSearchIndices?: Array.<DropdownSearchIndex>}) => void,
        resetObjectState: () => void,
        parsedCQL: string,
        setParsedCQL: (value: string) => void,
   }} AdvancedSearchContextType */
  const value = {
    inputFields,
    addInputField,
    removeInputField,
    handleLogicalOperatorChange,
    handleInputFieldChange,
    handleIndexChange,
    dropdownUnits,
    dropdownSearchIndices,
    updateDropdownSearchIndices,
    updateStatesFromObject,
    resetObjectState,
    parsedCQL,
    setParsedCQL,
  };

  return (
    <AdvancedSearchContext.Provider value={value}>
      {children}
    </AdvancedSearchContext.Provider>
  );
}
