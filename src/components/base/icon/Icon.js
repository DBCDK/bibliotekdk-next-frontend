import PropTypes from "prop-types";

import Skeleton from "@/components/base/skeleton";

import styles from "./Icon.module.css";

/**
 * The Component function
 *
 * @param alt
 * @param src
 * @param className
 * @param children
 * @param bgColor
 * @param size
 * @param onClick
 * @param onKeyDown
 * @param disabled
 * @param tabIndex
 * @param dataCy
 * @param ariaHidden
 * @param tag
 * @param style
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Icon({
  alt = "",
  src = "../",
  className = "",
  children = null,
  bgColor = null,
  size = 5,
  onClick = null,
  onKeyDown = null,
  disabled = false,
  tabIndex = null,
  dataCy = null,
  ariaHidden = true,
  tag = "i",
  style = {},
  ...props
}) {
  const disabledStyle = disabled ? styles.disabled : "";
  const shapeStyle = bgColor ? styles.round : "";

  const Tag = tag;

  // Scale according to W or H
  const hasAuto = !!(size.h === "auto" || size.w === "auto");
  const scaleStyle = hasAuto && size.w === "auto" ? styles.autoW : styles.autoH;

  // Set scale sizes
  const height = size.h === "auto" ? size.h : `var(--pt${size.h || size})`;
  const width = size.w === "auto" ? size.w : `var(--pt${size.w || size})`;

  // Set icon size
  const dimensions = {
    width,
    minWidth: width,
    maxWidth: width,
    height,
    minHeight: height,
    maxHeight: height,
  };

  const backgroundColor = {
    backgroundColor: bgColor ? bgColor : "transparent",
  };

  const dynamicStyles = {
    ...dimensions,
    ...backgroundColor,
    ...style,
  };

  return (
    <Tag
      style={dynamicStyles}
      className={`${styles.icon} ${className} ${shapeStyle} ${disabledStyle} ${scaleStyle}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-hidden={ariaHidden}
      tabIndex={tabIndex}
      data-cy={props["data-cy"] || dataCy || ""}
    >
      {children || <img src={`/icons/${src}`} alt={alt} />}
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
function IconSkeleton(props) {
  return (
    <Icon
      {...props}
      className={`${props.className} ${styles.skeleton}`}
      onClick={null}
      disabled={true}
    >
      <Skeleton />
      <Icon {...props} bgColor={null} />
    </Icon>
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Container(props) {
  if (props.skeleton) {
    return <IconSkeleton {...props} />;
  }

  return <Icon {...props} />;
}

// PropTypes for Button component
Container.propTypes = {
  alt: PropTypes.string,
  src: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
  ]),
  bgColor: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
  ]),
  disabled: PropTypes.bool,
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  "data-cy": PropTypes.string,
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tag: PropTypes.oneOf(["i", "button"]),
};
