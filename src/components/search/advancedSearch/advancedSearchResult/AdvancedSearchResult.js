import { doComplexSearchAll } from "@/lib/api/complexSearch.fragments";
import { useData } from "@/lib/api/api";
//import { ResultPage } from "@/components/search/result/page";
import Section from "@/components/base/section";
import Pagination from "@/components/search/pagination/Pagination";
import PropTypes from "prop-types";
import { convertStateToCql } from "@/components/search/advancedSearch/utils";
import useAdvancedSearchHistory from "@/components/hooks/useAdvancedSearchHistory";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import isEmpty from "lodash/isEmpty";
import styles from "./AdvancedSearchResult.module.css";
import cx from "classnames";
import AdvancedSearchSort from "@/components/search/advancedSearch/advancedSearchSort/AdvancedSearchSort";
import TopBar from "@/components/search/advancedSearch/advancedSearchResult/topBar/TopBar";
import Title from "@/components/base/title";
import { NoHitSearch } from "@/components/search/advancedSearch/advancedSearchResult/noHitSearch/NoHitSearch";
import ResultPage from "./ResultPage/ResultPage";
import useBreakpoint from "@/components/hooks/useBreakpoint";

export function AdvancedSearchResult({
  pageNo,
  onWorkClick,
  onPageChange,
  results,
  error = null,
}) {
  console.log("results", results);
  const hitcount = 100; //results?.hitcount;
  const numPages = Math.ceil(hitcount / 10);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm" || false;
  const page = parseInt(pageNo, 10) || 1
  if (error) {
    return null;
  }
  console.log("page", page);
  console.log("hitcount", hitcount);
  console.log("ismobile", isMobile);
  const resultpagesNumber= isMobile ? parseInt(page) : 1;
  console.log('resultpagesNumber',resultpagesNumber)
  const resultPages = Array(resultpagesNumber).fill({});
  console.log("resulprages", resultPages);
  return (
    <>
      <TopBar />

      <Section
        divider={false}
        colSize={{ lg: { offset: 1, span: true } }}
        id="search-result-section"
        title="Resultater"
        subtitle={
          <Title type="title5" className={styles.titleStyle}>
            {hitcount}
          </Title>
        }
        className={styles.padding_top}
      >
        {/* Reuse result page from simplesearch - we skip the wrap .. @TODO should we set
        some mark .. that we are doing advanced search .. ?? */}
        {hitcount === 0 && <NoHitSearch />}
        {/* {hitcount > 0 && ( */}
        <>
          <AdvancedSearchSort className={cx(styles.sort_container)} />
          <div className={cx(styles.padding_top)}>
            {Array(isMobile ? page : 1).fill({}).map((p, index) => {
              console.log("index", index);
              return (
                <ResultPage
                  key={`result-page-${index}`}
                  page={isMobile ? index + 1 : page}
                  onWorkClick={onWorkClick}
                />
              );
            })}
            {/* */}
          </div>
        </>
        {/* // )} */}
      </Section>
      {hitcount > 0 && (
        <Pagination
          numPages={numPages}
          currentPage={page}
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
export default function Wrap({ onWorkClick, onPageChange }) {
  const {
    cqlFromUrl: cql,
    fieldSearchFromUrl: fieldSearch,
    pageNoFromUrl: pageNo,
    sort,
    setShowPopover,
  } = useAdvancedSearchContext();

  // we  disable the data collect for now - this one is propdrilled from
  // components/search/result/page
  // @TODO what to do  with dataCollect ???
  onWorkClick = null;
  // get setter for advanced search history
  const { setValue } = useAdvancedSearchHistory();
  const limit = 10; // limit
  let offset = limit * (pageNo - 1); // offset
  const cqlQuery = cql || convertStateToCql(fieldSearch);

  const showResult = !isEmpty(fieldSearch) || !isEmpty(cql);

  // use the useData hook to fetch data
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
    return (
      <>
        <TopBar />

        <Section
          divider={false}
          colSize={{ lg: { offset: 1, span: true } }}
          title="loading ..."
          subtitle=""
          isLoading={true}
        >
          <AdvancedSearchSort
            className={cx(styles.sort_container, styles.loadingSort)}
            skeleton={true}
          />
          <ResultPage isLoading={true} />
        </Section>
      </>
    );
  }
  //update searchhistory
  if (!parsedResponse?.errorMessage && !parsedResponse.isLoading) {
    // make an object for searchhistory @TODO .. the right object please
    const searchHistoryObj = {
      hitcount: parsedResponse?.hitcount,
      fieldSearch: fieldSearch || "",
      cql: cqlQuery,
    };
    setValue(searchHistoryObj);
  }

  if (!showResult) {
    return null;
  }

  return (
    <AdvancedSearchResult
      pageNo={pageNo}
      onWorkClick={onWorkClick}
      onPageChange={onPageChange}
      //  results={parsedResponse}
      //  error={parsedResponse.errorMessage}
      setShowPopover={setShowPopover}
    />
  );
}

Wrap.propTypes = {
  pageNo: PropTypes.number,
  cql: PropTypes.string,
  onViewSelect: PropTypes.func,
  onWorkClick: PropTypes.func,
};
