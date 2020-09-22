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
  src = null,
  className = "",
  bgColor = null,
  size = ["100%", "auto"],
  onClick = null,
}) {
  // If src is an array of cover images, select the first valid in line
  if (src instanceof Array) {
    src = src.map((t) => t.cover && t.cover.detail).filter((c) => c)[0];
  }

  const frameStyle = bgColor ? styles.frame : "";

  // Set icon size
  const dimensions = {
    width: `${size[0]}`,
    height: `${size[1]}`,
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
      className={`${styles.cover} ${frameStyle} ${className}`}
      onClick={onClick}
    >
      <img src={src} />
      {children}
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
    <Cover
      {...props}
      className={`${props.className} ${styles.skeleton}`}
      size={["200px", "300px"]}
      onClick={null}
      src={null}
      bgColor={null}
    >
      <Skeleton />
      {props.children}
    </Cover>
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
    return <CoverSkeleton {...props} />;
  }

  return <Cover {...props} />;
}

// PropTypes for the Component
Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  bgColor: PropTypes.string,
  size: PropTypes.array,
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
};
