import PropTypes from "prop-types";
import ResultRow from "../row";
import { Fragment, useEffect } from "react";
import { useData } from "@/lib/api/api";
import * as searchFragments from "@/lib/api/search.fragments";
import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";
import SearchFeedBack from "@/components/base/searchfeedback";
import useDataCollect from "@/lib/useDataCollect";
import { useQuickFilters } from "@/components/search/advancedSearch/useQuickFilters";
import { mapQuickFilters } from "@/components/search/facets/simpleFacets";

/**
 * Row representation of a search result entry
 *
 * @param {Object} props
 * See propTypes for specific props and types
 */
export function ResultPage({ rows, onWorkClick, isLoading }) {
  if (isLoading) {
    // Create some skeleton rows
    rows = Array(10).fill({});
  }

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

/**
 * Wrap is a react component responsible for loading
 * data and displaying the right variant of the component
 *
 * @param {Object} props Component props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap({ page, onWorkClick }) {
  // settings
  const limit = 10; // limit
  let offset = limit * (page - 1); // offset

  const { filters, isSynced } = useFilters();
  const { getQuery, hasQuery } = useQ();
  const dataCollect = useDataCollect();

  const { selectedQuickFilters } = useQuickFilters();
  const mapped = mapQuickFilters(selectedQuickFilters);
  const merged = { ...filters, ...mapped };

  const q = getQuery();

  if (!isSynced) {
    offset = 0;
  }

  // use the useData hook to fetch data
  const allResponse = useData(
    hasQuery && searchFragments.all({ q, limit, offset, filters: merged })
  );

  // This useEffect is responsible for collecting data about the search response.
  // The effect is run, when search response is fetched and shown to the user.
  useEffect(() => {
    if (allResponse?.data) {
      dataCollect.collectSearch({
        search_request: {
          q,
          merged,
        },
        search_response_works:
          allResponse?.data?.search?.works?.map((w) => w.workId) || [],
        search_offset: offset,
      });
    }
  }, [allResponse?.data]);

  if (allResponse.error) {
    return null;
  }

  const data = allResponse.data || {};

  if (allResponse.isLoading) {
    return <ResultPage isLoading={true} />;
  }

  return <ResultPage rows={data.search?.works} onWorkClick={onWorkClick} />;
}
Wrap.propTypes = {
  page: PropTypes.number,
  onWorkClick: PropTypes.func,
};
