import PropTypes from "prop-types";
import ResultRow from "../row";
import { Fragment, useEffect } from "react";

import { useData } from "@/lib/api/api";
import * as searchFragments from "@/lib/api/search.fragments";

import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";
import SearchFeedBack from "@/components/base/searchfeedback";
import useDataCollect from "@/lib/useDataCollect";

/**
 * Row representation of a search result entry
 *
 * @param {object} props
 * See propTypes for specific props and types
 */
export function ResultPage({ rows, onWorkClick, isLoading }) {
  if (isLoading) {
    // Create some skeleton rows
    rows = [{}, {}, {}, {}, {}, {}];
  }

  const resultRows = rows?.map((row, index) => (
    <Fragment key={row.workId + ":" + index}>
      <ResultRow
        data={row}
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
 * @returns {JSX.Element}
 */
export default function Wrap({ page, onWorkClick }) {
  // settings
  const limit = 10; // limit
  const offset = limit * (page - 1); // offset

  const { filters } = useFilters();
  const { getQuery, hasQuery } = useQ();
  const dataCollect = useDataCollect();

  const q = getQuery();

  // use the useData hook to fetch data
  const fastResponse = useData(
    hasQuery && searchFragments.fast({ q, offset, limit, filters })
  );
  const allResponse = useData(
    hasQuery && searchFragments.all({ q, limit, offset, filters })
  );

  // This useEffect is responsible for collecting data about the search response.
  // The effect is run, when search response is fetched and shown to the user.
  useEffect(() => {
    if (fastResponse?.data) {
      dataCollect.collectSearch({
        search_request: {
          q,
          filters,
        },
        search_response_works:
          fastResponse?.data?.search?.works?.map((w) => w.workId) || [],
        search_offset: offset,
      });
    }
  }, [fastResponse?.data]);

  if (fastResponse.error || allResponse.error) {
    return null;
  }

  const data = allResponse.data || fastResponse.data || {};

  if (fastResponse.isLoading) {
    return <ResultPage isLoading={true} />;
  }

  return <ResultPage rows={data.search?.works} onWorkClick={onWorkClick} />;
}
Wrap.propTypes = {
  page: PropTypes.number,
  onWorkClick: PropTypes.func,
};
