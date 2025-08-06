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
import useAdvancedSearchHistory from "@/components/hooks/useAdvancedSearchHistory";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import { useFacets } from "@/components/search/advancedSearch/useFacets";
import { useQuickFilters } from "@/components/search/advancedSearch/useQuickFilters";
import {
  getCqlAndFacetsQuery,
  convertStateToCql,
} from "@/components/search/advancedSearch/utils";

import * as searchFragments from "@/lib/api/search.fragments";
import { hitcount as advancedHitcount } from "@/lib/api/complexSearch.fragments";

import AdvancedSearchSort from "@/components/search/advancedSearch/advancedSearchSort/AdvancedSearchSort";
import TopBar from "@/components/search/advancedSearch/topBar/TopBar";
import AdvancedFacets from "@/components/search/advancedSearch/facets/advancedFacets";
import QuickFilter from "@/components/search/advancedSearch/quickfilter/QuickFilter";
import { FacetTags } from "@/components/search/advancedSearch/facets/facetTags/facetTags";
import { FacetButton } from "@/components/search/advancedSearch/facets/facetButton/facetButton";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import translate from "@/components/base/translate";

import isEmpty from "lodash/isEmpty";
import cx from "classnames";
import styles from "./Page.module.css";

// -------------------------------
// UI-komponent: kun rendering
// -------------------------------
function Page({
  page,
  hitcount,
  isLoading,
  onWorkClick,
  onPageChange,
  hasAdvancedSearch,
  hasQuery,
  q,
  rawcql,
  advancedCql,
  selectedFacets,
}) {
  const breakpoint = useBreakpoint();
  const isMobile = ["xs", "sm", "md"].includes(breakpoint);
  const currentPage = parseInt(page, 10) || 1;
  const numPages = Math.ceil(hitcount / 10);

  const searchRef = useRef();
  const [showTopBar, setShowTopBar] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowTopBar(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "-150px 0px 0px 0px",
      }
    );

    const current = searchRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

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
          lg: { offset: 0, span: true },
          titel: { lg: { offset: 3, span: true } },
        }}
        id="search-result-section"
        className={styles.section}
        title={
          hasAdvancedSearch ? (
            <div>
              <FacetButton cql={rawcql} isLoading={isLoading} />
              <div className={styles.mobileTags}>
                <FacetTags />
              </div>
              <div className={styles.titleflex}>
                <div className={styles.borderTitleTop}></div>
                <Title type="title5" skeleton={isLoading}>
                  {hitcount}
                </Title>
                <Text
                  type="text3"
                  className={styles.titleStyle}
                  skeleton={isLoading}
                >
                  {translate({ context: "search", label: "title" })}
                </Text>
              </div>
            </div>
          ) : !isLoading && hitcount > 0 ? (
            <FilterButton className={styles.filterButton} />
          ) : (
            <span />
          )
        }
        subtitle={
          hasAdvancedSearch && (
            <div className={styles.facetsContainer}>
              <FacetTags selectedFacets={selectedFacets} />
              <div className={styles.subtitleStyle}>
                <Text type="text1">
                  {translate({ context: "search", label: "narrow-search" })}
                </Text>
              </div>
              <QuickFilter />
              <AdvancedFacets cql={advancedCql} />
            </div>
          )
        }
        sectionContentClass={
          hasAdvancedSearch && isMobile ? styles.sectionContentStyle : ""
        }
        sectionTitleClass={hasAdvancedSearch ? styles.sectionTitleClass : ""}
      >
        {!isLoading && !hasAdvancedSearch && !q?.all && <History />}
        {!isLoading && hasQuery && hitcount === 0 && (
          <NoHitSearch isSimpleSearch={!hasAdvancedSearch} />
        )}

        {hasAdvancedSearch && hitcount > 0 && (
          <div className={cx(styles.sort_wrapper)}>
            <AdvancedSearchSort className={cx(styles.sort_container)} />
          </div>
        )}

        <div>
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
};

// -------------------------------
// Wrap-komponent: data + props
// -------------------------------
export default function Wrap({ page = 1, onPageChange, onWorkClick }) {
  const { getQuery, hasQuery } = useQ();
  const { filters } = useFilters();
  const q = getQuery();

  const advCtx = useAdvancedSearchContext();
  const { selectedFacets } = useFacets();
  const { selectedQuickFilters } = useQuickFilters();
  const { setValue } = useAdvancedSearchHistory();

  const hasAdvancedSearch =
    !isEmpty(advCtx?.fieldSearchFromUrl) || !isEmpty(advCtx?.cqlFromUrl);

  const simpleQuery = hasQuery && searchFragments.hitcount({ q, filters });

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

  const simpleRes = useData(!hasAdvancedSearch && simpleQuery);
  const advancedRes = useData(
    hasAdvancedSearch && advancedHitcount({ cql: advancedCql })
  );

  const hitcount = hasAdvancedSearch
    ? advancedRes?.data?.complexSearch?.hitcount || 0
    : simpleRes?.data?.search?.hitcount || 0;

  const isLoading = hasAdvancedSearch
    ? advancedRes.isLoading
    : simpleRes.isLoading;

  if (
    hasAdvancedSearch &&
    !advancedRes?.error &&
    !advancedRes?.isLoading &&
    (cqlAndFacetsQuery || fieldSearchQuery)
  ) {
    setValue({
      key: advancedCql,
      hitcount,
      fieldSearch,
      cql: rawcql,
      selectedFacets,
      selectedQuickFilters,
    });
  }

  return (
    <Page
      page={page}
      hitcount={hitcount}
      isLoading={isLoading}
      onWorkClick={onWorkClick}
      onPageChange={onPageChange}
      hasQuery={hasQuery}
      hasAdvancedSearch={hasAdvancedSearch}
      q={q}
      rawcql={rawcql}
      advancedCql={advancedCql}
      selectedFacets={selectedFacets}
    />
  );
}

Wrap.propTypes = {
  page: PropTypes.number,
  onPageChange: PropTypes.func,
  onWorkClick: PropTypes.func,
};
