import PropTypes from "prop-types";
import ResultRow from "../row";

import { useData } from "@/lib/api/api";
import { fast, all } from "@/lib/api/search.fragments";
import { useRouter } from "next/router";

/**
 * Row representation of a search result entry
 *
 * @param {object} props
 * See propTypes for specific props and types
 */
export function ResultPage({ rows, onWorkClick, isLoading }) {
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
          onClick={onWorkClick && (() => onWorkClick(index, row))}
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

  const router = useRouter();
  const { worktype = null } = router.query;
  const facet = worktype ? [{ field: "type", value: worktype }] : null;
  // use the useData hook to fetch data
  // const facet = [{ field: "type", value: "movie" }];
  //const facets = null;

  const fastResponse = useData(q && fast({ q, limit, offset, facets: facet }));
  const allResponse = useData(q && all({ q, limit, offset, facets: facet }));

  if (fastResponse.error || allResponse.error) {
    return null;
  }

  const data = allResponse.data || fastResponse.data;

  if (fastResponse.isLoading || !data) {
    return <ResultPage isLoading={true} />;
  }

  return <ResultPage rows={data.search.works} onWorkClick={onWorkClick} />;
}
Wrap.propTypes = {
  q: PropTypes.string,
  page: PropTypes.number,
  onWorkClick: PropTypes.func,
};
