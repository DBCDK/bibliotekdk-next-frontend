import PropTypes from "prop-types";

import { cyKey } from "@/utils/trim";

import Skeleton from "@/components/base/skeleton";

import styles from "./Button.module.css";

function handleOnButtonClick() {
  alert("Button clicked!");
}

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
  tabIndex = null,
}) {
  const disabledStyle = disabled ? styles.disabled : "";
  const key = cyKey({ name: children, prefix: "button" });

  return (
    <button
      data-cy={key}
      className={`${styles.button} ${className} ${styles[size]} ${styles[type]} ${disabledStyle}`}
      onClick={(e) => (onClick ? onClick(e) : handleOnButtonClick(e))}
      disabled={disabled}
      tabIndex={tabIndex}
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
