import PropTypes from "prop-types";
import { default as NextLink } from "next/link";

import AnimationLine from "@/components/base/animation/line";

import styles from "./Link.module.css";
import animations from "css/animations";
import cx from "classnames";

function parseBorders(border) {
  return [
    ...(!Boolean(border?.top) ? [animations.top_line_false] : []),
    ...(!Boolean(border?.top?.keepVisible)
      ? [animations.top_line_keep_false]
      : []),
    ...(!Boolean(border?.bottom) ? [animations.bottom_line_false] : []),
    ...(!Boolean(border?.bottom?.keepVisible)
      ? [animations.bottom_line_keep_false]
      : []),
  ];
}

function onClickWrapper(onClick, href, e) {
  if (onClick) {
    if (!href) {
      e.preventDefault();
    }
    onClick(e);
  }
}

/**
 * The Component function
 *
 * @param {object|array|string} children
 * @param {boolean} a
 * @param linkRef
 * @param {string|object} href
 * @param {string} target
 * @param {object} border
 * @param {function} onClick
 * @param {function} onKeyDown
 * @param {function} onFocus
 * @param {string} dataCy
 * @param {string} className
 * @param {string|number} tabIndex
 * @param {string} tag
 * @param {boolean} disabled
 * @param {string} ariaLabel
 * @param {boolean} scroll
 * @param {boolean} data_use_new_underline
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Link({
  children = "Im a hyperlink now!",
  a = true,
  linkRef = null,
  href,
  target = "_self",
  border = { top: false, bottom: true },
  onClick = null,
  onKeyDown = null,
  onFocus = null,
  dataCy = "link",
  className = "",
  tabIndex = "0",
  tag = "a",
  disabled = false,
  ariaLabel = "",
  scroll = true,
  data_use_new_underline = false,
  ...props
}) {
  const Tag = tag;
  // Maybe wrap with an a-tag
  if (a) {
    const animationClass = !!border ? styles.border : "";

    const disabledClass = disabled ? styles.disabled : "";

    children = (
      <Tag
        ref={linkRef}
        data-cy={dataCy}
        target={target}
        onClick={(e) => onClickWrapper(onClick, href, e)}
        onKeyDown={(e) => {
          onKeyDown
            ? onKeyDown(e)
            : e?.key === "Enter" || e?.key === " "
            ? onClickWrapper(onClick, href, e)
            : (() => {})();
        }}
        onFocus={onFocus}
        className={
          data_use_new_underline
            ? className
            : `${styles.link} ${animationClass} ${disabledClass} ${className}`
        }
        tabIndex={disabled ? "-1" : tabIndex}
        aria-label={ariaLabel}
        {...props}
      >
        {border.top && <AnimationLine keepVisible={!!border.top.keepVisible} />}
        {children}
        {border.bottom && (
          <AnimationLine keepVisible={!!border.bottom.keepVisible} />
        )}
      </Tag>
    );
  }

  if (!href) {
    return children;
  }

  // Return the component
  return (
    <NextLink href={href} shallow={true} scroll={scroll}>
      {children}
    </NextLink>
  );
}

export const PropType_Link_border = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.shape({
    bottom: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        keepVisible: PropTypes.bool,
      }),
    ]),
    top: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        keepVisible: PropTypes.bool,
      }),
    ]),
  }),
]);

export const PropType_Link_href = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    query: PropTypes.object,
  }),
  PropTypes.object,
]);

// PropTypes for component
Link.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  a: PropTypes.bool,
  href: PropType_Link_href,
  target: PropTypes.oneOf(["_blank", "_self", "_parent", "_top"]),
  border: PropType_Link_border,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  onFocus: PropTypes.func,
  dataCy: PropTypes.string,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  tabIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tag: PropTypes.string, // support any tag
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  scroll: PropTypes.bool,
  data_use_new_underline: PropTypes.bool,
};

/**
 * Wrapper for using new underline that allows line wrap
 *   HOW TO USE:
 *   - MULTILINE: The link element (default display is inline) and their children must be inline-elements
 *   - BLOCK ELEMENT: The link and/or children is a block (or even inline-block) :-)
 * @param className
 * @param disabled
 * @param border
 * @param data_use_new_underline
 * @param data_underline_animation_disabled
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export default function Wrap({
  className = "",
  disabled = false,
  border = { top: false, bottom: true },
  data_use_new_underline = true,
  data_underline_animation_disabled = false,
  ...props
}) {
  let newBorder = border;
  let newClassName = className;

  const underline_data_exception_classes = [
    ...parseBorders(border),
    ...(disabled ? [animations.link_disabled] : []),
    ...(data_underline_animation_disabled
      ? [animations.animation_disabled]
      : []),
  ].join(" ");

  if (data_use_new_underline === true) {
    newBorder = { top: false, bottom: false };

    newClassName = [
      animations.underlineContainer,
      underline_data_exception_classes,
      className,
    ].join(" ");
  }

  return (
    <Link
      border={newBorder}
      className={newClassName}
      disabled={disabled}
      data_use_new_underline={data_use_new_underline}
      {...props}
    >
      {props.children}
    </Link>
  );
}

export function LinkOnlyInternalAnimations({
  dataCy,
  className,
  href = null,
  onClick = () => {},
  target = "_self",
  border = { top: false, bottom: false },
  children,
  disabled = false,
}) {
  border = disabled ? { top: false, bottom: false } : border;

  return (
    <Link
      dataCy={dataCy}
      className={cx(
        animations.underlineContainer__only_internal_animations,
        className
      )}
      href={href}
      onClick={onClick}
      target={target}
      border={border}
      disabled={disabled}
    >
      {children}
    </Link>
  );
}
