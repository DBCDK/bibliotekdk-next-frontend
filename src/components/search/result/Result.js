import PropTypes from "prop-types";
import { Fragment, useEffect } from "react";
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

import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";

//
// ✅ UI-KOMPONENT: Rækker og feedback
//
export function Result({ rows, isLoading, onWorkClick, showFeedback = true }) {
  if (isLoading) {
    rows = Array(10).fill({});
  }

  if (!rows) return null;

  return rows.map((row, index) => (
    <Fragment key={row.workId + ":" + index}>
      <ResultRow
        isLoading={isLoading}
        work={row}
        key={`${row?.titles?.main}_${index}`}
        onClick={onWorkClick && (() => onWorkClick(index, row))}
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

//
// ✅ WRAP-KOMPONENT: henter data og vælger visning
//
export default function Wrap({ page = 1, onWorkClick }) {
  const limit = 10;
  let offset = limit * (page - 1);

  // === Avanceret søgning ===
  const advCtx = useAdvancedSearchContext();
  const { selectedFacets } = useFacets();
  const { selectedQuickFilters } = useQuickFilters();

  const router = useRouter();

  const mode = router.query.mode;

  const isAdvancedSearch = ["avanceret", "cql"].includes(mode);

  const { cqlFromUrl, fieldSearchFromUrl, sort } = advCtx || {};
  const hasAdvancedSearch =
    isAdvancedSearch && (!isEmpty(fieldSearchFromUrl) || !isEmpty(cqlFromUrl));

  const cqlAndFacetsQuery = getCqlAndFacetsQuery({
    cql: cqlFromUrl,
    selectedFacets,
    quickFilters: selectedQuickFilters,
  });

  const cqlQuery =
    cqlAndFacetsQuery ||
    convertStateToCql({
      ...fieldSearchFromUrl,
      facets: selectedFacets,
      quickFilters: selectedQuickFilters,
    });

  const complexResponse = useData(
    hasAdvancedSearch &&
      complexSearchFragments.doComplexSearchAll({
        cql: cqlQuery,
        offset,
        limit,
        ...(!isEmpty(sort) && { sort }),
      })
  );

  // === Simpel søgning ===
  const { filters, isSynced } = useFilters();
  const { q, hasQuery } = useQ();
  const dataCollect = useDataCollect();

  if (!isSynced) offset = 0;

  const simpleResponse = useData(
    hasQuery && searchFragments.all({ q, limit, offset, filters })
  );

  // === Tracking for simpel søgning ===
  useEffect(() => {
    if (!hasAdvancedSearch && simpleResponse?.data) {
      dataCollect.collectSearch({
        search_request: { q, filters },
        search_response_works:
          simpleResponse?.data?.search?.works?.map((w) => w.workId) || [],
        search_offset: offset,
      });
    }
  }, [simpleResponse?.data, hasAdvancedSearch]);

  // === Fejlhåndtering ===
  if (!hasAdvancedSearch && simpleResponse?.error) return null;

  // === Data extraction ===
  const rows = hasAdvancedSearch
    ? complexResponse?.data?.complexSearch?.works
    : simpleResponse?.data?.search?.works;

  const isLoading = hasAdvancedSearch
    ? complexResponse?.isLoading
    : simpleResponse?.isLoading;

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
