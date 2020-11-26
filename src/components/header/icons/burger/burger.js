/**
 * Custom basket action menu
 */
import PropTypes from "prop-types";

import Action from "@/components/base/action";

import styles from "./burger.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function BurgerIcon(props) {
  const { className } = props;

  return (
    <Action {...props} className={`${className} ${styles.trigger}`}>
      <div className={styles.burger}>
        <div className={styles.icon}>
          <div className={styles.line} />
          <div className={styles.line} />
          <div className={styles.line} />
        </div>
      </div>
    </Action>
  );
}

// PropTypes for component
BurgerIcon.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  title: PropTypes.string,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.object,
  dataCy: PropTypes.string,
};
