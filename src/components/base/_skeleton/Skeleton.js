import PropTypes from "prop-types";

import styles from "./Skeleton.module.css";

/**
 *
 * @param {int} n (number of lines wanted)
 * @param {object || string} children
 *
 * @returns {array} elements (lines)
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
 * @param {object} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Skeleton({
  children,
  className = "",
  isSlow = false,
  lines = 1,
  display = "inline-block",
}) {
  // Adds the slow loading class (error/red loading color)
  const slowClass = isSlow ? styles.slow : "";

  // display -> block: makes component fill 100% of width
  // display -> inline-block: make component adapt to content width
  display = styles[display];

  return (
    <div className={`${styles.skeleton} ${display} ${className} ${slowClass}`}>
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
  display: PropTypes.string,
};
