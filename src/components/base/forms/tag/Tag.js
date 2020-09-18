import PropTypes from "prop-types";

import Skeleton from "../../skeleton";
import Icon from "../../icon";

import styles from "./Tag.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Tag({
  children = "im a button",
  className = "",
  selected = false,
  onClick = null,
  disabled = false,
}) {
  const disabledStyle = disabled ? styles.disabled : "";
  const selectedStyle = selected ? styles.selected : "";

  return (
    <button
      className={`${styles.tag} ${className} ${selectedStyle} ${disabledStyle}`}
      onClick={onClick}
    >
      {children}
      <Icon size={3} bgColor="var(--blue)" src={"checkmark.svg"} />
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
function TagSkeleton(props) {
  return (
    <Skeleton>
      <Tag {...props} onClick={null} disabled={true} />
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
    return <TagSkeleton {...props} />;
  }

  return <Tag {...props} />;
}

// PropTypes for Button component
Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
};
