import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";
import { useData } from "@/lib/api/api";
import { ResultPage } from "@/components/search/result/page";
import Section from "@/components/base/section";
import Pagination from "@/components/search/pagination/Pagination";
import PropTypes from "prop-types";

export function AdvancedSearchResult({
  page,
  onWorkClick,
  onPageChange,
  results,
}) {
  // console.log(page, onPageChange, onWorkClick, cql, "COMPONENT");
  const isLoading = results.isLoading;
  const hitcount = results?.data?.complexSearch?.hitcount;
  const numPages = Math.ceil(hitcount / 10);

  return (
    <>
      <Section
        divider={false}
        colSize={{ lg: { offset: 3, span: true } }}
        id="search-result-section"
      >
        <ResultPage
          rows={results?.data?.complexSearch?.works}
          onWorkClick={onWorkClick}
          isLoading={isLoading}
        />
      </Section>
      {hitcount > 0 && (
        <Pagination
          numPages={numPages}
          currentPage={parseInt(page, 10)}
          onChange={onPageChange}
        />
      )}
    </>
  );
}

/**
 * Load the data needed for the advanced search result.
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap({ page, onWorkClick, onPageChange, cql }) {
  const limit = 10; // limit
  let offset = limit * (page - 1); // offset
  // use the useData hook to fetch data
  const bigResponse = useData(
    doComplexSearchAll({ cql, offset: offset, limit: limit })
  );

  return (
    <AdvancedSearchResult
      page={page}
      onWorkClick={onWorkClick}
      onPageChange={onPageChange}
      results={bigResponse}
    />
  );
}

Wrap.propTypes = {
  page: PropTypes.number,
  cql: PropTypes.string,
  onViewSelect: PropTypes.func,
  onWorkClick: PropTypes.func,
};
