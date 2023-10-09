import PropTypes from "prop-types";

import styles from "./Skeleton.module.css";

/**
 *
 * @param {number} n (number of lines wanted)
 * @param {Object || string} children
 *
 * @returns {Array} elements (lines)
 */
function CreateLines({ n, children }) {
  let lines = [];
  for (let i = 0; i < Number(n); i++) {
    lines.push(
      <div className={`${styles.line}`} key={"line-" + i}>
        {children}
      </div>
    );
  }
  return lines;
}

/**
 * Function to create a loading overlay on a component.
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.ReactElement | null}
 */
export default function Skeleton({ children, className = "", lines = 1 }) {
  return (
    <div className={`${styles.skeleton} ${className}`} data-cy={"skeleton"}>
      <div className={styles.lines}>
        <CreateLines n={lines}>{children}</CreateLines>
      </div>
    </div>
  );
}

// PropTypes for Skeleton component
Skeleton.propTypes = {
  children: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isSlow: PropTypes.bool,
  lines: PropTypes.number,
};
