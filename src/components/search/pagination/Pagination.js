import PropTypes from "prop-types";

import styles from "./Pagination.module.css";
import Icon from "@/components/base/icon";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import React from "react";
import max from "lodash/max";
import ceil from "lodash/ceil";
import range from "lodash/range";
import { Arrow } from "@/components/work/overview/covercarousel/arrow/Arrow";

function calculatePaginationValues(currentPage, numPages, MAX_VISIBLE_PAGES) {
  const numVisiblePages =
    numPages > MAX_VISIBLE_PAGES ? MAX_VISIBLE_PAGES : numPages;

  const theoreticalBottomOffset = max([
    ceil((numVisiblePages - 1) / 2),
    numVisiblePages - 1 - (numPages - currentPage),
  ]);
  const actualBottomOffset =
    currentPage > theoreticalBottomOffset
      ? theoreticalBottomOffset
      : currentPage - 1;
  const bottomVisiblePage =
    currentPage - actualBottomOffset === 1
      ? 1
      : currentPage - actualBottomOffset;

  const topOffset = numVisiblePages - 1 - actualBottomOffset;
  const topVisiblePage =
    currentPage + topOffset > numPages ? numPages : currentPage + topOffset;

  return {
    goToFirst: bottomVisiblePage > 1,
    showPreviousPageArrow: currentPage !== 1,
    bottomOffset: actualBottomOffset,
    bottomVisiblePage: bottomVisiblePage,
    currentPage: currentPage,
    numPages: numPages,
    numVisiblePages: numVisiblePages,
    topVisiblePage: topVisiblePage,
    topOffset: topOffset,
    showNextPageArrow: currentPage !== numPages,
    goToLast: topVisiblePage < numPages,
  };
}

/**
 * Pagination buttons
 *
 */
export default function Pagination({
  currentPage = 1,
  onChange,
  numPages = 4,
  isLoading,
  MAX_VISIBLE_PAGES = 9,
  className,
}) {
  const {
    showPreviousPageArrow,
    bottomVisiblePage,
    topVisiblePage,
    showNextPageArrow,
  } = calculatePaginationValues(currentPage, numPages, MAX_VISIBLE_PAGES);

  const arrayOfPaginationPages = range(
    bottomVisiblePage,
    topVisiblePage + 1,
    1
  );

  function onChangeChecked(page, scroll = true) {
    onChange && onChange(page, scroll);
  }
  function onKeyDown(event, page, scroll = true) {
    if (["Enter", "Space"].includes(event.key)) {
      onChangeChecked(page, scroll);
    }
  }

  return (
    <React.Fragment>
      {numPages > 1 && numPages > currentPage && (
        <div className={`${styles.mobile} ${className}`}>
          <Button
            type="secondary"
            size="medium"
            tabIndex="0"
            skeleton={isLoading}
            onClick={(e) => {
              onChangeChecked(currentPage + 1, false);
              e.target.scrollTo({ bottom: 0 });
            }}
            onKeyDown={(event) => onKeyDown(event, currentPage + 1, false)}
          >
            {Translate({ context: "search", label: "more" })}
          </Button>
        </div>
      )}
      <div className={`${styles.pagination} ${styles.desktop} ${className}`}>
        <Arrow
          clickCallback={() => onChangeChecked(currentPage - 1)}
          arrowClass={`${styles.arrow_styling} ${
            !showPreviousPageArrow && styles.arrow_hidden
          }`}
          orientation={"left"}
          dataDisabled={!(!isLoading && showPreviousPageArrow)}
          size={{ w: 4, h: 4 }}
        />

        {!showPreviousPageArrow && <div className={styles.arrowPlaceholder} />}

        {ArrayOfPaginationPages.map((page, index) => {
          return (
            <Icon
              onClick={() => onChangeChecked(page)}
              onKeyDown={(event) => onKeyDown(event, page)}
              key={index}
              size={{ w: 4, h: 4 }}
              bgColor={"override"}
              className={
                !isLoading && page === currentPage ? styles.selected : ""
              }
              skeleton={isLoading}
              tabIndex="0"
              data-cy={`page-${page}-button`}
              alt=""
              tag={"button"}
            >
              {page}
            </Icon>
          );
        })}
        <Arrow
          clickCallback={() => onChangeChecked(currentPage + 1)}
          arrowClass={`${styles.arrow_styling} ${
            !showNextPageArrow && styles.arrow_hidden
          }`}
          orientation={"right"}
          dataDisabled={!(!isLoading && showNextPageArrow)}
          size={{ w: 4, h: 4 }}
        />

        {!showNextPageArrow && <div className={styles.arrowPlaceholder} />}
      </div>
    </React.Fragment>
  );
}
Pagination.propTypes = {
  currentPage: PropTypes.number,
  onChange: PropTypes.func,
  numPages: PropTypes.number,
  isLoading: PropTypes.bool,
};
