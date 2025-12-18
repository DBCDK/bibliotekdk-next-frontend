import { useData } from "@/lib/api/api";
import { genreAndFormFacets } from "@/lib/api/creator.fragments";
import { SimpleDropDown } from "@/components/search/advancedSearch/advancedSearchSort/AdvancedSearchSort";
import Translate from "@/components/base/translate";

/**
 * Dropdown for genre and form - handles data fetching and rendering
 */
export default function GenreAndForm({
  creatorId,
  selected,
  onSelect,
  filters,
}) {
  // Exclude own filter from the filters object
  const filtersWithoutGenreAndForm = { ...filters, genreAndForm: null };

  const { data } = useData(
    creatorId &&
      genreAndFormFacets({
        creatorId,
        filters: filtersWithoutGenreAndForm,
      })
  );
  const facets = data?.complexSearch?.facets || [];

  // Find the facet.genreandform facet
  const genreAndFormFacet = facets.find(
    (facet) => facet.name === "facet.genreandform"
  );

  // If loading, error, or no options, show empty dropdown but still allow clearing
  const options = genreAndFormFacet?.values?.length
    ? genreAndFormFacet.values.map((value) => value.key).sort()
    : [];

  return (
    <SimpleDropDown
      placeholder={Translate({
        context: "facets",
        label: "label-genreAndForm",
      })}
      selected={selected}
      onSelect={(entry) => onSelect(entry || "")}
      options={options}
      clearRow="Alle"
    />
  );
}
