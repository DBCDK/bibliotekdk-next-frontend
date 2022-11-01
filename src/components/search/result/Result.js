import PropTypes from "prop-types";

import Pagination from "@/components/search/pagination/Pagination";
import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import Button from "@/components/base/button";
import Text from "@/components/base/text";

import Icon from "@/components/base/icon";
import { useData } from "@/lib/api/api";
import * as searchFragments from "@/lib/api/search.fragments";
import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";
import { useModal } from "@/components/_modal";

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
  modal,
  page,
  isLoading,
  hitcount = 0,
  filtersCount,
  onWorkClick,
  onPageChange,
}) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm" || false;

  const numPages = Math.ceil(hitcount / 10);

  const filtersLabel = Translate({
    context: "search",
    label: filtersCount === "0" ? "showAllFilters" : "showAllFiltersCount",
    vars: filtersCount === "0" ? null : [filtersCount],
  });

  return (
    <>
      <Section
        contentDivider={null}
        titleDivider={null}
        className={styles.section}
        bottomSpace={!(isMobile || breakpoint === "md")}
        title={
          <div className={styles.wrap}>
            <Button
              id="view-all-filters"
              className={styles.filtersButton}
              type="secondary"
              size="medium"
              dataCy="view-all-filters"
              onClick={() => modal.push("filter", { q })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                  modal.push("filter", { q });
                }
              }}
            >
              <Icon src="settings.svg" size={2} />
              {filtersLabel}
            </Button>
            {(isMobile || breakpoint === "md") && (
              <div>
                <Text type="text3" skeleton={isLoading} lines={1}>
                  {Translate({ context: "search", label: "title" })}
                </Text>
                <Text
                  type="text2"
                  className={styles.hitcount}
                  skeleton={isLoading}
                >
                  {hitcount}
                </Text>
              </div>
            )}
          </div>
        }
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
  const { filters } = useFilters();
  const { getQuery, hasQuery } = useQ();

  const q = getQuery();

  const modal = useModal();

  const { getCount } = useFilters();
  const filtersCount = getCount(["workType"]).toString();

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
      modal={modal}
      page={page}
      filtersCount={filtersCount}
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
