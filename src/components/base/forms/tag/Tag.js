import PropTypes from "prop-types";

import { cyKey } from "@/utils/trim";

import Skeleton from "@/components/base/skeleton";
import Icon from "@/components/base/icon";

import styles from "./Tag.module.css";
import Translate from "../../translate";
import cx from "classnames";

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
function Tag({
  children = "im a tag",
  className = "",
  selected = false,
  onClick = null,
  disabled = false,
  opaqueText = false,
  skeleton = false,
  tag = "button",
  dataCy = "",
}) {
  const context = { context: "form" };
  const Tag = tag;
  const key = cyKey({ name: children, prefix: "tag" });

  return (
    <Tag
      data-cy={dataCy || key}
      className={cx(styles.tag, className, {
        [styles.selected]: selected,
        [styles.disabled]: disabled,
        [styles.opaque]: opaqueText,
      })}
      onClick={onClick}
    >
      {children}
      <Icon
        size={{ w: 3, h: 3 }}
        bgColor="var(--blue)"
        src={"checkmark.svg"}
        skeleton={skeleton}
        alt={Translate({
          ...context,
          label: selected ? "icon-label-selected" : "icon-label-not-selected",
        })}
        data-cy={`icon-${children}`}
      />
    </Tag>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {Object}props
 *  See propTypes for specific props and types
 *
 * @returns {JSX.Element}
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
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Container(props) {
  if (props.skeleton) {
    return <TagSkeleton {...props} />;
  }

  return <Tag {...props} />;
}

// PropTypes for Button component
Container.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  opaqueText: PropTypes.bool, // Use for disabled but opaque text
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
  tag: PropTypes.string,
};
