import PropTypes from "prop-types";

import Skeleton from "../skeleton";

import styles from "./Cover.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Cover({
  children = null,
  src = "../",
  className = "",
  bgColor = null,
  size = [200, 300],
  onClick = null,
}) {
  // Set icon size
  const dimensions = {
    width: `${size[0]}px`,
    height: `${size[1]}px`,
  };

  const backgroundColor = {
    backgroundColor: bgColor ? bgColor : "transparent",
  };

  const dynamicStyles = {
    ...dimensions,
    ...backgroundColor,
  };

  return (
    <div
      style={dynamicStyles}
      className={`${styles.Cover} ${className}`}
      onClick={onClick}
    >
      <img src={src} />
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
function CoverSkeleton(props) {
  return (
    <Skeleton>
      <Cover {...props} onClick={null} src={null} bgColor={null} />
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
  if (props.skeleton || !props.src) {
    return <CoverSkeleton {...props} />;
  }

  return <Cover {...props} />;
}

// PropTypes for the Component
Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  src: PropTypes.string.isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  bgColor: PropTypes.string,
  size: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
};
