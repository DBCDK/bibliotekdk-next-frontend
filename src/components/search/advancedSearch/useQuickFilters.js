import { useRouter } from "next/router";
import { useGlobalState } from "@/components/hooks/useGlobalState";

export function useQuickFilters() {
  const router = useRouter();

  const [selectedQuickFilters, setSelectedQuickFilters] = useGlobalState({
    key: "GLOBALQUICKFILTERS",
    initial: quickFiltersFromUrl(),
  });

  // The quicfilters to display
  const quickfilters = [
    {
      label: "label-physical-online",
      searchIndex: "term.accesstype",
      values: [
        { label: "Alle", cql: null },
        { label: "Online", cql: "online" },
        { label: "Fysisk", cql: "fysisk" },
      ],
    },
    {
      label: "label-fiction-nonfiction",
      searchIndex: "term.fictionnonfiction",
      values: [
        { label: "Alle", cql: null },
        { label: "Fiktion", cql: "fiction" },
        { label: "Non-fiktion", cql: "nonfiction" },
      ],
    },
    {
      label: "label-children-adults",
      searchIndex: "term.childrenoradults",
      values: [
        { label: "Alle", cql: "" },
        { label: "Voksne", cql: "til voksne" },
        { label: "Børn", cql: "til børn" },
      ],
    },
  ];

  /**
   * Parse quickfilters in url -
   * @returns Array
   */
  function quickFiltersFromUrl() {
    const query = router?.query;
    const quickfilters = query?.quickfilters;

    // check the quickfilters
    const verifiedFilters = quickfilters && JSON.parse(quickfilters);
    return Array.isArray(verifiedFilters)
      ? JSON.stringify(verifiedFilters)
      : "[]";
  }

  function addQuickFilter(filter, value) {
    const copy = [...JSON.parse(selectedQuickFilters)];
    // there can only be one active selection pr. filter
    const filterIndex = copy?.findIndex(
      (filt) => filt.searchIndex === filter.searchIndex
    );

    // if found and value.cql is null we remove from query (Alle)
    if (filterIndex !== -1 && !value?.cql) {
      copy.splice(filterIndex, 1);
    }
    // if found replace cql value
    else if (filterIndex !== -1) {
      copy[filterIndex].value = value.cql;
    }
    // if quickfilter is NOT set -> set if value.cql is given
    else if (value.cql) {
      copy.push({
        searchIndex: filter.searchIndex,
        value: value.cql,
      });
    }
    setSelectedQuickFilters(JSON.stringify(copy));
    pushQuery({ selectedQuick: copy });
  }

  function resetQuickFilters() {
    setSelectedQuickFilters("[]");
  }
  /**
   * Push query
   * @param replace
   *  replace or push
   * @global
   *  globel or local facets
   *
   */
  function pushQuery({ replace = true, selectedQuick }) {
    const query = router?.query;

    // remove paging if set
    if (query?.page) {
      delete query.page;
    }

    if (selectedQuick.length > 0) {
      query["quickfilters"] = JSON.stringify(selectedQuick);
    } else {
      delete query["quickfilters"];
    }

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

  return {
    pushQuery,
    quickFilters: quickfilters,
    addQuickFilter,
    selectedQuickFilters: JSON.parse(selectedQuickFilters),
    resetQuickFilters,
  };
}
