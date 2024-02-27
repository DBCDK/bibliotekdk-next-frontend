import { useState } from "react";
import { useRouter } from "next/router";
import { AdvFacetsTypeEnum } from "@/lib/enums";

export function useFacets() {
  const router = useRouter();
  const [selectedFacets, setSelectedFacets] = useState(facetsFromUrl());

  const facetsFromEnum = Object.values(AdvFacetsTypeEnum).map((fac) =>
    fac.toUpperCase()
  );

  /**
   * Add an extra facet and push facets to query - we keep facets in a state for
   * advanced search context to understand
   */
  function addFacet(value, searchindex) {
    // check if searchindex is already in facets
    const addToIndex = selectedFacets.find((facet) => {
      return facet.searchIndex === searchindex;
    });

    // @TODO translate name :)
    if (addToIndex !== undefined) {
      addToIndex.values.push({ value: value, name: value });
      setSelectedFacets((prev) => {
        return [...prev];
      });
    } else {
      const newFacet = {
        searchIndex: searchindex,
        values: [{ value: value, name: value }],
      };
      selectedFacets.push(newFacet);

      setSelectedFacets((prev) => {
        return [...prev];
      });
    }

    pushFacetUrl();
  }

  /**
   * Push to query when a facet is added/removed
   */
  function pushFacetUrl() {
    const query = router?.query;
    query["facets"] = JSON.stringify(selectedFacets);
    router.push({
      pathname: router.pathname,
      query: query,
    });
  }

  /**
   * Remove a facet value from selection and push facets to query
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
    if (indexedFacet?.values?.length < 1) {
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

  const facetLimit = 50;

  return { selectedFacets, addFacet, removeFacet, facetLimit, facetsFromEnum };
}
