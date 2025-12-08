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
import { DropdownIndicesEnum } from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";
import {
  convertStateToCql,
  parseSearchUrl,
  stripOuterQuotesOnce,
} from "@/components/search/advancedSearch/utils";
import { useInputFields } from "@/components/search/advancedSearch/useInputFields";
import { useDropdownSearchIndices } from "@/components/search/advancedSearch/useDropdownSearchIndices";
import isEmpty from "lodash/isEmpty";

const norm = (v) => (v == null ? "" : String(v).trim());
const isNonEmpty = (v) => norm(v) !== "";

export function getDefaultDropdownIndices() {
  return [
    { searchIndex: DropdownIndicesEnum.MAINLANGUAGES, value: [] },
    { searchIndex: DropdownIndicesEnum.MATERIAL_TYPES_GENERAL, value: [] },
    { searchIndex: DropdownIndicesEnum.PUBLICATION_YEAR, value: [] },
    { searchIndex: DropdownIndicesEnum.AGES, value: [] },
    { searchIndex: DropdownIndicesEnum.GENRE, value: [] },
    { searchIndex: DropdownIndicesEnum.MATERIAL_TYPES_SPECIFIC, value: [] },
    { searchIndex: DropdownIndicesEnum.FILMNATIONALITY, value: [] },
    { searchIndex: DropdownIndicesEnum.GAMEPLATFORM, value: [] },
    { searchIndex: DropdownIndicesEnum.PLAYERS, value: [] },
    { searchIndex: DropdownIndicesEnum.PEGI, value: [] },
    { searchIndex: DropdownIndicesEnum.GENERALAUDIENCE, value: [] },
    { searchIndex: DropdownIndicesEnum.NOTA, value: [] },
    { searchIndex: DropdownIndicesEnum.ARTICLE_TYPE, value: [] },
    { searchIndex: DropdownIndicesEnum.INSTRUMENT, value: [] },
    { searchIndex: DropdownIndicesEnum.CHOIRTYPE, value: [] },
    { searchIndex: DropdownIndicesEnum.CHAMBERMUSICTYPE, value: [] },
    { searchIndex: DropdownIndicesEnum.MUSICALEXERCISE, value: [] },
    { searchIndex: DropdownIndicesEnum.DATABASES, value: [] },
  ];
}

/**
 * Default input fields by materialtype. By default the searchindex is translated into
 * something readable - if desired a label can be added in which case the label and NOT the searchindex is translated
 * @param workType
 * @returns {[{prefixLogicalOperator: null, searchIndex: string, value: string},{prefixLogicalOperator: string, searchIndex: string, value: string}]}
 */
export function getInitialInputFields() {
  return [
    {
      value: "",
      prefixLogicalOperator: null,
      searchIndex: "term.default",
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

export function getFieldSearchFromUrl(query) {
  const { fieldSearch, "q.all": q = null } = query;

  const fieldSearchFromUrl = parseSearchUrl(fieldSearch);
  if (fieldSearchFromUrl && !isEmpty(fieldSearchFromUrl)) {
    return fieldSearchFromUrl;
  }

  if (q) {
    // Ensure Advanced default seed does not carry outer quotes from Simple.
    const arr = getInitialInputFields();
    arr[0].value = stripOuterQuotesOnce(q);
    return { inputFields: arr };
  }

  return {};
}

export default function AdvancedSearchProvider({ children, router }) {
  const {
    page = "1",
    cql: cqlFromUrl = null,
    sort: sortFromUrl = "{}",
  } = router.query;

  const fieldSearchFromUrl = getFieldSearchFromUrl(router?.query);
  const sort = parseSearchUrl(sortFromUrl);

  //// ----  Popup Trigger ----
  const popoverRef = useRef(null);
  const [showPopover, setShowPopover] = useState(false);
  //if advanced search popover is open, and the user clicks on simple search, a tooltip with info will be shown.
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);

  // worktypes state.
  const [workType, setWorkType] = useState(
    fieldSearchFromUrl.workType || "all"
  );

  useEffect(() => {
    if (showPopover && popoverRef.current) {
      popoverRef?.current?.focus();
    }
  }, [showPopover, popoverRef.current]);

  useEffect(() => {
    const { workTypes: wtParam, fieldSearch: fsParam } = router.query;

    let wt = "all";
    if (isNonEmpty(wtParam)) {
      wt = Array.isArray(wtParam) ? wtParam[0] || "all" : wtParam;
    } else if (fsParam) {
      const fs = parseSearchUrl(fsParam);
      wt = fs?.workType || "all";
    }

    if (wt !== workType) {
      setWorkType(wt);
    }
  }, [router.query?.workTypes, router.query?.fieldSearch]); // eslint-disable-line

  //tracking id for the selected suggestion from inputfield. For now we only save one tid.
  const [suggesterTid, setSuggesterTid] = useState("");

  //// ---- Inputfields ----
  const {
    inputFields,
    addInputField,
    removeInputField,
    handleLogicalOperatorChange,
    handleInputFieldChange,
    handleIndexChange,
    resetInputFields,
  } = useInputFields({ ...fieldSearchFromUrl }, workType);

  //// ---- DropdownSearchIndices ----
  const {
    dropdownUnits,
    dropdownSearchIndices,
    updateDropdownSearchIndices,
    resetDropdownIndices,
    resetMenuItemsEvent,
    dispatchResetMenuItemsEvent,
  } = useDropdownSearchIndices({ ...fieldSearchFromUrl }, workType);

  //// ---- parsedCQL ----
  //only add inputFields to object if there are values
  const cleanInputFields =
    inputFields?.filter((el) => !isEmpty(el.value)) || [];

  const filteredDropDowns = dropdownSearchIndices.filter(function (el) {
    if (dropdownUnits.find((unit) => unit.indexName === el.searchIndex)) {
      return true;
    }
    return false;
  });

  //only add dropdownSearchIndices to object if there are values
  const cleanDropdowns =
    filteredDropDowns?.filter((el) => !isEmpty(el.value)) || [];

  const state = {
    ...(cleanInputFields.length > 0 && { inputFields: cleanInputFields }),
    ...(cleanDropdowns.length > 0 && { dropdownSearchIndices: cleanDropdowns }),
    ...(workType && workType !== "all" && { workType }),
  };

  //if object is empty, return empty string. Otherwise stringify state.
  const stateToString = !isEmpty(state) ? JSON.stringify(state) : "";

  const [parsedCQL, setParsedCQL] = useState("");

  useEffect(() => {
    const updatedCql = convertStateToCql({
      inputFields,
      dropdownSearchIndices,
      workType,
    });
    setParsedCQL(cqlFromUrl || updatedCql);
  }, [inputFields, dropdownSearchIndices, cqlFromUrl]);

  useEffect(() => {
    const nextWT = fieldSearchFromUrl.workType || "all";
    if (nextWT !== workType) {
      setWorkType(nextWT);
    }
  }, [JSON.stringify(fieldSearchFromUrl.workType)]);

  function resetObjectState() {
    resetInputFields();
    resetDropdownIndices();
    dispatchResetMenuItemsEvent();
    setParsedCQL("");
    setWorkType("all");
  }

  //sets worktype and resets the advanced search state
  const changeWorkType = (newWorkType) => {
    resetObjectState();
    setWorkType(newWorkType);
  };

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
    parsedCQL,
    resetObjectState,
    setParsedCQL,
    fieldSearchFromUrl,
    cqlFromUrl,
    pageNoFromUrl: page,
    showPopover,
    setShowPopover,
    showInfoTooltip,
    setShowInfoTooltip,
    sort: sort,
    workType,
    changeWorkType, //sets worktype and resets the advanced search state
    stateToString,
    popoverRef,
    resetMenuItemsEvent,
    suggesterTid,
    setSuggesterTid,
  };

  return (
    <AdvancedSearchContext.Provider value={value}>
      {children}
    </AdvancedSearchContext.Provider>
  );
}
