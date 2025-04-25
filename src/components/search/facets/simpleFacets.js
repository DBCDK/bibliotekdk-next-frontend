import { AdvancedFacets } from "@/components/search/advancedSearch/facets/advancedFacets";
import useFilters from "@/components/hooks/useFilters";
import { useData } from "@/lib/api/api";
import * as searchFragments from "@/lib/api/search.fragments";
import useQ from "@/components/hooks/useQ";

export function SimpleFacets({
  facets = [],
  isLoading = false,
  selectedFacets = [],
  onItemClick = () => {
    alert("fisk");
  },
}) {
  // console.log(facets, "STORY FACETS");
  return (
    <>
      <div>FISK</div>
      <AdvancedFacets
        facets={facets}
        isLoading={isLoading}
        selectedFacets={selectedFacets}
        onItemClick={onItemClick}
        origin="simpleSearch"
      />
    </>
  );
}

export default function Wrap() {
  // connected filters hook
  const { filters, setFilters, setQuery, isSynced } = useFilters();

  // connected q hook
  const { hasQuery, getQuery } = useQ();

  // Get q object
  const q = getQuery();

  const { data, isLoading } = useData(
    hasQuery &&
      searchFragments.facets({
        q,
        filters: filters,
      })
  );
  const onItemClick = (selected) => {
    console.log(selected, "SIMPLE FACETS SELECTED");
    console.log(filters, "SIMPLE FACETS FILTERS");
    const fisk = { [selected.facetName]: [selected.value.term] };

    console.log(fisk, "FISK");
    setFilters({ ...filters, ...fisk });
    setQuery({});
  };

  console.log(data, "SIMPLE SEARCH DATA");
  return (
    <SimpleFacets facets={data?.search?.facets} onItemClick={onItemClick} />
  );
}
