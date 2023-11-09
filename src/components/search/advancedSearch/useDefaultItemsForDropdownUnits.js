import {
  dummy__generalmaterialTypes,
  dummy__languages,
} from "@/components/search/advancedSearch/advancedSearchHelpers/dummy__default_advanced_search_fields";

export const DropdownIndicesEnum = {
  LANGUAGES: "term.mainlanguage",
  MATERIAL_TYPES_SPECIFIC: "term.specificmaterialtype",
  MATERIAL_TYPES_GENERAL: "term.generalmaterialtype",
};

export function useDefaultItemsForDropdownUnits() {
  return [
    {
      items: dummy__generalmaterialTypes(),
      indexName: DropdownIndicesEnum.MATERIAL_TYPES_GENERAL,
    },
    { items: dummy__languages(), indexName: DropdownIndicesEnum.LANGUAGES },
  ];
}
