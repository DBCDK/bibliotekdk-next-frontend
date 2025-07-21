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

import ResultPage from "../result";

import styles from "./Page.module.css";
import { NoHitSearch } from "@/components/search/advancedSearch/advancedSearchResult/noHitSearch/NoHitSearch";
import Searchbar from "../searchbar";
import Related from "../related";
import DidYouMean from "../didYouMean";
import Search from "../Search";
import useHistory from "@/components/hooks/useHistory";
import History from "@/components/search/history";

/**
 * Search result
 *
 * @param {Object} props
 * See propTypes for specific props and types
 */
export function Result({
  q,
  page,
  isLoading,
  hitcount = 0,
  onWorkClick,
  onPageChange,
  noRelatedSubjects,
}) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm" || false;
  const isTablet = breakpoint === "md";
  const isDesktop = breakpoint === "lg" || breakpoint === "xl";

  const numPages = Math.ceil(hitcount / 10);

  const noRelatedSubjectsClass = noRelatedSubjects
    ? styles.noRelatedSubjects
    : "";

  const shouldShowHistory = !q?.all;

  const shouldShowNoHit = q?.all && hitcount === 0;

  return (
    <main>
      <Search />

      {/* <Searchbar q={q} />
      <Related q={q} />
      <DidYouMean q={q} /> */}

      <Section
        className={`${styles.section} ${noRelatedSubjectsClass}`}
        divider={false}
        title={
          !isLoading && !isTablet && hitcount > 0 ? (
            <FilterButton
              className={`${styles.filterButton} ${styles.visible}`}
            />
          ) : (
            <span />
          )
        }
        rightSideTitle={isDesktop}
        colSize={{ lg: { offset: 3, span: true } }}
        id="search-result-section"
      >
        {!isLoading && shouldShowHistory && <History />}
        {!isLoading && shouldShowNoHit && <NoHitSearch isSimpleSearch={true} />}

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
    </main>
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

  const [history] = useHistory();

  if (fastResponse.error) {
    return null;
  }

  if (fastResponse.isLoading) {
    return <Result page={page} isLoading={true} />;
  }

  return (
    <Result
      q={q}
      page={page}
      history={history}
      noRelatedSubjects={!relatedSubjects?.data?.relatedSubjects?.length > 0}
      isLoading={relatedSubjects.isLoading}
      hitcount={fastResponse?.data?.search?.hitcount}
      onWorkClick={onWorkClick}
      onPageChange={onPageChange}
    />
  );
}

Wrap.propTypes = {
  page: PropTypes.number,
  viewSelected: PropTypes.string,
  onViewSelect: PropTypes.func,
  onWorkClick: PropTypes.func,
};
