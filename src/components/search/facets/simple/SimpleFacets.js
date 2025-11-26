import { AdvancedFacets } from "@/components/search/facets/advanced/advancedFacets";
import useFilters, { includedTypes } from "@/components/hooks/useFilters";
import { useData } from "@/lib/api/api";
import * as searchFragments from "@/lib/api/search.fragments";
import useQ from "@/components/hooks/useQ";
import { useQuickFilters } from "@/components/search/advancedSearch/useQuickFilters";

export function SimpleFacets({
  facets = [],
  isLoading = false,
  selectedFacets = [],
  onItemClick = () => {},
}) {
  return (
    <AdvancedFacets
      facets={facets}
      isLoading={isLoading}
      selectedFacets={selectedFacets}
      onItemClick={onItemClick}
      origin="simpleSearch"
      translateContext="facets"
    />
  );
}

export function mapQuickFilters(selectedQuickFilters = []) {
  const mappedFilters = {};

  const valueMap = {
    nonfiction: "Faglitteratur",
    fiction: "Skønlitteratur",
    online: "Digital",
    fysisk: "Fysisk",
  };

  const map = {
    "term.childrenoradults": "childrenOrAdults",
    "term.fictionnonfiction": "fictionNonfiction",
    "term.accesstype": "accessTypes",
  };

  selectedQuickFilters.forEach((quickFilter) => {
    if (Object.keys(map).includes(quickFilter.searchIndex)) {
      mappedFilters[map[quickFilter.searchIndex]] = [
        valueMap[quickFilter.value] || quickFilter.value,
      ];
    }
  });

  return mappedFilters;
}

export default function Wrap() {
  // connected filters hook
  const { filters, setFilter, setQuery } = useFilters();

  // connected q hook
  const { hasQuery, getQuery } = useQ();

  const { selectedQuickFilters } = useQuickFilters();

  // Get q object
  const q = getQuery();

  // map quickfilters to filters
  const mapped = mapQuickFilters(selectedQuickFilters);

  // extract selected workType, if any
  const workType = filters.workTypes?.[0];
  // Exclude irrelevant worktype categories
  // undefined will result in a include-all fallback at the fragment api call function.
  const facetFilters = (workType && includedTypes[workType]) || undefined;

  const { data, isLoading } = useData(
    hasQuery &&
      searchFragments.facets({
        q,
        filters: { ...filters, ...mapped },
        facets: facetFilters,
      })
  );
  const onItemClick = (selected) => {
    setFilter(selected);
    setQuery({ include: filters });
  };

  // do an array that matches advanced facets
  const parseForSelected = (filters) => {
    const facetsAsArray = [];
    for (const [key, value] of Object.entries(filters)) {
      if (value.length > 0) {
        facetsAsArray.push({ searchIndex: key, values: value });
      }
    }
    return facetsAsArray;
  };

  return (
    <SimpleFacets
      facets={data?.search?.facets}
      onItemClick={onItemClick}
      selectedFacets={parseForSelected(filters)}
      isLoading={isLoading}
    />
  );
}
