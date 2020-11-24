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
  href = { pathname: "/", query: {} },
  target = "_self",
  border = { top: false, bottom: true },
  onFocus = null,
  dataCy = "link",
  className = "",
}) {
  // no wrap - no border
  if (!a) {
    border = false;
  }

  // Maybe wrap with an a-tag
  if (a) {
    const animationClass = !!border ? styles.border : "";

    children = (
      <a
        href={href.pathname || href}
        data-cy={dataCy}
        target={target}
        onFocus={onFocus}
        className={`${styles.link} ${animationClass} ${className}`}
      >
        {border.top && (
          <AnimationLine keepVisible={border.top && border.top.keepVisible} />
        )}
        {children}
        {border.bottom && (
          <AnimationLine
            keepVisible={border.bottom && border.bottom.keepVisible}
          />
        )}
      </a>
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
  ]),
};
