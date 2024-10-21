import PropTypes from "prop-types";
import Action from "@/components/base/action";
import styles from "./burger.module.css";
/**
 * The Component function replicating the uploaded SVG icon
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function EarthIcon(props) {
  const { className } = props;

  return (
    <Action
      {...props}
      className={`${className} ${styles.trigger}`}
      animation={true}
    >
      <div className={styles.icon}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24px"
          height="24px"
          viewBox="0 0 24 24"
          role="img"
          aria-labelledby="languageIconTitle"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={styles.earth}
        >
          <title id="languageIconTitle">Language</title>
          <circle cx="12" cy="12" r="10" />
          <path
            strokeLinecap="round"
            d="M12,22 C14.6666667,19.5757576 16,16.2424242 16,12 C16,7.75757576 14.6666667,4.42424242 12,2 C9.33333333,4.42424242 8,7.75757576 8,12 C8,16.2424242 9.33333333,19.5757576 12,22 Z"
          />
          <path d="M2.5 9L21.5 9M2.5 15L21.5 15" />
        </svg>
      </div>
    </Action>
  );
}

// PropTypes for component
EarthIcon.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  href: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  title: PropTypes.string,
  badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.object,
  dataCy: PropTypes.string,
};
