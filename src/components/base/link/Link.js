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
  border = true,
  className = "",
}) {
  // no wrap - no border
  if (!a) {
    border = false;
  }

  // Maybe wrap with an a-tag
  if (a) {
    const animationClass = border ? styles.border : "";

    children = (
      <a
        href={href.pathname || href}
        target={target}
        className={`${styles.link} ${animationClass} ${className}`}
      >
        {children}
        {border && <AnimationLine keepVisible />}
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
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  target: PropTypes.oneOf(["_blank", "_self", "_parent", "_top"]),
  a: PropTypes.bool,
  border: PropTypes.bool,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  href: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    query: PropTypes.object,
  }),
};
