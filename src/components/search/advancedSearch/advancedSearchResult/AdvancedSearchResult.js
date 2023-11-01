import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";
import { useData } from "@/lib/api/api";
import { ResultPage } from "@/components/search/result/page";
import Section from "@/components/base/section";
import Pagination from "@/components/search/pagination/Pagination";
import PropTypes from "prop-types";
import { CqlErrorMessage } from "@/components/search/advancedSearch/cqlTextArea/CqlErrorMessage";

export function AdvancedSearchResult({
  pageNo,
  onWorkClick,
  onPageChange,
  results,
  error = null,
}) {
  const hitcount = results?.hitcount;
  const numPages = Math.ceil(hitcount / 10);

  return (
    <>
      <Section
        divider={false}
        colSize={{ lg: { offset: 3, span: true } }}
        id="search-result-section"
      >
        {error && <CqlErrorMessage message={error} />}
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

function parseErrorMessage(errorMessage) {
  // first sentence of errormessage is (kind of) explanation
  const explanation = errorMessage.split(",")[0];
  // last part is location of error - starts with at: ---> .. and then the rest
  const locationIndex = errorMessage.indexOf("at:");
  const location = errorMessage.substring(locationIndex);

  return {
    explanation: explanation,
    location: location,
    full: errorMessage,
  };
}

/**
 * Load the data needed for the advanced search result.
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap({ pageNo, onWorkClick, onPageChange, cql }) {
  const limit = 10; // limit
  let offset = limit * (pageNo - 1); // offset
  // use the useData hook to fetch data
  const bigResponse = useData(
    doComplexSearchAll({ cql, offset: offset, limit: limit })
  );

  const parsedResponse = parseResponse(bigResponse);
  return (
    <AdvancedSearchResult
      pageNo={pageNo}
      onWorkClick={onWorkClick}
      onPageChange={onPageChange}
      results={parsedResponse}
      error={
        parsedResponse.errorMessage
          ? parseErrorMessage(parsedResponse.errorMessage)
          : null
      }
    />
  );
}

Wrap.propTypes = {
  pageNo: PropTypes.number,
  cql: PropTypes.string,
  onViewSelect: PropTypes.func,
  onWorkClick: PropTypes.func,
};
