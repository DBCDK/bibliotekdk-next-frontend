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
    { searchIndex: DropdownIndicesEnum.GENRE, value: [] },
    { searchIndex: DropdownIndicesEnum.MATERIAL_TYPES_SPECIFIC, value: [] },
    { searchIndex: DropdownIndicesEnum.FILM_NATIONALITY, value: [] },
    { searchIndex: DropdownIndicesEnum.GAME_PLATFORM, value: [] },
    { searchIndex: DropdownIndicesEnum.PLAYERS, value: [] },
    { searchIndex: DropdownIndicesEnum.PEGI, value: [] },
  ];
}

export function getInitialInputFields(workType = "all") {
  console.log(workType, "INTITIAL WORKTYPE");

  const inputFieldsByMaterialType = {
    all: [
      { value: "", prefixLogicalOperator: null, searchIndex: "term.default" },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.title",
      },
    ],
    literature: [
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.title",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.creatorcontributor",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.subject",
      },
    ],
    article: [
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.title",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.creatorcontributor",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.hostpublication",
      },
    ],
    movie: [
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.title",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.subject",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.creatorcontributor",
      },
    ],
    music: [
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.title",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.creator",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.contributor",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.publisher",
      },
    ],
    sheetmusic: [],
    game: [],
  };

  return inputFieldsByMaterialType[workType];
}

const AdvancedSearchContext = createContext(undefined);

/**
 * @returns {AdvancedSearchContextType}
 */
export function useAdvancedSearchContext() {
  return useContext(AdvancedSearchContext);
}

export default function AdvancedSearchProvider({ children, router }) {
  const {
    page = "1",
    cql: cqlFromUrl = null,
    fieldSearch = "{}",
    sort: sortFromUrl = "{}",
  } = router.query;

  const fieldSearchFromUrl =
    fieldSearch && JSON.parse(decodeURIComponent(fieldSearch));
  const sort = sortFromUrl && JSON.parse(decodeURIComponent(sortFromUrl));

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
    dropdownsToRemove,
  } = useDropdownSearchIndices({ ...fieldSearchFromUrl }, workType);

  //// ---- parsedCQL ----
  //only add inputFields to object if there are values
  const cleanInputFields =
    inputFields?.filter((el) => !isEmpty(el.value)) || [];

  // filter out dropdowns to be removed (they are in url but NOT in on this page)
  const filteredDropDowns = dropdownSearchIndices.filter(function (el) {
    return !!!dropdownsToRemove.find(
      (drop) => drop.searchIndex === el.searchIndex
    );
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

  //// ---- DONE: parsedCQL ----

  function resetObjectState() {
    resetInputFields();
    resetDropdownIndices();
    dispatchResetMenuItemsEvent();
    setWorkType("all");
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
        resetMenuItemsEvent: string
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
    setWorkType,
    stateToString,
    popoverRef,
    resetMenuItemsEvent,
  };

  return (
    <AdvancedSearchContext.Provider value={value}>
      {children}
    </AdvancedSearchContext.Provider>
  );
}
