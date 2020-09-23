import PropTypes from "prop-types";
import { default as NextLink } from "next/link";

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
  href: PropTypes.string,
  as: PropTypes.string,
};
