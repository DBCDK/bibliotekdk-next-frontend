import { hitcount } from "@/lib/api/complexSearch.fragments";
import { useData } from "@/lib/api/api";
import Section from "@/components/base/section";
import Pagination from "@/components/search/pagination/Pagination";
import PropTypes from "prop-types";
import {
  convertStateToCql,
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
import { NoHitSearch } from "@/components/search/advancedSearch/advancedSearchResult/noHitSearch/NoHitSearch";
import ResultPage from "./ResultPage/ResultPage";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import AdvancedFacets from "@/components/search/advancedSearch/facets/advancedFacets";

import translate from "@/components/base/translate";
import { FacetTags } from "@/components/search/advancedSearch/facets/facetTags/facetTags";
import Button from "@/components/base/button/Button";
import { useModal } from "@/components/_modal";

export function AdvancedSearchResult({
  pageNo,
  onWorkClick,
  onPageChange,
  results,
  error = null,
  isLoading,
  cql,
}) {
  const hitcount = results?.hitcount;
  const numPages = Math.ceil(hitcount / 10);
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm" || false;
  const page = parseInt(pageNo, 10) || 1;
  const modal = useModal();

  if (error) {
    return null;
  }

  const TitleComponent = () => {
    return (
      <div>
        <Button
          type="secondary"
          size="medium"
          className={styles.facetbutton}
          onClick={() =>
            modal.push("advancedFacets", {
              cql: cql,
              replace: true,
            })
          }
        >
          Filtrer din søgning
        </Button>
        {/*<div className={styles.mobileTags}>*/}
        {/*  <FacetTags />*/}
        {/*</div>*/}
        <div className={styles.titleflex}>
          <Title type="title5" className={styles.countstyle}>
            {hitcount}
          </Title>
          <Title type="title6" className={styles.titleStyle}>
            {translate({ context: "search", label: "title" })}
          </Title>
        </div>
      </div>
    );
  };

  return (
    <>
      <TopBar isLoading={isLoading} />

      <Section
        divider={false}
        colSize={{
          lg: { offset: 0, span: true },
          titel: { lg: { offset: 3, span: true } },
        }}
        id="search-result-section"
        title={<TitleComponent />}
        subtitle={
          hitcount > 0 &&
          !isLoading && (
            <>
              <div className={styles.facetsContainer}>
                <FacetTags />
                <div className={styles.subtitleStyle}>
                  <Title type="title6">
                    {translate({ context: "search", label: "narrow-search" })}
                  </Title>
                </div>

                <AdvancedFacets cql={cql} />
              </div>
            </>
          )
        }
        sectionContentClass={isMobile ? styles.sectionContentStyle : ""}
        sectionTitleClass={styles.sectionTitleClass}
      >
        {/* Reuse result page from simplesearch - we skip the wrap .. @TODO should we set
        some mark .. that we are doing advanced search .. ?? */}
        {!isLoading && hitcount === 0 && <NoHitSearch />}
        {/*<AdvancedFacets facets={facets} />*/}
        <>
          <AdvancedSearchSort className={cx(styles.sort_container)} />
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
    facets,
  } = useAdvancedSearchContext();

  // @TODO what to do  with dataCollect ???
  onWorkClick = null;
  // get setter for advanced search history
  // @TODO add facets
  const { setValue } = useAdvancedSearchHistory();
  const cqlQuery = cql || convertStateToCql({ ...fieldSearch, facets: facets });

  const showResult = !isEmpty(fieldSearch) || !isEmpty(cql);

  // use the useData hook to fetch data
  const fastResponse = useData(
    hitcount({
      cql: cqlQuery,
    })
  );
  const parsedResponse = parseResponse(fastResponse);

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
      results={parsedResponse}
      error={parsedResponse.errorMessage}
      setShowPopover={setShowPopover}
      isLoading={parsedResponse.isLoading}
      cql={cqlQuery}
    />
  );
}

Wrap.propTypes = {
  pageNo: PropTypes.number,
  cql: PropTypes.string,
  onViewSelect: PropTypes.func,
  onWorkClick: PropTypes.func,
};
