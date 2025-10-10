import { useData } from "@/lib/api/api";
import { subjectFacets } from "@/lib/api/creator.fragments";
import { SimpleDropDown } from "@/components/search/advancedSearch/advancedSearchSort/AdvancedSearchSort";
import Translate from "@/components/base/translate";

/**
 * Dropdown for subjects - handles data fetching and rendering
 */
export default function Subject({ creatorId, selected, onSelect, filters }) {
  // Exclude own filter from the filters object
  const filtersWithoutSubjects = { ...filters, subjects: null };

  const { data } = useData(
    creatorId &&
      subjectFacets({
        creatorId,
        filters: filtersWithoutSubjects,
      })
  );

  const facets = data?.complexFacets?.facets || [];

  // Find the facet.subject facet
  const subjectFacet = facets.find((facet) => facet.name === "facet.subject");

  // If loading, error, or no options, show empty dropdown but still allow clearing
  const options = subjectFacet?.values?.length
    ? subjectFacet.values
        .map((value) => value.key)
        .filter((subject) => subject.length <= 20)
        .sort()
    : [];
  return (
    <SimpleDropDown
      placeholder={Translate({ context: "search", label: "label-subject" })}
      selected={selected?.[0] || ""}
      onSelect={(entry) => (entry ? onSelect([entry]) : onSelect([]))}
      options={options}
      clearRow="Alle"
    />
  );
}
