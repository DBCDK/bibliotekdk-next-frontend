import PropTypes from "prop-types";

import styles from "./Pagination.module.css";
import Icon from "@/components/base/icon";
import LeftSvg from "@/public/icons/arrowleft.svg";
import RightSvg from "@/public/icons/arrowright.svg";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";

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
  return (
    <React.Fragment>
      <div className={`${styles.pagination} ${styles.mobile}`}>
        <Button type="secondary" size="medium" skeleton={isLoading}>
          {Translate({ context: "search", label: "more" })}
        </Button>
      </div>
      <div className={`${styles.pagination} ${styles.desktop}`}>
        <div
          className={`${styles.arrow} ${
            !isLoading && currentPage > 1 ? "" : styles.hidden
          }`}
          onClick={onChange && (() => onChange(Math.max(currentPage - 1, 1)))}
        >
          <LeftSvg />
        </div>

        {Array.apply(null, Array(numPages)).map((v, index) => {
          const page = index + 1;
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
            >
              {page}
            </Icon>
          );
        })}
        <div
          className={`${styles.arrow} ${
            !isLoading && currentPage < numPages ? "" : styles.hidden
          }`}
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
