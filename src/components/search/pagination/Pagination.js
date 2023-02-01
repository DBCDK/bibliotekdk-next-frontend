import PropTypes from "prop-types";

import styles from "./Pagination.module.css";
import Icon from "@/components/base/icon";
import LeftSvg from "@/public/icons/arrowleft.svg";
import RightSvg from "@/public/icons/arrowright.svg";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import React from "react";
import _ from "lodash";

function calculatePaginationValues(currentPage, numPages, MAX_VISIBLE_PAGES) {
  const numVisiblePages =
    numPages > MAX_VISIBLE_PAGES ? MAX_VISIBLE_PAGES : numPages;

  const theoreticalBottomOffset = _.max([
    _.ceil((numVisiblePages - 1) / 2),
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
}) {
  const {
    showPreviousPageArrow,
    bottomVisiblePage,
    topVisiblePage,
    showNextPageArrow,
  } = calculatePaginationValues(currentPage, numPages, MAX_VISIBLE_PAGES);

  const arrayOfPaginationPages = _.range(
    bottomVisiblePage,
    topVisiblePage + 1,
    1
  );

  return (
    <React.Fragment>
      {numPages > 1 && numPages > currentPage && (
        <div className={`${styles.pagination} ${styles.mobile}`}>
          <Button
            type="secondary"
            size="medium"
            tabIndex="0"
            skeleton={isLoading}
            onClick={onChange && (() => onChange(currentPage + 1, false))}
            onKeyDown={(event) => {
              if (event.key === "Enter" && onChange) {
                onChange(currentPage + 1, false);
              }
            }}
          >
            {Translate({ context: "search", label: "more" })}
          </Button>
        </div>
      )}
      <div className={`${styles.pagination} ${styles.desktop}`}>
        <div
          tabIndex="0"
          className={`${styles.arrow} ${
            !isLoading && showPreviousPageArrow ? "" : styles.hidden
          }`}
          onKeyDown={(event) => {
            if (event.key === "Enter" && onChange) {
              onChange(Math.max(currentPage - 1, 1));
            }
          }}
          onClick={onChange && (() => onChange(Math.max(currentPage - 1, 1)))}
        >
          <LeftSvg />
        </div>

        {arrayOfPaginationPages.map((page, index) => {
          return (
            <Icon
              key={index}
              size={{ w: 4, h: 4 }}
              bgColor={"var(--blue)"}
              className={
                !isLoading && page === currentPage ? styles.selected : ""
              }
              onClick={onChange && (() => onChange(page))}
              onKeyDown={(event) => {
                if (event.key === "Enter" && onChange) {
                  onChange(page);
                }
              }}
              skeleton={isLoading}
              tabIndex="0"
              data-cy={`page-${page}-button`}
              alt=""
            >
              <span>{page}</span>
            </Icon>
          );
        })}
        <div
          className={`${styles.arrow} ${
            !isLoading && showNextPageArrow ? "" : styles.hidden
          }`}
          tabIndex="0"
          onKeyDown={(event) => {
            if (event.key === "Enter" && onChange) {
              onChange(Math.min(currentPage + 1, numPages));
            }
          }}
          onClick={
            onChange && (() => onChange(Math.min(currentPage + 1, numPages)))
          }
        >
          <RightSvg />
        </div>
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
