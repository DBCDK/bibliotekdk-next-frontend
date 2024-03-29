import PropTypes from "prop-types";
import ResultRow from "@/components/search/result/row";

import { Fragment } from "react";
import { useData } from "@/lib/api/api";
import SearchFeedBack from "@/components/base/searchfeedback";
import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";

import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

import { convertStateToCql } from "@/components/search/advancedSearch/utils";
import isEmpty from "lodash/isEmpty";

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

  onWorkClick = null;

  const limit = 10;
  let offset = limit * (page - 1);
  const cqlQuery = cql || convertStateToCql(fieldSearch);

  const showResult = !isEmpty(fieldSearch) || !isEmpty(cql);

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
        <ResultRow
          isLoading={true}
          work={row}
          key={`${row?.titles?.main}_${index}`}
          onClick={onWorkClick && (() => onWorkClick(index, row))}
        />
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
