/**
 * @file
 * This file manages the state for advanced search.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { LogicalOperatorsEnum } from "@/components/search/enums";
import { DropdownIndicesEnum } from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";
import { convertStateToCql } from "@/components/search/advancedSearch/utils";
import { useInputFields } from "@/components/search/advancedSearch/useInputFields";
import { useDropdownSearchIndices } from "@/components/search/advancedSearch/useDropdownSearchIndices";
import isEmpty from "lodash/isEmpty";

export function getDefaultDropdownIndices() {
  return [
    { searchIndex: DropdownIndicesEnum.LANGUAGES, value: [] },
    { searchIndex: DropdownIndicesEnum.MATERIAL_TYPES_GENERAL, value: [] },
    { searchIndex: DropdownIndicesEnum.PUBLICATION_YEAR, value: [] },
    { searchIndex: DropdownIndicesEnum.AGES, value: [] },
  ];
}

export function getInitialInputFields() {
  return [
    { value: "", prefixLogicalOperator: null, searchIndex: "term.default" },
    {
      value: "",
      prefixLogicalOperator: LogicalOperatorsEnum.AND,
      searchIndex: "term.title",
    },
  ];
}

const AdvancedSearchContext = createContext(undefined);

/**
 * @returns {AdvancedSearchContextType}
 */
export function useAdvancedSearchContext() {
  return useContext(AdvancedSearchContext);
}

export default function AdvancedSearchProvider({ children, router }) {
  const workType = "all";

  const {
    page = "1",
    cql: cqlFromUrl = null,
    fieldSearch = "",
    sort: sortFromUrl = "",
  } = router.query;
  const fieldSearchFromUrl = fieldSearch && JSON.parse(fieldSearch);

  const sort = sortFromUrl && JSON.parse(sortFromUrl);

  //// ----  Popup Trigger ----
  const popoverRef = useRef(null);
  const [showPopover, setShowPopover] = useState(false);
  //if advanced search popover is open, and the user clicks on simple search, a tooltip with info will be shown.
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  useEffect(() => {
    if (showPopover && popoverRef.current) {
      popoverRef?.current?.focus();
    }
  }, [showPopover, popoverRef.current]);

  //// ---- Inputfields ----
  const {
    inputFields,
    addInputField,
    removeInputField,
    handleLogicalOperatorChange,
    handleInputFieldChange,
    handleIndexChange,
    resetInputFields,
  } = useInputFields({
    fieldSearchFromUrl: { ...fieldSearchFromUrl },
  });

  //// ---- DropdownSearchIndices ----
  const {
    dropdownUnits,
    dropdownSearchIndices,
    updateDropdownSearchIndices,
    resetDropdownIndices,
  } = useDropdownSearchIndices({ ...fieldSearchFromUrl });

  //// ---- parsedCQL ----
  //only add inputFields to object if there are values
  const cleanInputFields = inputFields.filter((el) => !isEmpty(el.value));

  //only add dropdownSearchIndices to object if there are values
  const cleanDropdowns = dropdownSearchIndices.filter(
    (el) => !isEmpty(el.value)
  );
  const state = {
    ...(cleanInputFields.length > 0 && { inputFields: cleanInputFields }),
    ...(cleanDropdowns.length > 0 && { dropdownSearchIndices: cleanDropdowns }),
  };

  //if object is empty, return empty string. Otherwise stringify state.
  const stateToString = !isEmpty(state) ? JSON.stringify(state) : "";

  const [parsedCQL, setParsedCQL] = useState("");

  useEffect(() => {
    const updatedCql = convertStateToCql({
      inputFields,
      dropdownSearchIndices,
    });
    setParsedCQL(cqlFromUrl || updatedCql);
  }, [inputFields, dropdownSearchIndices, cqlFromUrl]);

  //// ---- DONE: parsedCQL ----

  function resetObjectState() {
    resetInputFields();
    resetDropdownIndices();
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
        resetObjectState: () => void,
        parsedCQL: string,
        setParsedCQL: (value: string) => void,
        fieldSearchFromUrl: { inputFields: Array.<InputField>, dropdownSearchIndices: Array.<DropdownSearchIndex> },
        cqlFromUrl: string,
        pageNoFromUrl: number,
        showPopover: boolean,
        setShowPopover: function,
        showInfoTooltip: boolean,
        setShowInfoTooltip: function,
        sort: Array.<{ index: string, order: string }>,
        workType: string
        stateToString: string
        popoverRef: any
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
    resetObjectState,
    parsedCQL,
    setParsedCQL,
    fieldSearchFromUrl,
    cqlFromUrl,
    pageNoFromUrl: page,
    showPopover,
    setShowPopover,
    showInfoTooltip,
    setShowInfoTooltip,
    sort: sort,
    workType: workType,
    stateToString,
    popoverRef,
  };

  return (
    <AdvancedSearchContext.Provider value={value}>
      {children}
    </AdvancedSearchContext.Provider>
  );
}
