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
import { hitcount as advancedHitcount } from "@/lib/api/complexSearch.fragments";

import AdvancedSearchSort from "@/components/search/advancedSearch/advancedSearchSort/AdvancedSearchSort";
import TopBar from "@/components/search/advancedSearch/topBar/TopBar";
import AdvancedFacets from "@/components/search/facets/advanced/advancedFacets";
import QuickFilter from "@/components/search/advancedSearch/quickfilter/QuickFilter";
import FacetTags from "@/components/search/facets/advanced/facetTags";
import { FacetButton } from "@/components/search/facets/advanced/facetButton/facetButton";
import SimpleFacets from "@/components/search/facets/simple";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import translate from "@/components/base/translate";

import isEmpty from "lodash/isEmpty";
import styles from "./Page.module.css";
import { useRouter } from "next/router";
import SaveSearchBtn from "../save";
import Related from "../related/Related";
import DidYouMean from "../didYouMean/DidYouMean";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
            <div
              className={`${styles.facetsContainer} ${
                isSimple ? styles.simple : ""
              }`}
            >
              <FacetTags className={styles.facetTags} />
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
          <Col xs={12} lg={8}>
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
          </Col>
          <Col xs={12} lg={4}>
            {/* <SeriesBox
              title="Aske i munden, sand i skoen"
              subtitle="Serie af Per Petterson"
              body="Per Pettersons serie om Arvid og hans familie. Fortællinger om Arvid, der vokser op i Oslo i 1950'erne og erfarer, at livet kan være trygt og utrygt, stabilt og ustabilt, snævert og uendeligt - samtidig. Senere om Arvid Jansen da han er 37 år og kommer i midtlivskrise. Hans mor har fået konstateret kræft og hans kone forlanger skilsmisse."
              note="Der er 6 bøger i serien"
              imageUrl="https://fbiinfo-present.dbc.dk/images/ydF9rP7ARdGDtX6ng3HnWg/240px!ATqg0YZeBPgi0WIS6rlF1TwMVJ2bFfI-u-GYmnDjs1oTkQ"
              thumbnails={[
                "https://fbiinfo-present.dbc.dk/images/ydF9rP7ARdGDtX6ng3HnWg/240px!ATqg0YZeBPgi0WIS6rlF1TwMVJ2bFfI-u-GYmnDjs1oTkQ",
                "https://fbiinfo-present.dbc.dk/images/ydF9rP7ARdGDtX6ng3HnWg/240px!ATqg0YZeBPgi0WIS6rlF1TwMVJ2bFfI-u-GYmnDjs1oTkQ",
                "https://fbiinfo-present.dbc.dk/images/ydF9rP7ARdGDtX6ng3HnWg/240px!ATqg0YZeBPgi0WIS6rlF1TwMVJ2bFfI-u-GYmnDjs1oTkQ",
              ]}
              linkLabel="Se hele serien"
              onLink={() => {
                console.log("Se hele serien");
              }}
              className="search-block"
              data-cy="search-block"
            /> */}
            <CreatorBox
              title="Haruki Murakami"
              role="Forfatter"
              body="Per Petterson er en dansk forfatter og har skrevet mange bøger om Arvid og hans familie."
              imageUrl="https://resize-me.dbc.dk/api/image?url=https://upload.wikimedia.org/wikipedia/commons/5/51/Conversatorio_Haruki_Murakami_%2812_de_12%29_%2845747009452%29_%28cropped%29.jpg&w=1200"
              className="search-block"
              data-cy="search-block"
            />
          </Col>
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

  const hitcount = isAdvanced
    ? advancedRes?.data?.complexSearch?.hitcount || 0
    : simpleRes?.data?.search?.hitcount || 0;

  const isLoading = isAdvanced ? advancedRes.isLoading : simpleRes.isLoading;

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
    />
  );
}

Wrap.propTypes = {
  page: PropTypes.number,
  onPageChange: PropTypes.func,
  onWorkClick: PropTypes.func,
};
