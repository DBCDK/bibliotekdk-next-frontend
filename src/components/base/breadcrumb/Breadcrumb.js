import PropTypes from "prop-types";

import Skeleton from "../skeleton";
import Link from "../link";

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
      <React.Fragment>
        <span className={`${styles.breadcrumb} ${className} ${disabledStyle}`}>
          {children}
        </span>
        {separator && <Separator />}
      </React.Fragment>
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
    <Skeleton>
      <Breadcrumb {...props} onClick={null} disabled={true} />
    </Skeleton>
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
  if (props.skeleton) {
    return <BreadcrumbSkeleton {...props} />;
  }

  return <Breadcrumb {...props} />;
}

// PropTypes for component
Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

  disabled: PropTypes.bool,
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
};
