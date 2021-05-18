import PropTypes from "prop-types";
import { default as NextLink } from "next/link";

import AnimationLine from "@/components/base/animation/line";

import styles from "./Link.module.css";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Link({
  children = "Im a hyperlink now!",
  a = true,
  linkRef = null,
  href = { pathname: "/", query: {} },
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
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick(e);
          }
        }}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        className={`${styles.link} ${animationClass} ${disabledClass} ${className}`}
        tabIndex={disabled ? "-1" : tabIndex}
      >
        {border.top && <AnimationLine keepVisible={!!border.top.keepVisible} />}
        {children}
        {border.bottom && (
          <AnimationLine keepVisible={!!border.bottom.keepVisible} />
        )}
      </Tag>
    );
  }

  // Return the component
  return (
    <NextLink href={href} shallow={true}>
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
};
