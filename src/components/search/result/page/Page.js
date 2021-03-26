import PropTypes from "prop-types";
import ResultRow from "../row";

import { useData } from "@/lib/api/api";
import { fast, all } from "@/lib/api/search.fragments";

/**
 * Row representation of a search result entry
 *
 * @param {object} props
 * See propTypes for specific props and types
 */
function ResultPage({ rows, onWorkClick, isLoading }) {
  if (isLoading) {
    // Create some skeleton rows
    rows = [{}, {}, {}];
  }

  return (
    <>
      {rows.map((row, index) => (
        <ResultRow
          data={row}
          key={`${row.title}_${index}`}
          onClick={onWorkClick && (() => onWorkClick(index, row.work))}
        />
      ))}
    </>
  );
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
 * @returns {component}
 */
export default function Wrap({ q, page, onWorkClick }) {
  // settings
  const limit = 10; // limit
  const offset = limit * (page - 1); // offset

  // use the useData hook to fetch data
  const fastResponse = useData(fast({ q, limit, offset }));
  const allResponse = useData(all({ q, limit, offset }));

  if (fastResponse.isLoading) {
    return <ResultPage isLoading={true} />;
  }

  if (fastResponse.error || allResponse.error) {
    return null;
  }

  const data = allResponse.data || fastResponse.data;

  return <ResultPage rows={data.search.result} onWorkClick={onWorkClick} />;
}
Wrap.propTypes = {
  q: PropTypes.string,
  page: PropTypes.number,
  onWorkClick: PropTypes.func,
};
