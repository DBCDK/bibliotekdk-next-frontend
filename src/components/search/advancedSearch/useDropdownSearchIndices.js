import { useDefaultItemsForDropdownUnits } from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";
import { useEffect, useReducer, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { getDefaultDropdownIndices } from "@/components/search/advancedSearch/advancedSearchContext";
import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";

export const DropdownReducerEnum = Object.freeze({
  UPDATE: "UPDATE",
  RESET: "RESET",
  REMOVE_ITEM: "REMOVE_ITEM",
  RESET_INDEX: "RESET_INDEX",
  ADD_ITEM: "ADD_ITEM",
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
      if (!!payload) {
        return getDefaultDropdownIndices().map((singleIndex) => {
          const payloadIndex = payload.find(
            (singlePayloadIndex) =>
              singleIndex.searchIndex === singlePayloadIndex.searchIndex
          );

          if (!!payloadIndex) {
            return payloadIndex;
          }
          return singleIndex;
        });
      }
      return getDefaultDropdownIndices();
    case DropdownReducerEnum.ADD_ITEM:
      return state?.map((singleDropdownIndex) => {
        if (payload.indexName === singleDropdownIndex.searchIndex) {
          return {
            searchIndex: payload.indexName,
            value: [
              ...singleDropdownIndex.value.filter(
                (val) => val.name !== payload.item.name
              ),
              { value: payload.item.value, name: payload.item.name },
            ],
          };
        }
        return singleDropdownIndex;
      });
    case DropdownReducerEnum.REMOVE_ITEM:
      return state?.map((singleDropdownIndex) => {
        if (payload.indexName === singleDropdownIndex.searchIndex) {
          return {
            searchIndex: payload.indexName,
            value: singleDropdownIndex.value.filter(
              (element) => element.name !== payload.item.name
            ),
          };
        }
        return singleDropdownIndex;
      });
    case DropdownReducerEnum.RESET_INDEX: {
      return state?.map((singleDropdownIndex) => {
        if (payload.indexName === singleDropdownIndex.searchIndex) {
          return {
            searchIndex: payload.indexName,
            value: [],
          };
        }
        return singleDropdownIndex;
      });
    }
    default:
      return state;
  }
}

function resetSingleIndex(
  indexName,
  dropdownSearchIndices,
  updateDropdownSearchIndices
) {
  updateDropdownSearchIndices({
    type: DropdownReducerEnum.RESET_INDEX,
    payload: {
      indexName: indexName,
    },
  });
}

function getItemFromDropdownSearchIndices(
  itemName,
  indexName,
  dropdownSearchIndices
) {
  return dropdownSearchIndices
    ?.find((searchIndexElement) => searchIndexElement.searchIndex === indexName)
    ?.value?.find((specificIndex) => specificIndex.name === itemName);
}

function getIsSelected(item, dropdownSearchIndices) {
  return (
    typeof dropdownSearchIndices
      ?.find(
        (searchIndexElement) =>
          searchIndexElement.searchIndex === item.indexName
      )
      ?.value?.find((specificIndex) => specificIndex.name === item.name) !==
    "undefined"
  );
}

function toggleIsSelected(
  item,
  dropdownSearchIndices,
  dropdownUnits,
  updateDropdownSearchIndices
) {
  const actionLinkAnyNonEmptyValue = Object.values(item.value).some(
    (val) => !!val
  );
  switch (item.formType) {
    case FormTypeEnum.CHECKBOX:
      updateDropdownSearchIndices({
        type: getIsSelected(item, dropdownSearchIndices)
          ? DropdownReducerEnum.REMOVE_ITEM
          : DropdownReducerEnum.ADD_ITEM,
        payload: {
          indexName: item.indexName,
          item: item,
        },
      });
      break;
    case FormTypeEnum.RADIO_BUTTON:
      updateDropdownSearchIndices({
        type: DropdownReducerEnum.RESET_INDEX,
        payload: {
          indexName: item.indexName,
        },
      });
      updateDropdownSearchIndices({
        type: DropdownReducerEnum.ADD_ITEM,
        payload: {
          indexName: item.indexName,
          item: item,
        },
      });
      break;
    case FormTypeEnum.RADIO_LINK:
      return;
    case FormTypeEnum.ACTION_LINK:
      const actionLinkContainer = dropdownUnits
        ?.find((singleUnit) => singleUnit.indexName === item.indexName)
        ?.items?.find(
          (singleElement) =>
            singleElement.formType === FormTypeEnum.ACTION_LINK_CONTAINER
        );

      if (actionLinkAnyNonEmptyValue) {
        updateDropdownSearchIndices({
          type: DropdownReducerEnum.ADD_ITEM,
          payload: {
            indexName: item.indexName,
            item: {
              ...actionLinkContainer,
              value: item.value,
            },
          },
        });
      }

      break;
    case FormTypeEnum.ACTION_LINK_CONTAINER:
      updateDropdownSearchIndices({
        type: DropdownReducerEnum.ADD_ITEM,
        payload: {
          indexName: item.indexName,
          item: item,
        },
      });
      break;
    default:
      return;
  }
}

/**
 *
 * @param fieldSearchFromUrl
 * @returns {{
      dropdownUnits: Array.<DropdownUnit>,
      dropdownSearchIndices: Array.<DropdownSearchIndex>,
      resetDropdownIndices: function,
      getIsSelected: function,
      toggleIsSelected: function,
      getItemFromDropdownSearchIndices: function,
      resetSingleIndex: function
 * }}
 */
export function useDropdownSearchIndices(fieldSearchFromUrl) {
  //// ---- DropdownSearchIndices ----
  /** @typedef {{indexName: string, items: DropdownInputArray, comparator?: string, formatValue?: function}} DropdownUnit */
  const /** @type {Array.<DropdownUnit>} */ dropdownUnits =
      useDefaultItemsForDropdownUnits({
        initDropdowns:
          fieldSearchFromUrl.dropdownSearchIndices ||
          getDefaultDropdownIndices(),
      });

  const [dropdownInitState, setDropdownInitState] = useState([]);

  /** @typedef {({ type?: string, payload: { indexName: string, menuItemsState: Array.<Object> }}) => void} UpdateDropdownSearchIndices */
  /** @typedef {{value: (Array.<string>|Array.<Object<>>), searchIndex: string}} DropdownSearchIndex */
  /** @type {[Array.<DropdownSearchIndex>, UpdateDropdownSearchIndices]} reducer */
  const [dropdownSearchIndices, updateDropdownSearchIndices] = useReducer(
    dropdownReducer,
    getDefaultDropdownIndices(),
    (initState) => (!isEmpty(dropdownInitState) ? dropdownInitState : initState)
  );

  useEffect(() => {
    updateDropdownSearchIndices({
      type: DropdownReducerEnum.RESET,
      payload: fieldSearchFromUrl.dropdownSearchIndices,
    });
  }, [JSON.stringify(fieldSearchFromUrl.dropdownSearchIndices)]);

  function resetDropdownIndices() {
    setDropdownInitState([]);
    updateDropdownSearchIndices({ type: DropdownReducerEnum.RESET });
  }
  const resetSingleIndexPre = (indexName) =>
    resetSingleIndex(
      indexName,
      dropdownSearchIndices,
      updateDropdownSearchIndices
    );
  const getItemFromDropdownSearchIndicesPre = (itemName, indexName) =>
    getItemFromDropdownSearchIndices(
      itemName,
      indexName,
      dropdownSearchIndices
    );
  const getIsSelectedPre = (item) => getIsSelected(item, dropdownSearchIndices);
  const toggleIsSelectedPre = (item) =>
    toggleIsSelected(
      item,
      dropdownSearchIndices,
      dropdownUnits,
      updateDropdownSearchIndices
    );

  return {
    dropdownUnits: dropdownUnits,
    dropdownSearchIndices: dropdownSearchIndices,

    // Dropdown Methods
    resetDropdownIndices: resetDropdownIndices,
    resetSingleIndex: resetSingleIndexPre,
    getItemFromDropdownSearchIndices: getItemFromDropdownSearchIndicesPre,
    getIsSelected: getIsSelectedPre,
    toggleIsSelected: toggleIsSelectedPre,
  };
}
