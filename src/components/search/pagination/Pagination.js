import PropTypes from "prop-types";

import styles from "./Pagination.module.css";
import Icon from "@/components/base/icon";
import LeftSvg from "@/public/icons/arrowleft.svg";
import RightSvg from "@/public/icons/arrowright.svg";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";
import { useEffect, useState } from "react";

const MAX_VISIBLE_PAGES = 10;
/**
 * Pagination buttons
 *
 */
export default function Pagination({
  currentPage = 1,
  onChange,
  numPages = 4,
  isLoading,
}) {
  const [offset, setOffset] = useState(1);

  useEffect(() => {
    if (currentPage - offset >= MAX_VISIBLE_PAGES) {
      setOffset(currentPage - (MAX_VISIBLE_PAGES - 1));
    } else if (currentPage - offset < 0) {
      setOffset(currentPage);
    }
  }, [currentPage]);

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
            !isLoading && currentPage > 1 ? "" : styles.hidden
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

        {Array.apply(null, Array(Math.min(numPages, MAX_VISIBLE_PAGES))).map(
          (v, index) => {
            const page = offset + index;
            return (
              <Icon
                key={index}
                size={{ w: 4, h: 4 }}
                bgColor={"var(--blue)"}
                skeleton={false}
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
          }
        )}
        <div
          className={`${styles.arrow} ${
            !isLoading && currentPage < numPages ? "" : styles.hidden
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
