import PropTypes from "prop-types";

import styles from "./AnimationLine.module.css";

/**
 * Function to create a animated line
 *
 *  CSS needed for animation to work:
 * [element] is the element you will hover to start the animation.
 *
 * .[element]{
 *    position:relative;
 *  }
 *
 * .[element]:hover hr:last-child {
 *    display: none;
 *  }
 *
 *  .[element]:hover hr {
 *    transform: scale(1);
 *  }
 *
 * @param {string} className
 * @param {bool} keepVisible
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function AnimationLine({ className = "", keepVisible = false }) {
  const hideClass = keepVisible ? "" : styles.hide;

  return (
    <React.Fragment>
      <hr className={`${styles.line1} ${className}`} />
      <hr className={`${styles.line2} ${hideClass} ${className}`} />
    </React.Fragment>
  );
}

// PropTypes for component
AnimationLine.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  keepVisible: PropTypes.bool,
};
