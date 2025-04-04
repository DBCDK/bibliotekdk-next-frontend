import { hitcount } from "@/lib/api/complexSearch.fragments";
import { useData } from "@/lib/api/api";
import Section from "@/components/base/section";
import Pagination from "@/components/search/pagination/Pagination";
import PropTypes from "prop-types";
import {
  convertStateToCql,
  getCqlAndFacetsQuery,
  parseOutFacets,
} from "@/components/search/advancedSearch/utils";
import useAdvancedSearchHistory from "@/components/hooks/useAdvancedSearchHistory";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import isEmpty from "lodash/isEmpty";
import styles from "./AdvancedSearchResult.module.css";
import cx from "classnames";
import AdvancedSearchSort from "@/components/search/advancedSearch/advancedSearchSort/AdvancedSearchSort";
import TopBar from "@/components/search/advancedSearch/advancedSearchResult/topBar/TopBar";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import { NoHitSearch } from "@/components/search/advancedSearch/advancedSearchResult/noHitSearch/NoHitSearch";
import ResultPage from "./ResultPage/ResultPage";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import AdvancedFacets from "@/components/search/advancedSearch/facets/advancedFacets";

import translate from "@/components/base/translate";
import { FacetTags } from "@/components/search/advancedSearch/facets/facetTags/facetTags";
import { useFacets } from "@/components/search/advancedSearch/useFacets";
import { FacetButton } from "@/components/search/advancedSearch/facets/facetButton/facetButton";
import { useQuickFilters } from "@/components/search/advancedSearch/useQuickFilters";
import QuickFilter from "@/components/search/advancedSearch/quickfilter/QuickFilter";

export function AdvancedSearchResult({
  pageNo,
  onWorkClick,
  onPageChange,
  results,
  error = null,
  isLoading,
  cql,
  selectedFacets,
  searchHistoryObj,
  rawcql,
}) {
  const hitcount = results?.hitcount;
  const numPages = Math.ceil(hitcount / 10);
  const breakpoint = useBreakpoint();
  const isMobile =
    breakpoint === "md" || breakpoint === "xs" || breakpoint === "sm" || false;
  const page = parseInt(pageNo, 10) || 1;

  const TitleComponent = ({ cql }) => {
    return (
      <div>
        <FacetButton cql={cql} isLoading={isLoading} />
        <div className={styles.mobileTags}>
          <FacetTags />
        </div>

        <div className={styles.titleflex}>
          <div className={styles.borderTitleTop}></div>
          <Title
            type="title5"
            className={isLoading ? styles.skeleton : styles.countstyle}
            lines={1}
            skeleton={isLoading}
          >
            {hitcount}
          </Title>
          <Text type="text3" className={styles.titleStyle} skeleton={isLoading}>
            {translate({ context: "search", label: "title" })}
          </Text>
        </div>
      </div>
    );
  };

  return (
    <>
      <TopBar isLoading={isLoading} searchHistoryObj={searchHistoryObj} />

      <Section
        divider={false}
        colSize={{
          lg: { offset: 0, span: true },
          titel: { lg: { offset: 3, span: true } },
        }}
        id="search-result-section"
        title={<TitleComponent cql={rawcql} />}
        subtitle={
          <>
            <div className={styles.facetsContainer}>
              <>
                <FacetTags selectedFacets={selectedFacets} />
                <div className={styles.subtitleStyle}>
                  <Text type="text1" className={styles.titleStyle}>
                    {translate({ context: "search", label: "narrow-search" })}
                  </Text>
                </div>
              </>
              <QuickFilter />
              <AdvancedFacets cql={cql} />
            </div>
          </>
        }
        sectionContentClass={isMobile ? styles.sectionContentStyle : ""}
        sectionTitleClass={styles.sectionTitleClass}
      >
        {/* Reuse result page from simplesearch - we skip the wrap .. @TODO should we set
        some mark .. that we are doing advanced search .. ?? */}
        {((!isLoading && hitcount === 0) || !!error) && <NoHitSearch />}
        {/*<AdvancedFacets facets={facets} />*/}
        <>
          <div className={cx(styles.sort_wrapper)}>
            {hitcount > 0 && (
              <AdvancedSearchSort className={cx(styles.sort_container)} />
            )}
          </div>
          <div>
            {Array(isMobile ? page : 1)
              .fill({})
              .map((p, index) => {
                return (
                  <ResultPage
                    key={`result-page-${index}`}
                    page={isMobile ? index + 1 : page}
                    onWorkClick={onWorkClick}
                  />
                );
              })}
          </div>
        </>
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
    facets: parseOutFacets(bigResponse?.data?.complexSearch?.facets),
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
    setShowPopover,
  } = useAdvancedSearchContext();
  const { selectedFacets } = useFacets();
  // if facets are set we need them for the cql
  // we also need the quickfilters
  const { selectedQuickFilters } = useQuickFilters();
  const cqlAndFacetsQuery = getCqlAndFacetsQuery({
    cql,
    selectedFacets,
    quickFilters: selectedQuickFilters,
  });

  // if facets are not set we need the raw (without facets) fieldsearch query
  const fieldSearchQuery = convertStateToCql({ ...fieldSearch });
  // @TODO what to do  with dataCollect ???
  onWorkClick = null;
  // get setter for advanced search history
  const { setValue } = useAdvancedSearchHistory();
  const cqlQuery =
    cqlAndFacetsQuery ||
    convertStateToCql({
      ...fieldSearch,
      facets: selectedFacets,
      quickFilters: selectedQuickFilters,
    });

  const showResult = !isEmpty(fieldSearch) || !isEmpty(cql);

  // use the useData hook to fetch data
  const fastResponse = useData(
    hitcount({
      cql: cqlQuery,
    })
  );
  const parsedResponse = parseResponse(fastResponse);
  //update searchhistory
  let searchHistoryObj = {};
  if (
    !parsedResponse?.errorMessage &&
    !parsedResponse.isLoading &&
    (cqlAndFacetsQuery || fieldSearchQuery)
  ) {
    // make an object for searchhistory
    // the cql part .. we use the raw cql for now - facets are handled independently
    //key is a the full parsed cql search
    searchHistoryObj = {
      key: cqlQuery,
      hitcount: parsedResponse?.hitcount,
      fieldSearch: fieldSearch || "",
      cql: cqlAndFacetsQuery ? cql : fieldSearchQuery,
      selectedFacets: selectedFacets || [],
      selectedQuickFilters: selectedQuickFilters || [],
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
      results={parsedResponse}
      error={parsedResponse.errorMessage}
      setShowPopover={setShowPopover}
      isLoading={parsedResponse.isLoading}
      cql={cqlQuery}
      // we need the raw cql (without facets and quickfilters) for the facetButton
      rawcql={cqlAndFacetsQuery ? cql : fieldSearchQuery}
      selectedFacets={selectedFacets}
      searchHistoryObj={searchHistoryObj}
    />
  );
}

Wrap.propTypes = {
  pageNo: PropTypes.number,
  cql: PropTypes.string,
  onViewSelect: PropTypes.func,
  onWorkClick: PropTypes.func,
};
