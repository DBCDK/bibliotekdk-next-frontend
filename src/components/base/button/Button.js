import PropTypes from "prop-types";

import Skeleton from "../skeleton";

import styles from "./Button.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Button({
  children = "im a button",
  className = "",
  type = "primary",
  size = "large",
  onClick = null,
  disabled = false,
}) {
  const disabledStyle = disabled ? styles.disabled : "";

  return (
    <button
      className={`${styles.button} ${className} ${styles[size]} ${styles[type]} ${disabledStyle}`}
      onClick={onClick}
    >
      {children}
    </button>
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
function ButtonSkeleton(props) {
  return (
    <Button
      {...props}
      className={`${props.className} ${styles.skeleton}`}
      onClick={null}
      disabled={true}
    >
      <Skeleton />
      {props.children}
    </Button>
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
    return <ButtonSkeleton {...props} />;
  }

  return <Button {...props} />;
}

// PropTypes for component
Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.oneOf(["primary", "secondary"]),
  size: PropTypes.oneOf(["large", "medium", "small"]),
  disabled: PropTypes.bool,
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
};
