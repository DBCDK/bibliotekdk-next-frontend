import PropTypes from "prop-types";

import styles from "./Skeleton.module.css";

/**
 *
 * @param {int} n (number of lines wanted)
 * @param {object || string} children
 *
 * @returns {array} elements (lines)
 */
const CreateLines = ({ n, children }) => {
  let lines = [];
  for (let i = 0; i < Number(n); i++) {
    lines.push(
      <div className={`${styles.Line}`} key={"line-" + i}>
        {children}
      </div>
    );
  }
  return lines;
};

/**
 *
 * @param {object || string} children
 * @param {string} className
 * @param {bool} isSlow
 * @param {int} lines
 * @param {string} display (block || inline-block)
 *
 * @returns {component}
 */
export const Skeleton = ({
  children,
  className = "",
  isSlow = false,
  lines = 1,
  display = "inline-block",
}) => {
  const slowClass = isSlow ? styles.slow : "";

  // display -> block: makes component fill 100% of width
  // display -> inline-block: make component adapt to content width
  display = styles[display];

  return (
    <div className={`${styles.Skeleton} ${display} ${className} ${slowClass}`}>
      <div className={styles.Lines}>
        <CreateLines n={lines}>{children}</CreateLines>
      </div>
    </div>
  );
};

export default Skeleton;

Skeleton.propTypes = {
  children: PropTypes.object,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  isSlow: PropTypes.bool,
  lines: PropTypes.number,
  display: PropTypes.string,
};
