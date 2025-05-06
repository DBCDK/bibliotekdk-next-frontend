import PropTypes from "prop-types";

import Pagination from "@/components/search/pagination/Pagination";
import Section from "@/components/base/section";
import { useData } from "@/lib/api/api";
import * as searchFragments from "@/lib/api/search.fragments";
import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";

import { subjects } from "@/lib/api/relatedSubjects.fragments";

import FilterButton from "../filterButton";

import useBreakpoint from "@/components/hooks/useBreakpoint";

import ResultPage from "./page";

import styles from "./Result.module.css";
import { NoHitSearch } from "@/components/search/advancedSearch/advancedSearchResult/noHitSearch/NoHitSearch";
import { FacetTags } from "@/components/search/advancedSearch/facets/facetTags/facetTags";
import Text from "@/components/base/text/Text";
import translate from "@/components/base/translate/Translate";
import QuickFilter from "@/components/search/advancedSearch/quickfilter/QuickFilter";

import SimpleFacets from "@/components/search/facets/simpleFacets";

/**
 * Search result
 *
 * @param {Object} props
 * See propTypes for specific props and types
 */
export function Result({
  page,
  isLoading,
  hitcount = 0,
  onWorkClick,
  onPageChange,
  noRelatedSubjects,
  selectedFacets,
}) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm" || false;
  const isTablet = breakpoint === "md";
  const isDesktop = breakpoint === "lg" || breakpoint === "xl";

  const numPages = Math.ceil(hitcount / 10);

  const noRelatedSubjectsClass = noRelatedSubjects
    ? styles.noRelatedSubjects
    : "";

  return (
    <>
      <Section
        className={`${styles.section} ${noRelatedSubjectsClass}`}
        divider={false}
        title={<span />}
        // title={
        //   !isLoading && !isTablet && hitcount > 0 ? (
        //     <FilterButton
        //       className={`${styles.filterButton} ${styles.visible}`}
        //     />
        //   ) : (
        //     <span />
        //   )
        // }
        // rightSideTitle={isMobile}
        subtitle={
          !isTablet && !isMobile ? (
            <>
              <FacetTags origin="simpleSearch" />
              <div className={styles.subtitleStyle}>
                <Text type="text1" className={styles.titleStyle}>
                  {translate({ context: "search", label: "narrow-search" })}
                </Text>
              </div>
              <QuickFilter />
              <SimpleFacets />
            </>
          ) : (
            <span />
          )
        }
        colSize={{
          lg: { offset: 0, span: true },
          titel: { lg: { offset: 3, span: true } },
        }}
        id="search-result-section"
      >
        {hitcount === 0 && !isLoading && <NoHitSearch isSimpleSearch={true} />}

        {Array(isMobile ? page : 1)
          .fill({})
          .map((p, index) => (
            <ResultPage
              key={`result-page-${index}`}
              page={isMobile ? index + 1 : page}
              onWorkClick={onWorkClick}
            />
          ))}
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

Result.propTypes = {
  q: PropTypes.object,
  page: PropTypes.number,
  isLoading: PropTypes.bool,
  hitcount: PropTypes.number,
  viewSelected: PropTypes.string,
  onViewSelect: PropTypes.func,
  onWorkClick: PropTypes.func,
  selectedFacets: PropTypes.object,
};

/**
 * Wrap is a react component responsible for loading
 * data and displaying the right variant of the component
 *
 * @param {Object} props Component props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap({ page, onWorkClick, onPageChange }) {
  const { getQuery, hasQuery } = useQ();
  const q = getQuery();
  const { filters } = useFilters();

  // use the useData hook to fetch data
  const fastResponse = useData(
    hasQuery && searchFragments.hitcount({ q, filters })
  );

  // prioritized q type to get related subjects for
  const query = q.subject || q.all || q.title || q.creator;

  const relatedSubjects = useData(query && subjects({ q: [query], limit: 7 }));

  if (fastResponse.error) {
    return null;
  }

  if (fastResponse.isLoading) {
    return <Result page={page} isLoading={true} />;
  }

  return (
    <Result
      page={page}
      noRelatedSubjects={!relatedSubjects?.data?.relatedSubjects?.length > 0}
      isLoading={relatedSubjects.isLoading}
      hitcount={fastResponse?.data?.search?.hitcount}
      onWorkClick={onWorkClick}
      onPageChange={onPageChange}
      selectedFacets={filters}
    />
  );
}

Wrap.propTypes = {
  page: PropTypes.number,
  viewSelected: PropTypes.string,
  onViewSelect: PropTypes.func,
  onWorkClick: PropTypes.func,
};
