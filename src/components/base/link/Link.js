import PropTypes from "prop-types";
import { default as NextLink } from "next/link";

import styles from "./Link.module.css";
import animations from "@/components/base/animation/animations.module.css";

function parseBorderPositioning(border) {
  return [
    `top:${Boolean(border?.top)}`,
    `bottom:${Boolean(border?.bottom)}`,
  ].join(",");
}
function parseBorderKeepVisible(border) {
  return [
    `top:${Boolean(border?.top?.keepVisible)}`,
    `bottom:${Boolean(border?.bottom?.keepVisible)}`,
  ].join(",");
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Link({
  children = "Im a hyperlink now!",
  a = true,
  tag = "a",
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
  disabled = false,
  ariaLabel = "",
  scroll = true,
  data_display = "inline-block",
  data_underline_animation_disabled = false,
}) {
  const Tag = tag;
  // Maybe wrap with an a-tag
  if (a) {
    const underline_data_attributes = {
      "data-underline-position": parseBorderPositioning(border),
      "data-underline-keep-visible": parseBorderKeepVisible(border),
      "data-underline-link-disabled": disabled,
      "data-underline-animation-disabled": data_underline_animation_disabled,
    };

    const animationClass = !!border ? styles.border : "";

    children = (
      <Tag
        ref={linkRef}
        data-cy={dataCy}
        target={target}
        onClick={(e) => {
          if (onClick) {
            if (!href) {
              e.preventDefault();
            }
            onClick(e);
          }
        }}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        className={`${animations.underlineContainer} ${animationClass} ${className}`}
        tabIndex={disabled ? "-1" : tabIndex}
        aria-label={ariaLabel}
        data-display={data_display}
        {...underline_data_attributes}
      >
        {children}
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

// PropTypes for component
Link.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  target: PropTypes.oneOf(["_blank", "_self", "_parent", "_top"]),
  a: PropTypes.bool,
  dataCy: PropTypes.string,
  border: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      bottom: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
          bottom: PropTypes.bool,
        }),
      ]),
      top: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
          bottom: PropTypes.bool,
        }),
      ]),
    }),
  ]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  href: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      query: PropTypes.object,
    }),
    PropTypes.object,
  ]),
  tabIndex: PropTypes.string,
  tag: PropTypes.oneOf(["a", "span"]),
  disabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
};
