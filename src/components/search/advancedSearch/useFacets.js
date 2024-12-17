import { useRouter } from "next/router";
import { AdvFacetsTypeEnum } from "@/lib/enums";
import { useGlobalState } from "@/components/hooks/useGlobalState";
import { useEffect } from "react";
import { facetsFromUrl } from "@/components/search/advancedSearch/utils";

let initialized = false;
export function useFacets() {
  const router = useRouter();

  const [facetsQuery, setFacetsQuery] = useGlobalState({
    key: "GLOBALFACETS",
    initial: facetsFromUrl(router),
  });

  // we need a useEffect to sync state (selectedFacets) with facets from the query
  useEffect(() => {
    if (!initialized) {
      setFacetsQuery(facetsFromUrl(router));
      initialized = true;
    }
    // @TODO - this might be a way to reset facets ?
    // return () => {
    //   // This line only evaluates to true after the componentWillUnmount happens
    //   if (componentWillUnmount.current) {
    //     console.log(params)
    //   }
    // }
  }, [router?.query?.facets]);
  //
  // // we also need a useEffect to reset facets when we leave the page (/avanceret)
  useEffect(() => {
    if (
      initialized &&
      router &&
      !router?.pathname?.includes("/avanceret") &&
      !process.env.STORYBOOK_ACTIVE
    ) {
      restartFacetsHook();
    }
  }, []);

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

    setFacetsQuery(JSON.stringify(selectedFacets));
    pushQuery(replace, selectedFacets);
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
      // we removed the last value in the facet -> remove entire facet
      const indexToDelete = selectedFacets?.findIndex((facet) => {
        return facet.searchIndex.includes(searchindex);
      });
      selectedFacets.splice(indexToDelete, 1);
    }

    setFacetsQuery(JSON.stringify(selectedFacets));
    pushQuery(replace, selectedFacets);
  }

  /**
   * Insert a facet OR replace the values in a facet.
   * @param values
   * @param searchindex
   * @param replace
   */
  function replaceFacetValue(values, searchindex, replace) {
    const selectedFacets = JSON.parse(facetsQuery);
    const currentFacet = selectedFacets.find((facet) => {
      return facet.searchIndex === searchindex;
    });

    if (currentFacet) {
      // if values are empty we want to remove entire facet
      if (values.length < 1) {
        const indexToDelete = selectedFacets?.findIndex((facet) => {
          return facet.searchIndex.includes(searchindex);
        });
        selectedFacets.splice(indexToDelete, 1);
      } else {
        currentFacet.values = values.map((value) => ({
          value: value,
          name: value,
        }));
      }
    } else {
      const newFacet = {
        searchIndex: searchindex,
        values: values.map((value) => ({
          value: value,
          name: value,
        })),
      };
      selectedFacets.push(newFacet);
    }

    setFacetsQuery(JSON.stringify(selectedFacets));
    pushQuery(replace, selectedFacets);
  }

  /**
   * Push query
   * @param replace
   *  replace or push
   * @param selectedFacets
   * @global
   *  globel or local facets
   *
   */
  function pushQuery(replace = false, selectedFacets) {
    const query = router?.query;

    // remove paging if set
    if (query?.page) {
      delete query.page;
    }

    query["facets"] = JSON.stringify(selectedFacets);

    // replace/push to router
    replace
      ? router.replace({
          pathname: router.pathname,
          query: query,
        })
      : router.push(
          {
            pathname: router.pathname,
            query: query,
          },
          undefined,
          { shallow: true, scroll: false }
        );
  }

  /**
   * Sets traceId in url. Will always set it in the end of the url
   */
  const setTraceId = (traceId) => {
    if (!traceId) {
      return;
    }

    const query = { ...router.query, tid: traceId };

    router.push(
      {
        pathname: router.pathname,
        query: query,
      },
      undefined,
      { shallow: true, scroll: false }
    );
  };

  /**
   * Push empty facet query to url
   */
  function clearFacetsUrl() {
    const query = { ...router?.query };
    delete query["facets"];
    router.push({
      pathname: router.pathname,
      query: query,
    });

    initialized = false;
  }

  function restartFacetsHook() {
    if (initialized) {
      // setFacetsQuery("[]");
      initialized = false;
    }
  }

  function resetFacets() {
    setFacetsQuery("[]");
  }

  const facetLimit = 50;
  const sortChronological = ["let", "lix", "publicationyear"];

  return {
    selectedFacets: JSON.parse(facetsQuery),
    addFacet,
    removeFacet,
    replaceFacetValue,
    facetLimit,
    facetsFromEnum,
    clearFacetsUrl,
    resetFacets,
    restartFacetsHook,
    pushQuery,
    sortChronological,
    setTraceId,
  };
}
