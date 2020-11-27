import PropTypes from "prop-types";

import { cyKey } from "@/utils/trim";

import Skeleton from "@/components/base/skeleton";
import Icon from "@/components/base/icon";

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
  children = "im a tag",
  className = "",
  selected = false,
  onClick = null,
  disabled = false,
  skeleton = false,
}) {
  const key = cyKey({ name: children, prefix: "tag" });
  const disabledStyle = disabled ? styles.disabled : "";
  const selectedStyle = selected ? styles.selected : "";

  return (
    <button
      data-cy={key}
      className={`${styles.tag} ${className} ${selectedStyle} ${disabledStyle}`}
      onClick={onClick}
    >
      {children}
      <Icon
        size={{ w: 3, h: 3 }}
        bgColor="var(--blue)"
        src={"checkmark.svg"}
        skeleton={skeleton}
      />
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
    <Tag
      {...props}
      className={`${props.className} ${styles.skeleton}`}
      onClick={null}
      disabled={true}
      selected={false}
    >
      <Skeleton />
      {props.children}
    </Tag>
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
