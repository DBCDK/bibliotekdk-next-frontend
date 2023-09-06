import PropTypes from "prop-types";
import { cyKey } from "@/utils/trim";
import Text from "@/components/base/text";
import styles from "./Creator.module.css";

/**
 * Function to create the component
 *
 *
 * @param {string} className
 * @param {boolean} skeleton
 * @param {object} data
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Creator({ className = "", data = {}, skeleton = false }) {
  return (
    <div
      className={`${styles.creator} ${className}`}
      data-cy={cyKey({ name: "creator-element", prefix: "suggester" })}
    >
      {/* <div className={styles.wrap}>
        {!skeleton && data.imageUrl ? (
          <img src={data.imageUrl} alt="" />
        ) : (
          <Icon
            src="login.svg"
            bgColor="var(--iron)"
            skeleton={skeleton}
            alt=""
          />
        )}
      </div> */}
      <div className={styles.text}>
        <Text
          type="text1"
          className={styles.name}
          skeleton={skeleton}
          lines={2}
        >
          {data.highlight}
        </Text>
        {/* <Text
          type="text3"
          className={styles.type}
          skeleton={skeleton}
          lines={0}
        >
          {Translate({ ...context, label: "creator" })}
        </Text> */}
      </div>
    </div>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {Object} props
 *  See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function CreatorSkeleton(props) {
  return <Creator {...props} skeleton={true} />;
}

/**
 *  Default export function of the Component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Wrap(props) {
  if (props.skeleton) {
    return <CreatorSkeleton {...props} />;
  }

  return <Creator {...props} />;
}

// PropTypes for component
Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  skeleton: PropTypes.bool,
  data: PropTypes.shape({
    __typename: PropTypes.string,
    name: PropTypes.string,
    highlight: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    imageUrl: PropTypes.string,
  }),
};
