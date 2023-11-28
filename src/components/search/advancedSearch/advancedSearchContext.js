/**
 * @file
 * This file manages the state for advanced search.
 */

import React, { createContext, useContext, useEffect, useState } from "react";
import { LogicalOperatorsEnum } from "@/components/search/enums";
import { DropdownIndicesEnum } from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";
import { convertStateToCql } from "@/components/search/advancedSearch/utils";
import { useInputFields } from "@/components/search/advancedSearch/useInputFields";
import { useDropdownSearchIndices } from "@/components/search/advancedSearch/useDropdownSearchIndices";

export function getDefaultDropdownIndices() {
  return [
    { searchIndex: DropdownIndicesEnum.LANGUAGES, value: [] },
    { searchIndex: DropdownIndicesEnum.MATERIAL_TYPES_GENERAL, value: [] },
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
  // TODO: Move this part of the state into Context
  //  So we are able to control default view from context as well
  const {
    page = "1",
    cql: cqlFromUrl = null,
    fieldSearch = "",
    sort: sortFromUrl = "",
  } = router.query;
  const fieldSearchFromUrl = fieldSearch && JSON.parse(fieldSearch);

  const sort = sortFromUrl && JSON.parse(sortFromUrl);

  //// ----  Popup Trigger ----
  const [showPopover, setShowPopover] = useState(false);
  //if advanced search popover is open, and the user clicks on simple search, a tooltip with info will be shown.
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

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
  //field search valued parsed as cql. Will be shown in cql input view.
  const [parsedCQL, setParsedCQL] = useState(
    cqlFromUrl ||
      convertStateToCql({
        inputFields: fieldSearchFromUrl.inputFields || getInitialInputFields(),
        dropdownSearchIndices:
          fieldSearchFromUrl.dropdownSearchIndices ||
          getDefaultDropdownIndices(),
      })
  );

  useEffect(() => {
    const updatedCql = convertStateToCql({
      inputFields,
      dropdownSearchIndices,
    });
    setParsedCQL(updatedCql);
  }, [inputFields]);

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
        pageNoFromUrl: number
        sort: Array.<{ index: string, order: string }>
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
  };

  return (
    <AdvancedSearchContext.Provider value={value}>
      {children}
    </AdvancedSearchContext.Provider>
  );
}
