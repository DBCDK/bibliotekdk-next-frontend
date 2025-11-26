import { useRouter } from "next/router";
import { AdvFacetsTypeEnum } from "@/lib/enums";
import { useGlobalState } from "@/components/hooks/useGlobalState";
import { useEffect, useMemo } from "react";
import { facetsFromUrl } from "@/components/search/advancedSearch/utils";

export function useFacets() {
  const router = useRouter();

  // Vi lagrer som STRING (kompatibelt med eksisterende kode)
  const [facetsQuery, setFacetsQuery] = useGlobalState({
    key: "GLOBALFACETS",
    initial: facetsFromUrl(router),
  });

  const selectedFacets = useMemo(() => {
    try {
      const arr = JSON.parse(facetsQuery);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }, [facetsQuery]);

  const facetsFromEnum = useMemo(
    () => Object.values(AdvFacetsTypeEnum).map((f) => f.toUpperCase()),
    []
  );

  // ---------- Helpers ----------

  const normVal = (value) =>
    (typeof value === "object"
      ? value?.value ?? value?.name ?? value?.key ?? ""
      : String(value ?? "")
    ).trim();

  const toPair = (s) => ({ value: s, name: s });

  function toUrlAndOpts(query) {
    const url = { pathname: router.pathname, query };
    const opts = { shallow: true, scroll: false };
    return [url, undefined, opts];
  }

  function setSelectedFacets(arr) {
    setFacetsQuery(JSON.stringify(arr ?? []));
  }

  useEffect(() => {
    const fromUrl = facetsFromUrl(router); // returnerer en STRING
    setFacetsQuery(fromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router?.query?.facets, router?.pathname]);

  // ---------- URL sync helper ----------

  function syncUrlFromSelected(replace, next, traceId) {
    if (!next?.length) {
      clearFacetsUrl();
      return;
    }

    const nextStr = JSON.stringify(next);
    const currentStr =
      typeof router?.query?.facets === "string"
        ? router.query.facets
        : JSON.stringify(router?.query?.facets ?? "");

    if (currentStr === nextStr) return;

    const query = { ...router?.query };
    if (query?.page) delete query.page;
    query.facets = nextStr;

    if (traceId) {
      delete query.tid;
      query.tid = traceId;
    }

    const [url, as, opts] = toUrlAndOpts(query);
    if (replace) router.replace(url, as, opts);
    else router.push(url, as, opts);
  }

  // ---------- Public API ----------

  function addFacet(value, searchindex, replace = false, traceId) {
    const s = normVal(value);
    if (!s) return;

    const next = selectedFacets.map((f) => ({
      ...f,
      values: Array.isArray(f.values) ? [...f.values] : [],
    }));

    let facet = next.find((f) => f.searchIndex === searchindex);
    let changed = false;

    if (!facet) {
      facet = { searchIndex: searchindex, values: [] };
      next.push(facet);
      changed = true;
    }

    const exists = facet.values.some((v) => v?.value === s || v?.name === s);
    if (!exists) {
      facet.values.push(toPair(s));
      changed = true;
    }

    if (!changed) return;

    setSelectedFacets(next);
    syncUrlFromSelected(replace, next, traceId);
  }

  function removeFacet(value, searchindex, replace = false) {
    const s = normVal(value);

    const next = selectedFacets.map((f) => ({
      ...f,
      values: Array.isArray(f.values) ? [...f.values] : [],
    }));

    const facetIdx = next.findIndex((f) => f.searchIndex === searchindex);
    if (facetIdx === -1) return;

    const vals = next[facetIdx].values;
    const valIdx = vals.findIndex((v) => v?.value === s || v?.name === s);
    if (valIdx === -1) return;

    vals.splice(valIdx, 1);
    if (!vals.length) next.splice(facetIdx, 1);

    setSelectedFacets(next);
    syncUrlFromSelected(replace, next);
  }

  function replaceFacetValue(values, searchindex, replace) {
    const next = selectedFacets.map((f) => ({
      ...f,
      values: Array.isArray(f.values) ? [...f.values] : [],
    }));

    const facetIdx = next.findIndex((f) => f.searchIndex === searchindex);

    if (!values?.length) {
      if (facetIdx > -1) {
        next.splice(facetIdx, 1);
        setSelectedFacets(next);
        syncUrlFromSelected(replace, next);
      }
      return;
    }

    const mapped = values.map((v) => toPair(normVal(v)));

    const same =
      facetIdx > -1 &&
      JSON.stringify(next[facetIdx].values) === JSON.stringify(mapped);

    if (same) return;

    if (facetIdx > -1) next[facetIdx].values = mapped;
    else next.push({ searchIndex: searchindex, values: mapped });

    setSelectedFacets(next);
    syncUrlFromSelected(replace, next);
  }

  function pushQuery(replace = false, nextSelectedFacets, traceId) {
    syncUrlFromSelected(replace, nextSelectedFacets, traceId);
  }

  function clearFacetsUrl() {
    setSelectedFacets([]);

    const query = { ...router?.query };
    delete query.facets;

    const [url, as, opts] = toUrlAndOpts(query);
    router.push(url, as, opts);
  }

  function resetFacets() {
    setSelectedFacets([]);
  }

  const facetLimit = 50;
  const sortChronological = ["let", "lix", "publicationyear"];

  return {
    selectedFacets,
    addFacet,
    removeFacet,
    replaceFacetValue,
    facetLimit,
    facetsFromEnum,
    clearFacetsUrl,
    resetFacets,
    pushQuery,
    sortChronological,
  };
}
