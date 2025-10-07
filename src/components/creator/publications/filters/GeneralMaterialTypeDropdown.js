import { useData } from "@/lib/api/api";
import { generalMaterialTypeFacets } from "@/lib/api/creator.fragments";
import { SimpleDropDown } from "@/components/search/advancedSearch/advancedSearchSort/AdvancedSearchSort";
import Translate from "@/components/base/translate";

/**
 * Dropdown for general material types - handles data fetching and rendering
 */
export default function GeneralMaterialType({
  creatorId,
  selected,
  onSelect,
  filters,
}) {
  // Exclude own filter from the filters object
  const filtersWithoutMaterialType = { ...filters, generalMaterialType: null };

  const { data, isLoading, error } = useData(
    creatorId &&
      generalMaterialTypeFacets({
        creatorId,
        filters: filtersWithoutMaterialType,
      })
  );

  const facets = data?.complexSearch?.facets || [];

  // Find the facet.generalmaterialtype facet
  const materialTypeFacet = facets.find(
    (facet) => facet.name === "facet.generalmaterialtype"
  );

  // If loading, error, or no options, show empty dropdown but still allow clearing
  const options = materialTypeFacet?.values?.length
    ? materialTypeFacet.values.map((value) => value.key).sort()
    : [];

  return (
    <SimpleDropDown
      placeholder={Translate({
        context: "facets",
        label: "label-materialTypes",
      })}
      selected={selected}
      onSelect={(entry) => onSelect(entry || "")}
      options={options}
      clearRow="Alle"
    />
  );
}
