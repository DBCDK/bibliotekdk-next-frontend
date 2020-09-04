import PropTypes from "prop-types";

import Skeleton from "../skeleton";

import styles from "./Text.module.css";

/**
 *
 * @param {object || string} children
 * @param {object || string} className
 * @param {string} type
 *
 * @returns {component}
 */
export const Text = ({
  children = "lorem ipsum dolor sit amet ...",
  className = "",
  type = "text1",
}) => {
  return (
    <p className={`${styles.Text} ${styles[type]} ${className}`}>{children}</p>
  );
};

// Skeleton (loading) version of component
export const TextSkeleton = (props) => {
  return (
    <Skeleton lines={props.lines || 3} display={"block"}>
      <Text {...props}>...</Text>
    </Skeleton>
  );
};

export default (props) => {
  // Data loading stuff here ...
  // const { data, isLoading } = useQuery(query);

  if (props.skeleton) {
    return <TextSkeleton {...props} />;
  }

  return <Text {...props} />;
};

Text.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.oneOf(["text1", "text2", "text3"]),
  skeleton: PropTypes.bool,
};
