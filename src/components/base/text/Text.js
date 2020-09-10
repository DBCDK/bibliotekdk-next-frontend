import PropTypes from "prop-types";

import Skeleton from "../skeleton";

import styles from "./Text.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Text({
  children = "lorem ipsum dolor sit amet ...",
  className = "",
  type = "text1",
}) {
  return (
    <p className={`${styles.Text} ${styles[type]} ${className}`}>{children}</p>
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
function TextSkeleton(props) {
  // const lines = props.display === "block" ? props.lines || 3 : 1;

  return (
    <Skeleton lines={props.lines || 3} display={"block"}>
      <Text {...props}>...</Text>
    </Skeleton>
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
export default function TextDefault(props) {
  if (props.skeleton) {
    return <TextSkeleton {...props} />;
  }

  return <Text {...props} />;
}

// PropTypes for Text component
TextDefault.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.oneOf(["text1", "text2", "text3"]),
  skeleton: PropTypes.bool,
};
