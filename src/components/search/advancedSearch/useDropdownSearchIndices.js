import { useDefaultItemsForDropdownUnits } from "@/components/search/advancedSearch/useDefaultItemsForDropdownUnits";
import { useReducer, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { getDefaultDropdownIndices } from "@/components/search/advancedSearch/advancedSearchContext";

export const DropdownReducerEnum = Object.freeze({
  UPDATE: "UPDATE",
  RESET: "RESET",
});


export function useDropdownSearchIndices(fieldSearchFromUrl, workType) {
  console.log(
    "useDropdownSearchIndices.fieldSearchFromUrl",
    fieldSearchFromUrl
  );
  //// ---- DropdownSearchIndices ----
  const { dropdownUnits, dropdownsToRemove } = useDefaultItemsForDropdownUnits(
    {
      initDropdowns:
        fieldSearchFromUrl.dropdownSearchIndices || getDefaultDropdownIndices(),
    },
    workType
  );
  console.log("initDropdowns", dropdownUnits);
  console.log("indexes hook. dropdownsToRemove", dropdownsToRemove);

  const [dropdownInitState, setDropdownInitState] = useState([]);

  const [dropdownSearchIndices, setDropdownSearchIndices] = useState(
    getDefaultDropdownIndices()
  );

  const resetMenuItemsEvent = new Event("resetMenuItemsEvent");

  const updateDropdownSearchIndices = ({ payload, type }) => {
    console.log(
      " IN !!! IN UPDATE updateDropdownSearchIndices update state",
      payload
    );
    const newDropDowns = dropdownSearchIndices?.map((singleDropdownIndex) => {
      if (payload.indexName === singleDropdownIndex.searchIndex) {
        return {
          searchIndex: payload.indexName,
          value: payload.menuItemsState
            .filter((item) => item.isSelected === true)
            .map((item) => {
              console.log("updateDropdownSearchIndices item", item);
              return { value: item.value, name: item.name };
            }),
        };
      } else {
        return singleDropdownIndex;
      }
    });
    setDropdownSearchIndices(newDropDowns);
  };
  function resetDropdownIndices() {
    // setDropdownInitState([]);
    //  updateDropdownSearchIndices({ type: DropdownReducerEnum.RESET });

    setDropdownSearchIndices([]);
  }

  return {
    dropdownUnits: dropdownUnits,
    //  setDropdownInitState: setDropdownInitState,
    dropdownSearchIndices: dropdownSearchIndices,
    updateDropdownSearchIndices: updateDropdownSearchIndices,
    resetDropdownIndices: resetDropdownIndices,
    resetMenuItemsEvent: "resetMenuItemsEvent",
    dispatchResetMenuItemsEvent: () => dispatchEvent(resetMenuItemsEvent),
    dropdownsToRemove: dropdownsToRemove,
  };
}
