import PropTypes from "prop-types";

import { cyKey } from "@/utils/trim";

import Text from "@/components/base/text";
import Icon from "@/components/base/icon";

import Translate from "@/components/base/translate";

import styles from "./Subject.module.css";

/**
 * Function to create the component
 *
 *
 * @param {string} className
 * @param {bool} skeleton
 * @param {object} data
 *
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export function Subject({ className = "", data = {}, skeleton = false }) {
  const context = { context: "suggester" };

  const skeletonClass = skeleton ? styles.skeleton : "";

  return (
    <div
      className={`${styles.subject} ${className} ${skeletonClass}`}
      data-cy={cyKey({ name: "subject-element", prefix: "suggester" })}
    >
      <div className={styles.wrap}>
        <Icon src="search.svg" bgColor="var(--iron)" skeleton={skeleton} />
      </div>

      <div className={styles.text}>
        <Text
          type="text1"
          className={styles.value}
          skeleton={skeleton}
          lines={2}
        >
          {data.highlight}
        </Text>
        <Text
          type="text3"
          className={styles.type}
          skeleton={skeleton}
          lines={0}
        >
          {Translate({ ...context, label: "subject" })}
        </Text>
      </div>
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
export function SubjectSkeleton(props) {
  return <Subject {...props} className={styles.skeleton} skeleton={true} />;
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  if (props.skeleton) {
    return <SubjectSkeleton {...props} />;
  }

  return <Subject {...props} />;
}

// PropTypes for component
Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  skeleton: PropTypes.bool,
  data: PropTypes.shape({
    __typename: PropTypes.string,
    value: PropTypes.string,
    highlight: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }),
};
