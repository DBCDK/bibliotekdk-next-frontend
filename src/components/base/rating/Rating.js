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
function Rating({
  className = "",
  rating = "4/6",
  type = "star",
  skeleton = false,
}) {
  const key = cyKey({ name: "cy", prefix: "rating" });

  const context = { context: "rating" };

  if (rating === "" || !rating.includes("/")) {
    return null;
  }

  // Build rating array
  const arr = [];
  const split = rating.split("/");
  for (let i = 0; i < split[1]; i++) {
    const filled = i < split[0];
    arr.push({ type, filled });
  }

  return (
    <div data-cy={key} className={`${styles.rating} ${className}`}>
      {arr.map((r, i) => {
        const filledClass = r.filled ? styles.filled : "";
        const typeClass = r.type === "star" ? styles.star : "";

        return (
          <Icon skeleton={skeleton} size={3} key={`rating-${i}`}>
            <StarSvg className={`${typeClass} ${filledClass}`} />
          </Icon>
        );
      })}
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
  rating: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
