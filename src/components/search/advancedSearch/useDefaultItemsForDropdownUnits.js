import {
  dummy__generalmaterialTypes,
  dummy__languages,
} from "@/components/search/advancedSearch/advancedSearchHelpers/dummy__default_advanced_search_fields";
import { convertToDropdownInput } from "@/components/search/advancedSearch/advancedSearchHelpers/convertToDropdownInput";
import { FormTypeEnum } from "@/components/search/advancedSearch/advancedSearchHelpers/helperComponents/HelperComponents";

export const DropdownIndicesEnum = {
  LANGUAGES: "phrase.mainlanguage",
  MATERIAL_TYPES_SPECIFIC: "phrase.specificmaterialtype",
  MATERIAL_TYPES_GENERAL: "phrase.generalmaterialtype",
};

/**
 *
 * @param {Array.<DropdownSearchIndex>} initDropdowns
 * @param {DropdownUnit} dropdownUnit
 * @returns {DropdownUnit}
 */
function getDropdownFromUrl({ initDropdowns, dropdownUnit }) {
  const actualSearchIndex = initDropdowns.find(
    (initDropdown) => initDropdown?.searchIndex === dropdownUnit.indexName
  );

  if (!actualSearchIndex) {
    return dropdownUnit;
  }

  const res = dropdownUnit.items.map((singleItem) => {
    return {
      ...singleItem,
      isSelected:
        [FormTypeEnum.CHECKBOX, FormTypeEnum.RADIO_BUTTON].includes(
          singleItem.formType
        ) && actualSearchIndex.value.includes(singleItem?.name),
    };
  });

  return {
    indexName: dropdownUnit.indexName,
    items: /** @type DropdownInputArray */ res,
  };
}

/**
 *
 * @param initDropdowns
 * @returns {Array.<DropdownUnit>}
 */
export function useDefaultItemsForDropdownUnits({ initDropdowns }) {
  return [
    {
      items: dummy__generalmaterialTypes(),
      indexName: DropdownIndicesEnum.MATERIAL_TYPES_GENERAL,
    },
    {
      items: dummy__languages(),
      indexName: DropdownIndicesEnum.LANGUAGES,
    },
  ]
    .map((dropdownUnit) => {
      return {
        items: convertToDropdownInput(dropdownUnit.items),
        indexName: dropdownUnit.indexName,
      };
    })
    .map((dropdownUnit) =>
      getDropdownFromUrl({
        initDropdowns: initDropdowns,
        dropdownUnit: dropdownUnit,
      })
    );
}
