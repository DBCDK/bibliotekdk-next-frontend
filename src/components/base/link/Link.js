import PropTypes from "prop-types";
import { default as NextLink } from "next/link";
import styles from "./Link.module.css";
import animations from "css/animations";
import cx from "classnames";
import React, { useEffect, useState } from "react";
import Skeleton from "@/components/base/skeleton";

/**
 * Used when the link is given both an onClick and href.
 *  If href is given, we don't preventDefault on click (for use of side-effects)
 *
 * @param {function} onClick
 * @param {string|Object} href
 * @param {Object} e
 */
function onClickWrapper(onClick, href, e) {
  if (onClick) {
    if (!href) {
      e.preventDefault();
    }
    onClick(e);
  }
}

/**
 * Get computed display type of the element, if there is a ref
 *
 * @param {Object} window
 * @param {Object} element
 * @returns {false|*}
 */
function getDisplayType(window, element) {
  return (
    typeof window !== "undefined" &&
    window?.getComputedStyle(element).getPropertyValue("display")
  );
}

/**
 * @typedef {("INFER"|"BLOCK"|"MULTILINE")} UnderlineType
 */

/**
 * @type {Readonly<{INFER: string, BLOCK: string, MULTILINE: string}>}
 */
const UnderlineTypeEnum = Object.freeze({
  BLOCK: "BLOCK",
  MULTILINE: "MULTILINE",
  INFER: "INFER",
});

/**
 * Recurse through all children and apply function on each child if it is a valid element (e.g. not a string, undefined, etc.)
 *
 * @param {Object|Array|string|React.ReactElement} children
 * @param {function} cloneFunction
 * @returns {Array<Exclude<unknown, boolean | null | undefined>>}
 */
function recursiveChildrenMap(children, cloneFunction) {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) {
      return child;
    }

    if (child.props.children) {
      child = React.cloneElement(child, {
        children: recursiveChildrenMap(child.props.children, cloneFunction),
      });
    }

    return cloneFunction(child);
  });
}

/**
 * inferLinkDisplay infers what display type link should have depending on type of {@link forceUnderlineType}
 *  and display of children
 *
 * @param {UnderlineType} forceUnderlineType
 * @param {string} linkDisplay
 * @param {Array.<string>} childrenDisplay
 * @returns {string}
 */
function inferLinkDisplay(forceUnderlineType, linkDisplay, childrenDisplay) {
  const summatedChildrenDisplay =
    childrenDisplay?.length > 1
      ? childrenDisplay
          .slice(1)
          .reduce(
            (prev, curr) => (curr !== "inline" ? curr : prev),
            childrenDisplay[0]
          )
      : childrenDisplay?.[0];

  if (forceUnderlineType === UnderlineTypeEnum.BLOCK) {
    return !linkDisplay || ["inline", "contents"].includes(linkDisplay)
      ? summatedChildrenDisplay &&
        !["inline", "contents"].includes(summatedChildrenDisplay)
        ? summatedChildrenDisplay
        : "block"
      : linkDisplay;
  } else if (forceUnderlineType === UnderlineTypeEnum.MULTILINE) {
    return "inline";
  } else if (forceUnderlineType === UnderlineTypeEnum.INFER) {
    return linkDisplay !== "inline" ? linkDisplay : summatedChildrenDisplay;
  }
}

let inferredLinkDisplay;

/**
 * The Component function
 *
 * @param {Object|array|string|React.ReactElement} children
 * @param {boolean} a
 * @param linkRef
 * @param {string|Object} href
 * @param {string} target
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
 * @param {UnderlineType} forceUnderlineType
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
function Link({
  children = "Im a hyperlink now!",
  a = true,
  linkRef = null,
  href,
  target = "_self",
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
  forceUnderlineType = "INFER",
  ...props
}) {
  const Tag = tag;
  const [linkDisplay, setLinkDisplay] = useState(null);
  const [childrenDisplay, setChildrenDisplay] = useState(null);

  useEffect(() => {
    if (linkRef && linkRef?.current) {
      setLinkDisplay(getDisplayType(window, linkRef?.current));
      let tempChildrenDisplay = [];
      linkRef.current.childNodes?.forEach((node) => {
        tempChildrenDisplay.push(getDisplayType(window, node));
        // setChildrenDisplay(getDisplayType(window, node));
      });
      setChildrenDisplay(tempChildrenDisplay);
    }
  }, [linkRef, linkRef?.current]);

  inferredLinkDisplay = inferLinkDisplay(
    forceUnderlineType,
    linkDisplay,
    childrenDisplay
  );

  // Maybe wrap with an a-tag
  if (a) {
    children = (
      <Tag
        ref={linkRef}
        data-cy={dataCy}
        target={target}
        onClick={(e) => onClickWrapper(onClick, href, e)}
        onKeyDown={(e) => {
          onKeyDown
            ? onKeyDown(e)
            : e?.key === "Enter"
            ? onClickWrapper(onClick, href, e)
            : (() => {})();
        }}
        onFocus={onFocus}
        className={className}
        tabIndex={disabled ? "-1" : tabIndex}
        disabled={disabled}
        aria-label={ariaLabel}
        {...props}
        style={{
          ...props.style,
          ...(inferredLinkDisplay && {
            display: inferredLinkDisplay,
          }),
          textDecoration: "none",
        }}
      >
        {forceUnderlineType === "MULTILINE"
          ? recursiveChildrenMap(children, (child) =>
              React.cloneElement(child, {
                className: cx(child.props.className, styles.force_inline),
              })
            )
          : children}
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

/**
 * @typedef {(boolean|{keepVisible:boolean}|undefined)} BorderLike
 */

/**
 * Wrapper for using new underline that allows line wrap
 *   HOW TO USE {@link forceUnderlineType}:
 *   - "INFER": Default. Uses multiline if link and children is inline, otherwise block underline
 *   - - To "INFER" MULTILINE: The link element (default display is inline) and their children must be inline-elements
 *   - - To "INFER" BLOCK: The link and/or children is a not display inline :-)
 *   - "MULTILINE": The link element is forced to inline and all children are forced to inline
 *   - "BLOCK": The link element will be forced to become block or childrens display if it is neither inline nor contents
 *
 * @param {string} className
 * @param {boolean} disabled
 * @param {{ top: BorderLike, bottom: BorderLike }} border
 * @param {boolean} data_use_new_underline
 * @param {UnderlineType} forceUnderlineType
 * @param {boolean} data_underline_animation_disabled
 * @param props
 * @returns {React.JSX.Element}
 */
export default function Wrap({
  className = "",
  disabled = false,
  border = { top: false, bottom: true },
  forceUnderlineType = "INFER",
  data_underline_animation_disabled = false,
  ...props
}) {
  console.log("wrap log", props);
  console.log("wrap.ref log", props.border);

  return (
    <Link
      className={cx(
        animations.underlineContainer,
        {
          [animations.top_line_false]: !Boolean(border?.top),
          [animations.top_line_keep_false]: !Boolean(border?.top?.keepVisible),
          [animations.bottom_line_false]: !Boolean(border?.bottom),
          [animations.bottom_line_keep_false]: !Boolean(
            border?.bottom?.keepVisible
          ),
          [animations.link_disabled]: disabled,
          [animations.animation_disabled]: data_underline_animation_disabled,
        },
        className
      )}
      disabled={disabled}
      forceUnderlineType={forceUnderlineType}
      {...props}
    >
      {props.children}
    </Link>
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
Wrap.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.element,
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
  forceUnderlineType: PropTypes.oneOf(["INFER", "MULTILINE", "BLOCK"]),
};

export function LinkOnlyInternalAnimations({
  dataCy,
  className,
  href = null,
  onClick = () => {},
  target = "_self",
  border = { top: false, bottom: false },
  children,
  disabled = false,
  skeleton = false,
  lines = 1,
}) {
  border = disabled ? { top: false, bottom: false } : border;

  if (skeleton) {
    return (
      <LinkSkeleton dataCy={dataCy} className={className} lines={lines}>
        {children}
      </LinkSkeleton>
    );
  }

  return (
    <Link
      dataCy={dataCy}
      className={cx(className, {
        [animations.underlineContainer__only_internal_animations]: !disabled,
      })}
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

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {Object} props
 *  See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
function LinkSkeleton(props) {
  return (
    <Link {...props} href={null} target={null} onClick={null} disabled={true}>
      <Skeleton className={styles.skeleton} lines={props.lines}>
        {props.children}
      </Skeleton>
    </Link>
  );
}
