import PropTypes from "prop-types";

import Skeleton from "@/components/base/skeleton";

import styles from "./Icon.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Icon({
  src = "../",
  className = "",
  children = null,
  bgColor = null,
  size = 5,
  onClick = null,
  onKeyDown,
  disabled = false,
  tabIndex,
  ...props
}) {
  const disabledStyle = disabled ? styles.disabled : "";
  const shapeStyle = bgColor ? styles.round : "";

  // Set icon size
  const dimensions = {
    height: `var(--pt${size})`,
    width: bgColor ? `var(--pt${size})` : `auto`,
  };

  const backgroundColor = {
    backgroundColor: bgColor ? bgColor : "transparent",
  };

  const dynamicStyles = {
    ...dimensions,
    ...backgroundColor,
  };

  return (
    <i
      style={dynamicStyles}
      className={`${styles.icon} ${className} ${shapeStyle} ${disabledStyle}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      aria-hidden="true"
      tabIndex={tabIndex}
      data-cy={props["data-cy"]}
    >
      {children || <img src={`/icons/${src}`} />}
    </i>
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
 * @returns {component}
 */
export default function Container(props) {
  if (props.skeleton) {
    return <IconSkeleton {...props} />;
  }

  return <Icon {...props} />;
}

// PropTypes for Button component
Container.propTypes = {
  src: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.number,
  ]),
  bgColor: PropTypes.string,
  size: PropTypes.oneOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15]),
  disabled: PropTypes.bool,
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
  "data-cy": PropTypes.string,
};
