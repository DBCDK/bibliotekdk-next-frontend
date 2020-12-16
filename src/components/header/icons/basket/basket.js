/**
 * Custom basket action menu
 */
import PropTypes from "prop-types";

import Action from "@/components/base/action";
import Badge from "@/components/base/badge";

import styles from "./basket.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function BasketIcon(props) {
  const { className, items } = props;

  // Badge font size
  const sizeClass = items.length > 1 ? styles.font__small : styles.font__large;

  return (
    <Action {...props} className={`${className} ${styles.trigger}`}>
      <div className={styles.basket}>
        <div className={styles.icon}>
          <div className={styles.bag}>
            <div className={styles.handle} />
          </div>

          <div className={styles._bag} />

          <Badge className={`${styles.badge} ${sizeClass}`} children={items} />
        </div>
      </div>
    </Action>
  );
}

// PropTypes for component
BasketIcon.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  items: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  title: PropTypes.string,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.object,
  dataCy: PropTypes.string,
};
