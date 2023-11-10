import {
  dummy__generalmaterialTypes,
  dummy__languages,
} from "@/components/search/advancedSearch/advancedSearchHelpers/dummy__default_advanced_search_fields";

export const DropdownIndicesEnum = {
  LANGUAGES: "phrase.mainlanguage",
  MATERIAL_TYPES_SPECIFIC: "phrase.specificmaterialtype",
  MATERIAL_TYPES_GENERAL: "phrase.generalmaterialtype",
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
