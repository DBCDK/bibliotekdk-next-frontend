import PropTypes from "prop-types";

import { cyKey } from "@/utils/trim";

import Skeleton from "@/components/base/skeleton";

import styles from "./Button.module.css";
import cx from "classnames";

function handleOnButtonClick() {
  alert("Button clicked!");
}

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
function Button({
  children = "im a button",
  id = null,
  className = "",
  type = "primary",
  size = "large",
  onClick = null,
  disabled = false,
  tabIndex = "0",
  dataCy = null,
  ariaExpanded = null,
  ariaControls = null,
  ariaLabel = null,
  asLink = false,
  target = "_blank",
  href = "",
}) {
  const key = dataCy || cyKey({ name: children, prefix: "button" });
  // should button act as a link ? or a button ?
  const Tag = asLink ? "a" : "button";
  const onClickFunction = () =>
    onClick ? onClick() : !asLink ? handleOnButtonClick() : null;
  return (
    <Tag
      href={href}
      target={target}
      id={id}
      data-cy={key}
      className={cx([
        className,
        styles.button,
        asLink && styles.asLink,
        {
          [styles.large]: size === "large",
          [styles.medium]: size === "medium",
          [styles.small]: size === "small",
          [styles.primary]: type === "primary",
          [styles.secondary]: type === "secondary",
          [styles.disabled]: disabled,
        },
      ])}
      onClick={onClickFunction}
      aria-disabled={disabled}
      disabled={disabled}
      tabIndex={tabIndex}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-label={ariaLabel}
    >
      {children}
    </Tag>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {Object} props
 *  See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
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
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Container(props) {
  if (props.skeleton) {
    return <ButtonSkeleton {...props} />;
  }

  return <Button {...props} />;
}

// PropTypes for component
Container.propTypes = {
  children: PropTypes.any,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.oneOf(["primary", "secondary"]),
  size: PropTypes.oneOf(["large", "medium", "small"]),
  disabled: PropTypes.bool,
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
  ariaExpanded: PropTypes.bool,
  ariaControls: PropTypes.string,
  asLink: PropTypes.bool,
  href: PropTypes.string,
};

Button.propTypes = Container.propTypes;
