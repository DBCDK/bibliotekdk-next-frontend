// import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdvFacetsTypeEnum } from "@/lib/enums";
import { useGlobalState } from "@/components/hooks/useGlobalState";
import { useEffect, useState } from "react";

export function useFacets() {
  const router = useRouter();

  // const [facetsQuery, setFacetsQuery] = useGlobalState({
  //   key: "GLOBALFACETS",
  //   initial: "[]",
  // });

  const [selectedFacets, setSelectedFacets] = useState(facetsFromUrl());
  //
  useEffect(() => {
    setSelectedFacets(facetsFromUrl());
  }, [router?.query?.facets]);

  const facetsFromEnum = Object.values(AdvFacetsTypeEnum).map((fac) =>
    fac.toUpperCase()
  );

  /**
   * Add an extra facet and push facets to query - we keep facets in a state for
   * advanced search context to understand
   */
  function addFacet(value, searchindex) {
    //const selectedFacets = JSON.parse(facetsQuery);
    // check if searchindex is already in facets

    const addToIndex = selectedFacets.find((facet) => {
      return facet.searchIndex === searchindex;
    });

    console.log(addToIndex, selectedFacets, "ADDFACET");

    // @TODO translate name :)
    if (addToIndex !== undefined) {
      // avoid duplicates
      const alreadythere = !!addToIndex.values.find(
        (val) => val.value === value && val.name === value
      );

      if (!alreadythere) {
        addToIndex.values.push({ value: value, name: value });
        // setSelectedFacets((prev) => {
        //   return [...prev];
        // });
      }
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

    // console.log(selectedFacets, "SELECTED FACETS");
    //
    // setFacetsQuery(JSON.stringify(selectedFacets));
    pushQuery();

    // console.log(JSON.parse(facetsQuery), "FACETSQUERY");
  }

  /**
   * Push to query when a facet is added/removed
   */
  // function pushFacetUrl() {
  //   const query = router?.query;
  //   query["facets"] = JSON.stringify(selectedFacets);
  //
  //   setFacetsQuery(query?.facets);
  // }

  function pushQuery() {
    // console.log(facetsQuery, "FACETSQUERY");

    const query = router?.query;
    // query["facets"] = facetsQuery;
    query["facets"] = JSON.stringify(selectedFacets);

    router.push({
      pathname: router.pathname,
      query: query,
    });
  }

  /**
   * Push empty facet query to url
   */
  function clearFacetsUrl() {
    const query = router?.query;
    delete query["facets"];
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
    // const selectedFacets = JSON.parse(facetsQuery);

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

    // setFacetsQuery(JSON.stringify(selectedFacets));

    pushQuery();
    // pushFacetUrl();
  }

  function facetsFromUrl() {
    const query = router?.query;
    const facets = query?.facets;

    console.log(query, "QUERY");

    console.log(facets, "FACETSFROMURL");
    // return [];
    return facets ? JSON.parse(facets) : [];
  }

  const facetLimit = 50;

  return {
    selectedFacets: selectedFacets,
    addFacet,
    removeFacet,
    facetLimit,
    facetsFromEnum,
    clearFacetsUrl,
  };
}
