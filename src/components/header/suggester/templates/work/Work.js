import PropTypes from "prop-types";

import { cyKey } from "@/utils/trim";

import Text from "@/components/base/text";

import styles from "./Work.module.css";

/**
 * Function to create the component
 *
 *
 * @param {string} className
 * @param {bool} skeleton
 * @param {object} data
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function Work({ className = "", data = {}, skeleton = false }) {
  return (
    <div
      className={`${styles.work} ${className}`}
      data-cy={cyKey({ name: "work-element", prefix: "suggester" })}
    >
      {/* <div className={styles.wrap}>
        {skeleton || hasCover ? (
          <Cover src={data.cover.thumbnail} size="fill" skeleton={skeleton} />
        ) : (
          <span />
        )}
      </div> */}
      <div className={styles.text}>
        <Text
          type="text1"
          className={styles.title}
          skeleton={skeleton}
          lines={2}
        >
          {data.highlight}
        </Text>
        {/*
        <Text
          type="text3"
          className={styles.type}
          skeleton={skeleton}
          lines={0}
        >
           {Translate({ ...context, label: "book" })}
        </Text>
        */}
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
 * @returns {JSX.Element}
 */
export function WorkSkeleton(props) {
  return <Work {...props} skeleton={true} />;
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Wrap(props) {
  if (props.skeleton) {
    return <WorkSkeleton {...props} />;
  }

  return <Work {...props} />;
}

// PropTypes for component
Wrap.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  skeleton: PropTypes.bool,
  data: PropTypes.shape({
    __typename: PropTypes.string,
    title: PropTypes.string,
    highlight: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    cover: PropTypes.shape({
      thumbnail: PropTypes.string,
    }),
  }),
};
