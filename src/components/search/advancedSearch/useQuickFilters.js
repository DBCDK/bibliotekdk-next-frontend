import { useRouter } from "next/router";
import { useGlobalState } from "@/components/hooks/useGlobalState";
import { useEffect, useRef, useMemo } from "react";

/** Konstante quickfilters (stabil reference på tværs af renders) */
const QUICK_FILTERS = [
  {
    label: "label-physical-online",
    searchIndex: "term.accesstype",
    values: [
      { label: "Online", cql: "online" },
      { label: "Fysisk", cql: "fysisk" },
    ],
  },
  {
    label: "label-fiction-nonfiction",
    searchIndex: "term.fictionnonfiction",
    values: [
      { label: "Fiktion", cql: "fiction" },
      { label: "Non-fiktion", cql: "nonfiction" },
    ],
  },
  {
    label: "label-children-adults",
    searchIndex: "term.childrenoradults",
    values: [
      { label: "Voksne", cql: "til voksne" },
      { label: "Børn", cql: "til børn" },
    ],
  },
];

/** Læs quickfilters fra URL som array */
function readQuickFiltersFromUrl(router) {
  const q = router?.query?.quickfilters;
  if (!q) return [];
  try {
    const parsed = JSON.parse(q);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Byg Next.js url/opts til router */
function toUrlAndOpts(router, query) {
  const url = { pathname: router.pathname, query };
  const opts = { shallow: true, scroll: false };
  return [url, undefined, opts];
}

export function useQuickFilters() {
  const router = useRouter();
  const didInitRef = useRef(false);

  // Bemærk: vi lagrer som STRING i global state (kompatibelt med din eksisterende kode)
  const [selectedQuickFiltersStr, setSelectedQuickFiltersStr] = useGlobalState({
    key: "GLOBALQUICKFILTERS",
    initial: JSON.stringify(readQuickFiltersFromUrl(router)),
  });

  const selectedQuickFilters = useMemo(() => {
    try {
      const arr = JSON.parse(selectedQuickFiltersStr);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }, [selectedQuickFiltersStr]);

  /** De quickfilters som vises i UI */
  const quickFilters = QUICK_FILTERS;

  // Sync fra URL ved første relevante ændring
  useEffect(() => {
    if (!didInitRef.current) {
      const fromUrl = readQuickFiltersFromUrl(router);
      setSelectedQuickFiltersStr(JSON.stringify(fromUrl));
      didInitRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.quickfilters]);

  // Reset når vi ikke er på /find (on-mount check)
  useEffect(() => {
    const onFindPage =
      router?.pathname?.includes("/find") || process.env.STORYBOOK_ACTIVE;
    if (didInitRef.current && !onFindPage) {
      resetQuickFilters();
    }
    // Vi vil kun køre dette ved mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setSelectedQuickFilters(arr) {
    setSelectedQuickFiltersStr(JSON.stringify(arr ?? []));
  }

  function addQuickFilter(filter, value, selected) {
    const copy = [...selectedQuickFilters];

    // ét aktivt valg pr. filter
    const idx = copy.findIndex(
      (filt) => filt.searchIndex === filter.searchIndex
    );

    if ((idx !== -1 && !value?.cql) || !selected) {
      // fjern hvis (valgt "Alle"/tom cql) eller hvis afvalgt
      copy.splice(idx, 1);
    } else if (idx !== -1) {
      // erstat eksisterende værdi
      copy[idx].value = value.cql;
    } else if (value?.cql) {
      // tilføj nyt valg
      copy.push({ searchIndex: filter.searchIndex, value: value.cql });
    }

    setSelectedQuickFilters(copy);
    pushQuery({ selectedQuick: copy, replace: true });
  }

  function resetQuickFilters() {
    didInitRef.current = false;
    setSelectedQuickFilters([]);
  }

  /** Fjern quickfilters fra URL (bevar scroll-position) */
  function clearQuickFiltersUrl() {
    setSelectedQuickFilters([]);

    const query = { ...router.query };
    delete query.quickfilters;

    const [url, as, opts] = toUrlAndOpts(router, query);
    router.push(url, as, opts);
  }

  /**
   * Opdater query i URL (bevar scroll, fjern page ved filter-ændringer)
   * @param {Object} options
   *  - replace: boolean (default true)
   *  - selectedQuick: array af valgte quickfilters
   */
  function pushQuery({
    replace = true,
    selectedQuick = selectedQuickFilters,
  } = {}) {
    const query = { ...router.query };

    // Fjern paging når filter ændres
    if (query.page) delete query.page;

    if (selectedQuick?.length > 0) {
      query.quickfilters = JSON.stringify(selectedQuick);
    } else {
      delete query.quickfilters;
    }

    const [url, as, opts] = toUrlAndOpts(router, query);
    if (replace) {
      router.replace(url, as, opts);
    } else {
      router.push(url, as, opts);
    }
  }

  return {
    // data
    quickFilters,
    selectedQuickFilters,

    // actions
    addQuickFilter,
    resetQuickFilters,
    clearQuickFiltersUrl,
    pushQuery,
  };
}
