import { useData } from "@/lib/api/api";
import { languageFacets } from "@/lib/api/creator.fragments";
import { SimpleDropDown } from "@/components/search/advancedSearch/advancedSearchSort/AdvancedSearchSort";
import Translate from "@/components/base/translate";

/**
 * Dropdown for languages - handles data fetching and rendering
 */
export default function Language({ creatorId, selected, onSelect, filters }) {
  // Exclude own filter from the filters object
  const filtersWithoutLanguage = { ...filters, language: null };

  const { data } = useData(
    creatorId &&
      languageFacets({
        creatorId,
        filters: filtersWithoutLanguage,
      })
  );

  const facets = data?.complexSearch?.facets || [];

  // Find the facet.language facet
  const languageFacet = facets.find(
    (facet) => facet.name === "facet.mainlanguage"
  );

  // If loading, error, or no options, show empty dropdown but still allow clearing
  const options = languageFacet?.values?.length
    ? languageFacet.values.map((value) => value.key).sort()
    : [];

  return (
    <SimpleDropDown
      placeholder={Translate({
        context: "facets",
        label: "label-mainLanguages",
      })}
      selected={selected}
      onSelect={(entry) => onSelect(entry || "")}
      options={options}
      clearRow="Alle"
    />
  );
}
