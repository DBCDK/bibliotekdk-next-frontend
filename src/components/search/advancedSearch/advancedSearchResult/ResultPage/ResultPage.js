import PropTypes from "prop-types";
import ResultRow from "@/components/search/result/row";

import { Fragment } from "react";
import { useData } from "@/lib/api/api";
import SearchFeedBack from "@/components/base/searchfeedback";
import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";

import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

import { convertStateToCql } from "@/components/search/advancedSearch/utils";
import isEmpty from "lodash/isEmpty";
import { useFacets } from "@/components/search/advancedSearch/useFacets";

/**
 * Row representation of a search result entry
 *
 * @param {Object} props
 * See propTypes for specific props and types
 */
export function ResultPage({ rows, onWorkClick, isLoading, facets }) {
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
    facets,
  } = useAdvancedSearchContext();

  const { facetsFromEnum, facetLimit } = useFacets();

  onWorkClick = null;

  const limit = 10;
  let offset = limit * (page - 1);
  const cqlQuery = cql || convertStateToCql({ ...fieldSearch, facets: facets });

  const showResult = !isEmpty(fieldSearch) || !isEmpty(cql);

  // const facets = {
  //   facetLimit: 5,
  //   facets: ["specificmaterialtype", "subject"],
  // };
  // fetch data for the specific page
  const bigResponse = useData(
    doComplexSearchAll({
      cql: cqlQuery,
      offset: offset,
      limit: limit,
      facets: {
        facetLimit: facetLimit,
        facets: facetsFromEnum,
      },
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
