import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useData } from "@/lib/api/api";
import Pagination from "@/components/search/pagination/Pagination";
import Section from "@/components/base/section";
import Result from "@/components/search/result";
import Search from "@/components/search/Search";
import History from "@/components/search/history";
import FilterButton from "@/components/search/filterButton";
import { NoHitSearch } from "@/components/search/advancedSearch/noHitSearch/NoHitSearch";

import useBreakpoint from "@/components/hooks/useBreakpoint";
import useQ from "@/components/hooks/useQ";
import useFilters from "@/components/hooks/useFilters";
import useSearchHistory, {
  useCurrentSearchHistoryItem,
} from "@/components/hooks/useSearchHistory";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import { useFacets } from "@/components/search/advancedSearch/useFacets";
import { useQuickFilters } from "@/components/search/advancedSearch/useQuickFilters";
import {
  getCqlAndFacetsQuery,
  convertStateToCql,
} from "@/components/search/advancedSearch/utils";

import * as searchFragments from "@/lib/api/search.fragments";
import {
  hitcount as advancedHitcount,
  extraHits as complexExtraHits,
} from "@/lib/api/complexSearch.fragments";

import AdvancedSearchSort from "@/components/search/advancedSearch/advancedSearchSort/AdvancedSearchSort";
import TopBar from "@/components/search/advancedSearch/topBar/TopBar";
import AdvancedFacets from "@/components/search/facets/advanced/advancedFacets";
import QuickFilter from "@/components/search/advancedSearch/quickfilter/QuickFilter";
import { FacetTags } from "@/components/search/facets/advanced/facetTags/facetTags";
import { FacetButton } from "@/components/search/facets/advanced/facetButton/facetButton";
import SimpleFacets from "@/components/search/facets/simple";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import translate from "@/components/base/translate";

import isEmpty from "lodash/isEmpty";
import styles from "./Page.module.css";
import { useRouter } from "next/router";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SaveSearchBtn from "../save";
import Related from "../related/Related";
import DidYouMean from "../didYouMean/DidYouMean";
import SeriesBox from "@/components/search/seriesBox/SeriesBox";
import CreatorBox from "@/components/search/creatorBox/CreatorBox";
// -------------------------------
// UI-komponent: kun rendering
// -------------------------------
function Page({
  mode,
  page,
  hitcount,
  isLoading,
  onWorkClick,
  onPageChange,
  hasAdvancedSearch,
  hasCqlSearch,
  hasQuery,
  rawcql,
  advancedCql,
  selectedFacets,
  creatorHit,
  seriesHit,
}) {
  const breakpoint = useBreakpoint();
  const isMobile = ["xs", "sm", "md"].includes(breakpoint);
  const currentPage = parseInt(page, 10) || 1;
  const numPages = Math.ceil(hitcount / 10);

  const isSimple = mode === "simpel";
  const searchRef = useRef();
  const [showTopBar, setShowTopBar] = useState(false);

  const hasActiveSearch =
    {
      simpel: hasQuery,
      avanceret: hasAdvancedSearch,
      cql: hasCqlSearch || hasAdvancedSearch,
    }[mode] ?? false;

  const shouldShowHistory = !isLoading && !hasActiveSearch;
  const shouldShowNoHits = !isLoading && hasActiveSearch && hitcount === 0;
  const shouldShowCreator = Boolean(creatorHit);
  const shouldShowSeries = !shouldShowCreator && Boolean(seriesHit);

  useEffect(() => {
    const handleScroll = () => {
      const rect = searchRef.current?.getBoundingClientRect();
      if (rect) {
        setShowTopBar(rect.bottom <= 0); // kun når hele Search er scrollet forbi
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const searchHitComponent = shouldShowCreator ? (
    <CreatorBox
      creatorHit={creatorHit}
      className="search-block"
      data-cy="search-block"
    />
  ) : shouldShowSeries ? (
    <SeriesBox
      seriesHit={seriesHit}
      className="search-block"
      data-cy="search-block"
    />
  ) : null;

  return (
    <>
      <TopBar
        isLoading={isLoading}
        searchHistoryObj={{ key: advancedCql }}
        className={showTopBar ? styles["topbar-visible"] : ""}
      />

      <Search />
      <div ref={searchRef} />

      <Section
        divider={false}
        colSize={{
          lg: 10,
          titel: 2,
        }}
        id="search-result-section"
        className={styles.section}
        title={
          hasActiveSearch && !isSimple ? (
            <div>
              {isMobile && (
                <div className={styles.titleflex}>
                  <FacetButton cql={rawcql} isLoading={isLoading} />
                  <SaveSearchBtn />
                </div>
              )}

              <div className={styles.titleflex}>
                <div>
                  <Title type="title5" skeleton={isLoading}>
                    {hitcount}
                  </Title>
                  <Text
                    type="text1"
                    className={styles.titleStyle}
                    skeleton={isLoading}
                  >
                    {translate({ context: "search", label: "title" })}
                  </Text>
                </div>

                {!isSimple && isMobile && hitcount > 0 && (
                  <div className={styles.sort_wrapper}>
                    <AdvancedSearchSort className={styles.sort_container} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <span />
          )
        }
        subtitle={
          hasActiveSearch &&
          !isMobile && (
            <div className={styles.facetsContainer}>
              <FacetTags selectedFacets={selectedFacets} />
              <div className={styles.subtitleStyle}>
                <Text type="text1">
                  {translate({ context: "search", label: "narrow-search" })}
                </Text>
              </div>
              <QuickFilter />
              {isSimple && <SimpleFacets />}
              {!isSimple && <AdvancedFacets cql={advancedCql} />}
            </div>
          )
        }
      >
        <Row>
          <Col xs={12} lg={12}>
            {shouldShowHistory && <History />}
            {shouldShowNoHits && <NoHitSearch isSimpleSearch={isSimple} />}

            {!isSimple && !isMobile && hitcount > 0 && (
              <div className={styles.advancedSearchActions}>
                <AdvancedSearchSort className={styles.sort_container} />
                <SaveSearchBtn />
              </div>
            )}

            {isSimple && !isLoading && hitcount > 0 && (
              <div className={styles.actions}>
                {isSimple && <FilterButton className={styles.filterButton} />}

                <div className={styles.supplementary}>
                  <Related />
                  <DidYouMean />
                </div>

                {isSimple && <SaveSearchBtn />}
              </div>
            )}
          </Col>

          {!isMobile && <Col lg={3} />}
        </Row>

        <Row className={styles.resultGrid}>
          {isMobile && searchHitComponent && (
            <Col xs={12} className={styles.resultsSidebarMobile}>
              {searchHitComponent}
            </Col>
          )}

          <Col xs={12} lg={9} className={styles.resultsMain}>
            <div className={styles.resultsList}>
              {Array(isMobile ? currentPage : 1)
                .fill({})
                .map((_, index) => (
                  <Result
                    key={`result-${index}`}
                    page={isMobile ? index + 1 : currentPage}
                    onWorkClick={onWorkClick}
                  />
                ))}
            </div>
          </Col>

          {!isMobile && searchHitComponent && (
            <Col xs={12} lg={3} className={styles.resultsSidebar}>
              {searchHitComponent}
            </Col>
          )}
        </Row>
      </Section>
      {hitcount > 0 && (
        <Pagination
          currentPage={currentPage}
          numPages={numPages}
          onChange={onPageChange}
        />
      )}
    </>
  );
}

Page.propTypes = {
  page: PropTypes.number,
  hitcount: PropTypes.number,
  isLoading: PropTypes.bool,
  onWorkClick: PropTypes.func,
  onPageChange: PropTypes.func,
  hasAdvancedSearch: PropTypes.bool,
  q: PropTypes.object,
  rawcql: PropTypes.string,
  advancedCql: PropTypes.string,
  selectedFacets: PropTypes.array,
  creatorHit: PropTypes.object,
  seriesHit: PropTypes.object,
};

// -------------------------------
// Wrap-komponent: data + props
// -------------------------------
export default function Wrap({ page = 1, onPageChange, onWorkClick }) {
  const { getQuery, hasQuery } = useQ();
  const { getQuery: getFiltersQuery } = useFilters();
  const q = getQuery();
  const filters = getFiltersQuery();
  const router = useRouter();

  const mode = router?.query?.mode;

  const isSimple = mode === "simpel";
  const isAdvanced = !isSimple;

  const advCtx = useAdvancedSearchContext();
  const { selectedFacets } = useFacets();
  const { selectedQuickFilters } = useQuickFilters();
  const { setValue } = useSearchHistory();
  const currentSearchHistoryItem = useCurrentSearchHistoryItem();

  const hasAdvancedSearch = !isEmpty(advCtx?.fieldSearchFromUrl) && isAdvanced;
  const hasCqlSearch = !isEmpty(advCtx?.cqlFromUrl) && isAdvanced;

  const cql = advCtx?.cqlFromUrl;
  const fieldSearch = advCtx?.fieldSearchFromUrl;

  const cqlAndFacetsQuery = getCqlAndFacetsQuery({
    cql,
    selectedFacets,
    quickFilters: selectedQuickFilters,
  });

  const fieldSearchQuery = convertStateToCql(fieldSearch);

  const advancedCql =
    cqlAndFacetsQuery ||
    convertStateToCql({
      ...fieldSearch,
      facets: selectedFacets,
      quickFilters: selectedQuickFilters,
    });

  const rawcql = cqlAndFacetsQuery ? cql : fieldSearchQuery;

  const simpleRes = useData(
    isSimple && searchFragments.hitcount({ q, filters })
  );

  const advancedRes = useData(
    !isSimple &&
      (hasAdvancedSearch || hasCqlSearch) &&
      advancedHitcount({ cql: advancedCql })
  );

  const shouldFetchExtraHits = isSimple
    ? hasQuery
    : hasAdvancedSearch || hasCqlSearch;
  const extraHitsRes = useData(
    shouldFetchExtraHits
      ? isSimple
        ? searchFragments.extraHits({ q, filters })
        : complexExtraHits({ cql: advancedCql })
      : null
  );
  const hitcount = isAdvanced
    ? advancedRes?.data?.complexSearch?.hitcount || 0
    : simpleRes?.data?.search?.hitcount || 0;

  const isLoading = isAdvanced ? advancedRes.isLoading : simpleRes.isLoading;

  const seriesHit = isAdvanced
    ? extraHitsRes?.data?.complexSearch?.seriesHit
    : extraHitsRes?.data?.search?.seriesHit || null;

  const creatorHit = isAdvanced
    ? extraHitsRes?.data?.complexSearch?.creatorHit
    : extraHitsRes?.data?.search?.creatorHit || null;
  //  const creatorHit = null;
  // Store the current search history item in the local storage
  useEffect(() => {
    if (currentSearchHistoryItem) {
      setValue(currentSearchHistoryItem);
    }
  }, [currentSearchHistoryItem]);

  return (
    <Page
      mode={mode}
      page={page}
      hitcount={hitcount}
      isLoading={isLoading}
      onWorkClick={onWorkClick}
      onPageChange={onPageChange}
      hasQuery={hasQuery}
      hasAdvancedSearch={hasAdvancedSearch}
      hasCqlSearch={hasCqlSearch}
      rawcql={rawcql}
      advancedCql={advancedCql}
      selectedFacets={selectedFacets || filters}
      creatorHit={creatorHit}
      seriesHit={seriesHit}
    />
  );
}

Wrap.propTypes = {
  page: PropTypes.number,
  onPageChange: PropTypes.func,
  onWorkClick: PropTypes.func,
};
