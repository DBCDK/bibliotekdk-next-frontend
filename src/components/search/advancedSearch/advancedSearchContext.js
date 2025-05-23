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
export function getInitialInputFields(workType = "all") {
  const inputFieldsByMaterialType = {
    all: [
      { value: "", prefixLogicalOperator: null, searchIndex: "term.default" },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.default",
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
        label: "literature_term.creatorcontributor",
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
        label: "literature_term.creatorcontributor",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.subject",
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
        searchIndex: "term.creatorcontributor",
        label: "movie_term.creatorcontributor",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.subject",
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
        label: "music_term.creator",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.contributor",
        label: "music_term.contributor",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.publisher",
        label: "music_term.publisher",
      },
    ],
    sheetmusic: [
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.creator",
        label: "sheetmusic_term.creator",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.title",
        label: "sheetmusic_term.title",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.titlemanifestationpart",
        label: "sheetmusic_term.titlemanifestationpart",
      },
    ],
    game: [
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.title",
        label: "movie_term.title",
      },
      {
        value: "",
        prefixLogicalOperator: LogicalOperatorsEnum.AND,
        searchIndex: "term.publisher",
        label: "game_term.publisher",
      },
    ],
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

  //reset worktype on url change
  useEffect(() => {
    setWorkType(fieldSearchFromUrl.workType || "all");
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
