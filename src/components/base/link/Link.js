import PropTypes from "prop-types";
import { default as NextLink } from "next/link";

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
  href = "/",
  as = null,
}) {
  return (
    <NextLink href={href === "/" ? "/" : "/[...all]"} as={as ? as : href}>
      {children}
    </NextLink>
  );
}

// PropTypes for component
Link.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  href: PropTypes.string,
  title: PropTypes.string,
  as: PropTypes.string,
  disabled: PropTypes.bool,
};
