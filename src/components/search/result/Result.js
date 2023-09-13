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

/**
 * Search result
 *
 * @param {object} props
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
  const numPages = Math.ceil(hitcount / 10);

  const visibleClass = noRelatedSubjects ? styles.visible : "";
  const noRelatedSubjectsClass = noRelatedSubjects
    ? styles.noRelatedSubjects
    : "";

  return (
    <>
      <Section
        className={`${styles.section} ${noRelatedSubjectsClass}`}
        divider={false}
        title={
          !isLoading && !isTablet ? (
            <FilterButton
              className={`${styles.filterButton} ${visibleClass}`}
            />
          ) : (
            <span />
          )
        }
        rightSideTitle={true}
        colSize={{ lg: { offset: 3, span: true } }}
        id="search-result-section"
      >
        {Array(isMobile ? page : 1)
          .fill({})
          .map((p, index) => (
            <ResultPage
              key={`result-page-${index}`}
              q={q}
              page={isMobile ? index + 1 : page}
              onWorkClick={onWorkClick}
            />
          ))}
      </Section>
      <Pagination
        numPages={numPages}
        currentPage={parseInt(page, 10)}
        onChange={onPageChange}
      />
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
};

/**
 * Wrap is a react component responsible for loading
 * data and displaying the right variant of the component
 *
 * @param {Object} props Component props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
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
      q={q}
      page={page}
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
