import { useDefaultItemsForDropdownUnits } from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";
import { useReducer, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { getDefaultDropdownIndices } from "@/components/search/advancedSearch/advancedSearchContext";

export const DropdownReducerEnum = Object.freeze({
  UPDATE: "UPDATE",
  RESET: "RESET",
});

/**
 *
 * @param state
 * @param action
 * @returns {*|[{searchIndex: string, value: []},{searchIndex: string, value: []}]}
 */
function dropdownReducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case DropdownReducerEnum.RESET:
      return getDefaultDropdownIndices();
    case DropdownReducerEnum.UPDATE:
      return state?.map((singleDropdownIndex) => {
        if (payload.indexName === singleDropdownIndex.searchIndex) {
          return {
            searchIndex: payload.indexName,
            value: payload.menuItemsState
              .filter((item) => item.isSelected === true)
              .map((item) => item.value),
          };
        } else {
          return singleDropdownIndex;
        }
      });
    default:
      console.log("miaw: ");
      return state;
  }
}

/**
 *
 * @param fieldSearchFromUrl
 * @returns {{dropdownUnits: Array.<DropdownUnit>, dropdownSearchIndices: Array.<DropdownSearchIndex>, setDropdownInitState: function, updateDropdownSearchIndices: <A>(value: A) => void}}
 */
export function useDropdownSearchIndices(fieldSearchFromUrl) {
  //// ---- DropdownSearchIndices ----
  /** @typedef {{indexName: string, items: DropdownInputArray}} DropdownUnit */
  const /** @type {Array.<DropdownUnit>} */ dropdownUnits =
      useDefaultItemsForDropdownUnits({
        initDropdowns:
          fieldSearchFromUrl.dropdownSearchIndices ||
          getDefaultDropdownIndices(),
      });

  const [dropdownInitState, setDropdownInitState] = useState([]);

  /** @typedef {({ type?: string, payload: DropdownSearchIndex}) => void} UpdateDropdownSearchIndices */
  /** @typedef {{value: (Array.<string>|Array.<Object<>>), searchIndex: string}} DropdownSearchIndex */
  const /** @type {[Array.<DropdownSearchIndex>, UpdateDropdownSearchIndices]} */ [
      dropdownSearchIndices,
      updateDropdownSearchIndices,
    ] = useReducer(dropdownReducer, getDefaultDropdownIndices(), (initState) =>
      !isEmpty(dropdownInitState) ? dropdownInitState : initState
    );

  function resetDropdownIndices() {
    setDropdownInitState([]);
    updateDropdownSearchIndices({ type: DropdownReducerEnum.RESET });
  }

  return {
    dropdownUnits: dropdownUnits,
    setDropdownInitState: setDropdownInitState,
    dropdownSearchIndices: dropdownSearchIndices,
    updateDropdownSearchIndices: updateDropdownSearchIndices,
    resetDropdownIndices: resetDropdownIndices,
  };
}
