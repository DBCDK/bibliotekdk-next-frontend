/**
 * Custom basket action menu
 */
import PropTypes from "prop-types";

import Action from "@/components/base/action";

import styles from "./login.module.css";

/**
 * The Component function
 *
 * @param  {Object} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function LoginIcon(props) {
  const { className } = props;

  return (
    <Action
      {...props}
      className={`${className} ${styles.trigger}`}
      animation={true}
    >
      <div className={styles.login}>
        <div className={styles.icon}>
          <div className={styles.head} />
          <div className={styles.bodyWrap}>
            <div className={styles.body}>
              <div className={styles.border} />
            </div>
          </div>
        </div>
      </div>
    </Action>
  );
}

// PropTypes for component
LoginIcon.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  title: PropTypes.string,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.object,
  dataCy: PropTypes.string,
};
