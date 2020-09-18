import PropTypes from "prop-types";

import Skeleton from "../skeleton";
import Link from "../link";
import Text from "../text";

import styles from "./Breadcrumb.module.css";

function Separator() {
  return <span className={styles.separator}>/</span>;
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
      <Text className={styles.wrap} type="text3">
        <span className={`${styles.breadcrumb} ${className} ${disabledStyle}`}>
          {children}
        </span>
        {separator && <Separator />}
      </Text>
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
