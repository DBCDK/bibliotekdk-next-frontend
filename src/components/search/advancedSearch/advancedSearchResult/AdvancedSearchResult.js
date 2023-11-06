import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";
import { useData } from "@/lib/api/api";
import { ResultPage } from "@/components/search/result/page";
import Section from "@/components/base/section";
import Pagination from "@/components/search/pagination/Pagination";
import PropTypes from "prop-types";
import { converStateToCql } from "@/components/search/advancedSearch/utils";

export function AdvancedSearchResult({
  pageNo,
  onWorkClick,
  onPageChange,
  results,
  error = null,
}) {
  const hitcount = results?.hitcount;
  const numPages = Math.ceil(hitcount / 10);

  if (error) {
    return null;
  }
  return (
    <>
      <Section
        divider={false}
        colSize={{ lg: { offset: 1, span: true } }}
        id="search-result-section"
        title="Resultater"
        subtitle={hitcount}
      >
        {/* Reuse result page from simplesearch - we skip the wrap .. @TODO should we set
        some mark .. that we are doing advanced search .. ?? */}
        <ResultPage
          rows={results?.works}
          onWorkClick={onWorkClick}
          isLoading={results?.isLoading}
        />
      </Section>
      {hitcount > 0 && (
        <Pagination
          numPages={numPages}
          currentPage={parseInt(pageNo, 10)}
          onChange={onPageChange}
        />
      )}
    </>
  );
}

function parseResponse(bigResponse) {
  return {
    works: bigResponse?.data?.complexSearch?.works || null,
    hitcount: bigResponse?.data?.complexSearch?.hitcount || 0,
    errorMessage: bigResponse?.data?.complexSearch?.errorMessage || null,
    isLoading: bigResponse?.isLoading,
  };
}

/**
 * Load the data needed for the advanced search result.
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap({
  pageNo,
  onWorkClick,
  onPageChange,
  cql,
  fieldSearch,
}) {
  const limit = 10; // limit
  let offset = limit * (pageNo - 1); // offset
  console.log("RESULT.fieldSearch", fieldSearch);
  console.log("converStateToCql(fieldSearch)", converStateToCql(fieldSearch));
  const cqlQuery = cql || converStateToCql(fieldSearch);
  console.log("Result. cqlQuery", cqlQuery);
  // use the useData hook to fetch data
  const bigResponse = useData(
    doComplexSearchAll({ cql: cqlQuery, offset: offset, limit: limit })
  );

  const parsedResponse = parseResponse(bigResponse);
  return (
    <AdvancedSearchResult
      pageNo={pageNo}
      onWorkClick={onWorkClick}
      onPageChange={onPageChange}
      results={parsedResponse}
      error={parsedResponse.errorMessage}
    />
  );
}

Wrap.propTypes = {
  pageNo: PropTypes.number,
  cql: PropTypes.string,
  onViewSelect: PropTypes.func,
  onWorkClick: PropTypes.func,
};
