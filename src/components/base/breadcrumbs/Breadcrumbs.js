import PropTypes from "prop-types";

import Skeleton from "../skeleton";
import Link from "../link";
import Text from "../text";

import styles from "./Breadcrumb.module.css";

function Separator() {
  return (
    <Text type="text3" tag="span" className={styles.separator}>
      /
    </Text>
  );
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Breadcrumb({
  children = "Breadcrumb",
  href = "/",
  separator = true,
  className = "",
  disabled = false,
}) {
  const disabledStyle = disabled ? styles.disabled : "";

  return (
    <Link href={href}>
      <span>
        <Text
          tag="span"
          className={`${styles.breadcrumb} ${className} ${disabledStyle}`}
          type="text3"
        >
          {children}
        </Text>
        {separator && <Separator />}
      </span>
    </Link>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {component}
 */
function BreadcrumbSkeleton(props) {
  // className={`${props.className} ${styles.skeleton}`}

  return (
    <React.Fragment>
      <Skeleton>
        <Breadcrumb {...props} separator={false} onClick={null} disabled={true}>
          Crumb
        </Breadcrumb>
      </Skeleton>
      {props.separator && <Separator />}
    </React.Fragment>
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Container(props) {
  let { path, crumbs, skeleton } = props;

  if (crumbs && skeleton) {
    path = Array.from(Array(Number(crumbs)).keys());
  }

  return path.map((c, i) => {
    const separator = path.length > i + 1;

    if (skeleton) {
      return (
        <BreadcrumbSkeleton
          key={`crumb-${i}`}
          {...props}
          separator={separator}
        />
      );
    }

    return (
      <Breadcrumb {...props} key={c} separator={separator}>
        {c}
      </Breadcrumb>
    );
  });
}

// PropTypes for component
Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  crumbs: PropTypes.number,
  skeleton: PropTypes.bool,
  href: PropTypes.string,
};
