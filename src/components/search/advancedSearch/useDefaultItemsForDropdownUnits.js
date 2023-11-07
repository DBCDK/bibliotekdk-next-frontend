import {
  dummy__languages,
  dummy__materialTypesSpecific,
} from "@/components/search/advancedSearch/advancedSearchHelpers/dummy__default_advanced_search_fields";

export const DropdownIndicesEnum = {
  LANGUAGES: "languages",
  MATERIAL_TYPES_SPECIFIC: "materialTypesSpecific",
};

export function useDefaultItemsForDropdownUnits() {
  return [
    {
      items: dummy__materialTypesSpecific(),
      indexName: DropdownIndicesEnum.MATERIAL_TYPES_SPECIFIC,
    },
    { items: dummy__languages(), indexName: DropdownIndicesEnum.LANGUAGES },
  ];
}
