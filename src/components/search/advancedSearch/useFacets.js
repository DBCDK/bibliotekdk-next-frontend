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
      return facet.searchIndex.includes(searchindex);
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
    setTimeout(() => {
      pushFacetUrl();
    }, 300);
  }

  function pushFacetUrl() {
    if (selectedFacets.length < 1) {
      return null;
    }

    const query = router?.query;
    query["facets"] = JSON.stringify(selectedFacets);
    router.push({
      pathname: router.pathname,
      query: query,
    });
  }

  /**
   * Remove a facet value from selection
   * @param value
   * @param searchindex
   */
  function removeFacet(value, searchindex) {
    // find the overall facet to handle
    const indexedFacet = selectedFacets?.find((facet) => {
      return facet.searchIndex.includes(searchindex);
    });
    // find facet(value) in values
    const indx = indexedFacet?.values?.findIndex((val) => val.value === value);
    indexedFacet?.values?.splice(indx, 1);
    // @TODO if values are empty -- remove entire facet
    if (indexedFacet?.values?.length < 1) {
      // @TODO delete
      const indexToDelete = selectedFacets?.findIndex((facet) => {
        return facet.searchIndex.includes(searchindex);
      });
      selectedFacets.splice(indexToDelete, 1);
    }
    setSelectedFacets((prev) => {
      return [...prev];
    });

    pushFacetUrl();
  }

  function facetsFromUrl() {
    const query = router?.query;

    const facets = query?.facets && JSON.parse(query?.facets);
    return facets || [];
  }

  return { selectedFacets, addFacet, removeFacet };
}
