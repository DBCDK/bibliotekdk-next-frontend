import PropTypes from "prop-types";

import Skeleton from "@/components/base/skeleton";

import styles from "./Title.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export const Title = ({
  children = "im a title",
  className = "",
  tag = "h1",
  type = "title1",
}) => {
  const Tag = tag;

  return (
    <Tag className={`${styles.title} ${styles[type]} ${className}`}>
      {children}
    </Tag>
  );
};

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
 */
export const TitleSkeleton = (props) => {
  const lines = props.lines || 1;

  return (
    <Title {...props} className={`${props.className} ${styles.skeleton}`}>
      <Skeleton lines={lines} />
      {Array.from(Array(lines).keys()).map((l) => (
        <Title tag={"span"} type={props.type} key={`txt-${l}`} />
      ))}
    </Title>
  );
};

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
    return <TitleSkeleton {...props} />;
  }

  return <Title {...props} />;
}

// PropTypes for the component
Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tag: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6", "span"]),
  type: PropTypes.oneOf(["title1", "title2", "title3", "title4", "title5"]),
  skeleton: PropTypes.bool,
};
