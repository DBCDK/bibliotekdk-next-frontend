import PropTypes from "prop-types";

import { cyKey } from "../../../utils/trim";

import Skeleton from "../skeleton";
import Icon from "../icon";
import translate from "../translate";

import StarSvg from "../../../../public/icons/star.svg";

import styles from "./Rating.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Rating({ className = "", rating = "", skeleton = false }) {
  const key = cyKey({ name: "cy", prefix: "rating" });

  const context = { context: "rating" };

  return (
    <div data-cy={key} className={`${className} ${styles.rating}`}>
      <Icon skeleton={skeleton} size={3}>
        <StarSvg className={`${styles.star} ${styles.filled}`} />
      </Icon>
      <Icon skeleton={skeleton} size={3}>
        <StarSvg className={`${styles.star} ${styles.filled}`} />
      </Icon>
      <Icon skeleton={skeleton} size={3}>
        <StarSvg className={`${styles.star} ${styles.filled}`} />
      </Icon>
      <Icon skeleton={skeleton} size={3}>
        <StarSvg className={`${styles.star} ${styles.filled}`} />
      </Icon>
      <Icon skeleton={skeleton} size={3}>
        <StarSvg className={`${styles.star}`} />
      </Icon>
      <Icon skeleton={skeleton} size={3}>
        <StarSvg className={`${styles.star}`} />
      </Icon>
    </div>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
 */
function RatingSkeleton(props) {
  return (
    <Rating
      {...props}
      className={styles.skeleton}
      onClick={null}
      disabled={true}
    >
      <Skeleton />
    </Rating>
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Container(props) {
  if (props.skeleton) {
    return <RatingSkeleton {...props} />;
  }

  return <Rating {...props} />;
}

// PropTypes for Container component
Container.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
};
