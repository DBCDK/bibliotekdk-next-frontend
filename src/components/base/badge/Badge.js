import PropTypes from "prop-types";

import styles from "./Badge.module.css";

/**
 * Function to create a badge
 *
 *
 * @param {string} className
 * @param {string | Object} children
 * See propTypes for specific props and types
 *
 * @returns {React.ReactElement | null}
 */
export default function Badge({ className = "", children = "0" }) {
  return (
    <div className={`${className} ${styles.badge}`}>
      <span>{children}</span>
    </div>
  );
}

// PropTypes for component
Badge.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
