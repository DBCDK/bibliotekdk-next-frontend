/**
 * Custom basket action menu
 */
import PropTypes from "prop-types";

import Action from "@/components/base/action";

import styles from "./search.module.css";

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function SearchIcon(props) {
  const { className } = props;

  return (
    <Action
      {...props}
      className={`${className} ${styles.trigger}`}
      data-icon-type="search"
    >
      <div className={styles.search}>
        <div className={styles.icon}>
          <div className={styles.lens}>
            <div className={styles.handle} />
          </div>
        </div>
      </div>
    </Action>
  );
}

// PropTypes for component
SearchIcon.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  title: PropTypes.string,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.object,
  dataCy: PropTypes.string,
};
