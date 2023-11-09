import {
  dummy__languages,
  dummy__specificmaterialTypes,
} from "@/components/search/advancedSearch/advancedSearchHelpers/dummy__default_advanced_search_fields";

export const DropdownIndicesEnum = {
  LANGUAGES: "term.mainlanguage",
  MATERIAL_TYPES_SPECIFIC: "term.specificmaterialtype",
};

export function useDefaultItemsForDropdownUnits() {
  return [
    {
      items: dummy__specificmaterialTypes(),
      indexName: DropdownIndicesEnum.MATERIAL_TYPES_SPECIFIC,
    },
    { items: dummy__languages(), indexName: DropdownIndicesEnum.LANGUAGES },
  ];
}
