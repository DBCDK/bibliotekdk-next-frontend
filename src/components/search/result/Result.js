import PropTypes from "prop-types";
import { Fragment, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";

import ResultRow from "./row";
import SearchFeedBack from "@/components/base/searchfeedback";

import { useData } from "@/lib/api/api";
import * as searchFragments from "@/lib/api/search.fragments";
import * as complexSearchFragments from "@/lib/api/complexSearch.fragments";

import useQ from "@/components/hooks/useQ";
import useFilters from "@/components/hooks/useFilters";
import useDataCollect from "@/lib/useDataCollect";

import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import { useFacets } from "@/components/search/advancedSearch/useFacets";
import { useQuickFilters } from "@/components/search/advancedSearch/useQuickFilters";
import {
  getCqlAndFacetsQuery,
  convertStateToCql,
} from "@/components/search/advancedSearch/utils";
import { mapQuickFilters } from "@/components/search/facets/simple/SimpleFacets";

/* -------------------------------- UI -------------------------------- */

export function Result({ rows, isLoading, onWorkClick, showFeedback = true }) {
  const list =
    isLoading && (!rows || rows.length === 0)
      ? Array.from({ length: 10 }, (_, i) => ({
          __skeleton: true,
          _k: `s-${i}`,
        }))
      : rows || [];

  if (list.length === 0) return null;

  return list.map((row, index) => (
    <Fragment key={row?.workId ?? row?._k ?? index}>
      <ResultRow
        isLoading={!!row?.__skeleton || isLoading}
        work={row?.__skeleton ? {} : row}
        onClick={
          onWorkClick && !row?.__skeleton
            ? () => onWorkClick(index, row)
            : undefined
        }
      />
      {index === 0 && showFeedback && <SearchFeedBack />}
    </Fragment>
  ));
}

Result.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool,
  onWorkClick: PropTypes.func,
  showFeedback: PropTypes.bool,
};

/* ------------------------------- Wrap ------------------------------- */

export default function Wrap({ page = 1, onWorkClick }) {
  const limit = 10;
  let offset = limit * (page - 1);

  // Mode
  const { query } = useRouter();
  const isAdvancedMode = query?.mode === "avanceret";
  const isCqlMode = query?.mode === "cql";

  // Avanceret søgning inputs
  const adv = useAdvancedSearchContext();
  const { selectedFacets } = useFacets();
  const { selectedQuickFilters } = useQuickFilters();

  const mapped = mapQuickFilters(selectedQuickFilters);

  const { cqlFromUrl, fieldSearchFromUrl, sort } = adv || {};

  const hasAdvancedParams =
    (isAdvancedMode || isCqlMode) && !isEmpty(fieldSearchFromUrl);
  const hasCqlParams = isCqlMode && !isEmpty(cqlFromUrl);

  // Byg CQL (memo for læsbarhed)
  const cqlAndFacetsQuery = useMemo(
    () =>
      getCqlAndFacetsQuery({
        cql: cqlFromUrl,
        selectedFacets,
        quickFilters: selectedQuickFilters,
      }),
    [cqlFromUrl, selectedFacets, selectedQuickFilters]
  );

  const cqlQuery = useMemo(
    () =>
      cqlAndFacetsQuery ||
      convertStateToCql({
        ...fieldSearchFromUrl,
        facets: selectedFacets,
        quickFilters: selectedQuickFilters,
      }),
    [
      cqlAndFacetsQuery,
      fieldSearchFromUrl,
      selectedFacets,
      selectedQuickFilters,
    ]
  );

  // Simpel søgning inputs
  const { filters, isSynced } = useFilters();
  const { getQuery, hasQuery } = useQ();

  const q = getQuery();

  const dataCollect = useDataCollect();
  if (!isSynced) offset = 0;

  // Data-kald (kun aktivt for gældende mode)
  const complexResponse = useData(
    hasAdvancedParams || hasCqlParams
      ? complexSearchFragments.doComplexSearchAll({
          cql: cqlQuery,
          offset,
          limit,
          ...(!isEmpty(sort) && { sort }),
        })
      : null
  );

  const merged = { ...filters, ...mapped };

  const simpleResponse = useData(
    hasQuery ? searchFragments.all({ q, limit, offset, filters: merged }) : null
  );

  // Tracking for simpel søgning
  useEffect(() => {
    if ((!hasAdvancedParams || !hasCqlParams) && simpleResponse?.data) {
      dataCollect.collectSearch({
        search_request: { q, filters: merged },
        search_response_works:
          simpleResponse?.data?.search?.works?.map((w) => w.workId) || [],
        search_offset: offset,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simpleResponse?.data, hasAdvancedParams, hasCqlParams]);

  // Data extraction
  const rows =
    hasAdvancedParams || hasCqlParams
      ? complexResponse?.data?.complexSearch?.works
      : simpleResponse?.data?.search?.works;

  const isLoading =
    hasAdvancedParams || hasCqlParams
      ? !!complexResponse?.isLoading
      : !!simpleResponse?.isLoading;

  return (
    <Result
      rows={rows}
      isLoading={isLoading}
      onWorkClick={onWorkClick}
      showFeedback={page === 1}
    />
  );
}

Wrap.propTypes = {
  page: PropTypes.number,
  onWorkClick: PropTypes.func,
};
