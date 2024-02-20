import { useState } from "react";
import { useRouter } from "next/router";

export function useFacets() {
  const router = useRouter();
  const [selectedFacets, setSelectedFacets] = useState(facetsFromUrl());

  /**
   * Add an extra facet - we keep facets in a state for
   * advanced search context to understand
   */
  function addFacet(value, searchindex) {
    // check if searchindex is already in facets
    const addToIndex = selectedFacets.find((facet) => {
      return facet.searchIndex === searchindex;
    });
    if (addToIndex !== undefined) {
      addToIndex.values.push({ value: value, name: value });
      setSelectedFacets((prev) => {
        return [...prev];
      });
    } else {
      const newFacets = [
        {
          searchIndex: searchindex,
          values: [{ value: value, name: value }],
        },
      ];
      setSelectedFacets((prev) => {
        return [...prev, ...newFacets];
      });
    }
  }

  /**
   * Remove a facet value from selection
   * @param value
   * @param searchindex
   */
  function removeFacet(value, searchindex) {
    // find the overall facet to handle
    const indexedFacet = selectedFacets.find((facet) => {
      return facet.searchIndex === searchindex;
    });
    // find facet(value) in values
    const indx = indexedFacet.values.findIndex((val) => val.value === value);
    indexedFacet.values.splice(indx, 1);
    setSelectedFacets((prev) => {
      return [...prev];
    });
  }

  function facetsFromUrl() {
    const query = router?.query;
    const fieldSearch = query?.fieldSearch && JSON.parse(query?.fieldSearch);
    return fieldSearch?.facets || [];
  }

  return { selectedFacets, addFacet, removeFacet, facetsFromUrl };
}
