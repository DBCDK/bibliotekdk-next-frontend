// import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AdvFacetsTypeEnum } from "@/lib/enums";
import { useGlobalState } from "@/components/hooks/useGlobalState";
import { useEffect, useState } from "react";
import { facetsFromUrl } from "@/components/search/advancedSearch/utils";

let initialized = false;
export function useFacets() {
  const router = useRouter();

  const [facetsQuery, setFacetsQuery] = useGlobalState({
    key: "GLOBALFACETS",
    initial: facetsFromUrl(),
  });

  // const [selectedFacets, setSelectedFacets] = useState(facetsFromUrl(router));

  // we need a useEffect to sync state (selectedFacets) with facets from the query
  useEffect(() => {
    // console.log(router?.query?.facets, "ROUTER FACETS");
    if (!initialized) {
      setFacetsQuery(facetsFromUrl(router));
      console.log(facetsQuery, "FACETSQUERY");
      initialized = true;
    }
  }, [router?.query?.facets]);
  //
  // // we also need a useEffect to syncronize the global facets with the selected facets
  // useEffect(() => {
  //   setFacetsQuery(JSON.stringify(selectedFacets));
  // }, [selectedFacets]);

  const facetsFromEnum = Object.values(AdvFacetsTypeEnum).map((fac) =>
    fac.toUpperCase()
  );

  /**
   * Add an extra facet and push facets to query - we keep facets in a state for
   * advanced search context to understand
   */
  function addFacet(value, searchindex, replace = false) {
    const selectedFacets = JSON.parse(facetsQuery);
    // check if searchindex is already in facets
    const addToIndex = selectedFacets.find((facet) => {
      return facet.searchIndex === searchindex;
    });

    // @TODO translate name :)
    if (addToIndex !== undefined) {
      // avoid duplicates
      const alreadythere = !!addToIndex.values.find(
        (val) => val.value === value && val.name === value
      );

      if (!alreadythere) {
        addToIndex.values.push({ value: value, name: value });
      }
    } else {
      const newFacet = {
        searchIndex: searchindex,
        values: [{ value: value, name: value }],
      };
      selectedFacets.push(newFacet);
    }

    console.log(selectedFacets, "ADD SELECTED FACETS");

    setFacetsQuery(JSON.stringify(selectedFacets));

    pushQuery(replace);
  }

  /**
   * Push query
   * @param replace
   *  replace or push
   * @global
   *  globel or local facets
   *
   */
  function pushQuery(replace = false, global = false) {
    const query = router?.query;
    // const facets = JSON.stringify(selectedFacets);
    // const facets = facetsFromUrl(router);

    console.log(facetsQuery, "PUSHQUERY");

    query["facets"] = facetsQuery;
    // start from scratch - reset global query
    // setFacetsQuery("[]");

    // replace/push to router
    replace
      ? router.replace({
          pathname: router.pathname,
          query: query,
        })
      : router.push({
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

    // setFacetsQuery(facetsFromUrl());
  }

  /**
   * Remove a facet value from selection and push facets to query
   * @param value
   * @param searchindex
   */
  function removeFacet(value, searchindex, replace = false) {
    const selectedFacets = JSON.parse(facetsQuery);

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
    // setSelectedFacets((prev) => {
    //   return [...prev];
    // });

    setFacetsQuery(JSON.stringify(selectedFacets));
    // setFacetsQuery(selectedFacets);
    pushQuery(replace);
  }

  const facetLimit = 50;

  return {
    selectedFacets: JSON.parse(facetsQuery),
    addFacet,
    removeFacet,
    facetLimit,
    facetsFromEnum,
    clearFacetsUrl,
    pushQuery,
  };
}
