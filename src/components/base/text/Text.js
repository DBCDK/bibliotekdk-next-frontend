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
  tag = "p",
}) {
  // Set type of tag.
  // Because, this is a text component, p(aragraph) should always be used if possible!
  const Tag = tag;

  return (
    <Tag className={`${styles.text} ${styles[type]} ${className}`}>
      {children}
    </Tag>
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
export default function Container(props) {
  if (props.skeleton) {
    return <TextSkeleton {...props} />;
  }

  return <Text {...props} />;
}

// PropTypes for the component
Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
  ]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.oneOf(["text1", "text2", "text3"]),
  tag: PropTypes.oneOf(["p", "span"]),
  skeleton: PropTypes.bool,
};
