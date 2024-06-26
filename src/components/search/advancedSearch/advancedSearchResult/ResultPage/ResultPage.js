import PropTypes from "prop-types";
import ResultRow from "@/components/search/result/row";

import { Fragment } from "react";
import { useData } from "@/lib/api/api";
import SearchFeedBack from "@/components/base/searchfeedback";
import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";

import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

import {
  convertStateToCql,
  getCqlAndFacetsQuery,
} from "@/components/search/advancedSearch/utils";
import isEmpty from "lodash/isEmpty";
import { useFacets } from "@/components/search/advancedSearch/useFacets";
import { useQuickFilters } from "@/components/search/advancedSearch/useQuickFilters";
import styles from "./ResultPage.module.css";

/**
 * Row representation of a search result entry
 *
 * @param {Object} props
 * See propTypes for specific props and types
 */
export function ResultPage({ rows, onWorkClick, isLoading }) {
  const resultRows = rows?.map((row, index) => (
    <Fragment key={row.workId + ":" + index}>
      <ResultRow
        isLoading={isLoading}
        work={row}
        key={`${row?.titles?.main}_${index}`}
        onClick={onWorkClick && (() => onWorkClick(index, row))}
      />
      {index === 0 && <SearchFeedBack />}
    </Fragment>
  ));

  if (!rows) {
    return null;
  }

  return <>{resultRows}</>;
}

ResultPage.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool,
  onWorkClick: PropTypes.func,
};
function parseResponse(bigResponse) {
  return {
    works: bigResponse?.data?.complexSearch?.works || null,
    facets: bigResponse?.data?.complexSearch?.facets || [],
    isLoading: bigResponse?.isLoading,
  };
}
/**
 * Wrap is a react component responsible for loading
 * data and displaying the right variant of the component
 *
 * @param {Object} props Component props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap({ onWorkClick, page }) {
  const {
    cqlFromUrl: cql,
    fieldSearchFromUrl: fieldSearch,
    sort,
  } = useAdvancedSearchContext();

  const { selectedFacets } = useFacets();
  const showFeedback = page === 1;
  onWorkClick = null;

  // we also need the quickfilters
  const { selectedQuickFilters } = useQuickFilters();
  // if facets are set we need them for the cql
  const cqlAndFacetsQuery = getCqlAndFacetsQuery({
    cql,
    selectedFacets,
    quickFilters: selectedQuickFilters,
  });

  const limit = 10;
  let offset = limit * (page - 1);
  const cqlQuery =
    cqlAndFacetsQuery ||
    convertStateToCql({
      ...fieldSearch,
      facets: selectedFacets,
      quickFilters: selectedQuickFilters,
    });

  const showResult = !isEmpty(fieldSearch) || !isEmpty(cqlAndFacetsQuery);

  // fetch data for the specific page
  const bigResponse = useData(
    doComplexSearchAll({
      cql: cqlQuery,
      offset: offset,
      limit: limit,
      ...(!isEmpty(sort) && { sort: sort }),
    })
  );
  const parsedResponse = parseResponse(bigResponse);

  if (parsedResponse.isLoading) {
    return Array(10)
      .fill({})
      .map((row, index) => (
        <>
          <ResultRow
            isLoading={true}
            work={row}
            key={`${row?.titles?.main}_${index}`}
            onClick={onWorkClick && (() => onWorkClick(index, row))}
          />
          {index === 0 && showFeedback && (
            <div className={styles["feedback-wrap"]} />
          )}
        </>
      ));
  }

  if (!showResult) {
    return null;
  }

  return (
    <ResultPage
      rows={parsedResponse?.works}
      onWorkClick={onWorkClick}
      isLoading={parsedResponse?.isLoading}
    />
  );
}
Wrap.propTypes = {
  page: PropTypes.number,
  onWorkClick: PropTypes.func,
};
