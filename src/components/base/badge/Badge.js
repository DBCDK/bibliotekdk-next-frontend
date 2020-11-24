import PropTypes from "prop-types";

import styles from "./Badge.module.css";

/**
 * Function to create a animated line
 *
 *
 * @param {string} className
 * @param {string | object} children
 * See propTypes for specific props and types
 *
 * @returns {component}
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
