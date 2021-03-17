import PropTypes from "prop-types";

import Skeleton from "@/components/base/skeleton";

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

  // Add class for misisng cover image
  const missingCoverClass = src ? "" : styles.missingCover;

  const frameStyle = bgColor ? styles.frame : "";

  // Set icon size
  const dimensions = {
    width: `${size[0]}`,
    // If no img/src is found, set height relative to width
    height: `${src ? size[1] : size[0].match(/\d+/) * 1.5}px`,
  };

  const backgroundColor = {
    backgroundColor: bgColor ? bgColor : src ? "transparent" : "var(--iron)",
  };

  const dynamicStyles = {
    ...dimensions,
    ...backgroundColor,
  };

  return (
    <div
      style={dynamicStyles}
      className={`${styles.cover} ${frameStyle} ${missingCoverClass} ${className}`}
      onClick={onClick}
    >
      {src && (
        <img
          alt=""
          style={dimensions}
          data-src={src}
          data-bg={src}
          className="lazyload"
        />
      )}
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
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  bgColor: PropTypes.string,
  size: PropTypes.array,
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
};
