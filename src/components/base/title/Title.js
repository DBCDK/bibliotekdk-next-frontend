import PropTypes from "prop-types";

import Skeleton from "../skeleton";

import styles from "./Title.module.css";

/**
 *
 * @param {object || string} children
 * @param {object || string} className
 * @param {string} tag
 * @param {string} type
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
    <Tag className={`${styles.Title} ${styles[type]} ${className}`}>
      {children}
    </Tag>
  );
};

// Skeleton (loading) version of component
export const TitleSkeleton = (props) => {
  return (
    <Skeleton>
      <Title {...props} />
    </Skeleton>
  );
};

export default (props) => {
  // Data loading stuff here ...
  // const { data, isLoading } = useQuery(query);

  if (props.skeleton) {
    return <TitleSkeleton {...props} />;
  }

  return <Title {...props} />;
};

Title.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tag: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6"]),
  type: PropTypes.oneOf(["title1", "title2", "title3", "title4"]),
  skeleton: PropTypes.bool,
};
