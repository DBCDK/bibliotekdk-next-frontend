import PropTypes from "prop-types";

import Pagination from "@/components/search/pagination/Pagination";
import Section from "@/components/base/section";
import Button from "@/components/base/button";
import Icon from "@/components/base/icon";
import { useData } from "@/lib/api/api";
import * as searchFragments from "@/lib/api/search.fragments";
import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";
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
}) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm" || false;
  const isDesktop = breakpoint === "lg" || breakpoint === "xl" || false;
  const numPages = Math.ceil(hitcount / 10);

  return (
    <>
      <Section
        divider={false}
        space={{ top: isDesktop ? 0 : "var(--pt2)" }}
        className={styles.section}
        title=" "
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
        isLoading={isLoading}
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

  if (fastResponse.error) {
    return null;
  }

  const data = fastResponse.data || {};

  if (fastResponse.isLoading) {
    return <Result page={page} isLoading={true} />;
  }

  return (
    <Result
      q={q}
      page={page}
      hitcount={data.search?.hitcount}
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
