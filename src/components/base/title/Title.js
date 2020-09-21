import PropTypes from "prop-types";

import Skeleton from "../skeleton";

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
  return (
    <Title {...props} className={`${props.className} ${styles.skeleton}`}>
      <Skeleton />
      {props.children}
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
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tag: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6"]),
  type: PropTypes.oneOf(["title1", "title2", "title3", "title4"]),
  skeleton: PropTypes.bool,
};
