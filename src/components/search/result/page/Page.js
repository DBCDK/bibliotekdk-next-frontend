import PropTypes from "prop-types";
import ResultRow from "../row";

import { useData } from "@/lib/api/api";
import { fast, all } from "@/lib/api/search.fragments";

/**
 * Row representation of a search result entry
 *
 * @param {object} props
 * @param {object} props.data
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

/**
 * Wrap is a react component responsible for loading
 * data and displaying the right variant of the component
 *
 * @param {Object} props Component props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap({ q, page, onWorkClick, updateNumPages }) {
  // settings
  const l = 10; // limit
  const p = parseInt(page); // page
  const o = l * (p - 1); // offset

  // calculate limit
  const limit = l;

  // calculate offset
  const offset = o;

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

  // Update hitcount in parent component, for pagination use
  if (updateNumPages && data) {
    const hitcount = data.search.hitcount;
    const numPages = Math.ceil(hitcount / limit);
    updateNumPages(numPages);
  }

  return <ResultPage rows={data.search.result} onWorkClick={onWorkClick} />;
}
Wrap.propTypes = {
  q: PropTypes.string,
  isMobile: PropTypes.bool,
  page: PropTypes.string,
  viewSelected: PropTypes.string,
  onViewSelect: PropTypes.func,
  onWorkClick: PropTypes.func,
};
