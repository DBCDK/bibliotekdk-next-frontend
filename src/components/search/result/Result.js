import PropTypes from "prop-types";

import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import Title from "@/components/base/title";
import { useData } from "@/lib/api/api";
import { fast, all } from "@/lib/api/search.fragments";
import Divider from "@/components/base/divider";
import ViewSelector from "../viewselector";

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
  hitcount,
  onViewSelect,
  onWorkClick,
  viewSelected,
}) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm" || false;

  // Set number of hits for the user, ads a '+' if "more" than 100 results found.
  const hits = hitcount === 100 ? `${hitcount}+` : hitcount;

  return (
    <Section
      contentDivider={null}
      titleDivider={<Divider className={styles.titledivider} />}
      title={
        <div className={styles.titlewrapper}>
          <Title type="title4">
            {Translate({ context: "search", label: "title" })}
          </Title>
          <div>
            <Title
              type="title2"
              tag="h3"
              className={styles.resultlength}
              skeleton={isLoading}
            >
              {hits}
            </Title>
            <ViewSelector
              className={styles.viewselector}
              onViewSelect={onViewSelect}
              viewSelected={viewSelected}
            />
          </div>
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
  );
}

Result.propTypes = {
  q: PropTypes.string,
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
 * @returns {component}
 */
export default function Wrap({
  q,
  page,
  onViewSelect,
  onWorkClick,
  viewSelected,
  updateNumPages,
}) {
  // settings
  const limit = 10; // limit

  // use the useData hook to fetch data
  const fastResponse = useData(fast({ q, offset: 0, limit }));

  if (fastResponse.isLoading) {
    return <Result isLoading={true} />;
  }

  if (fastResponse.error) {
    return null;
  }

  const data = fastResponse.data;

  // Update hitcount in parent component, for pagination use
  if (updateNumPages && data) {
    const hitcount = data.search.hitcount;
    const numPages = Math.ceil(hitcount / limit);
    updateNumPages(numPages);
  }

  return (
    <Result
      q={q}
      page={page}
      hitcount={data.search.hitcount}
      onViewSelect={onViewSelect}
      onWorkClick={onWorkClick}
      viewSelected={viewSelected}
    />
  );
}

Wrap.propTypes = {
  q: PropTypes.string,
  page: PropTypes.number,
  viewSelected: PropTypes.string,
  onViewSelect: PropTypes.func,
  onWorkClick: PropTypes.func,
};
