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
  const { filters, setAFilter, setQuery, isSynced } = useFilters();

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
    setAFilter(selected);
    setQuery({ include: filters });
  };

  // do an array that matches advanced facets
  const parseForSelected = (filters) => {
    const facetsAsArray = [];
    for (const [key, value] of Object.entries(filters)) {
      // console.log(`${key}: ${value}`);
      if (value.length > 0) {
        facetsAsArray.push({ searchIndex: key, values: value });
      }
    }
    return facetsAsArray;
  };

  // console.log(data, "SIMPLE SEARCH DATA");
  return (
    <SimpleFacets
      facets={data?.search?.facets}
      onItemClick={onItemClick}
      selectedFacets={parseForSelected(filters)}
    />
  );
}
