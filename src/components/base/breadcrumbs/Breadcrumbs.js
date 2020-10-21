import PropTypes from "prop-types";

import { cyKey } from "../../../utils/trim";

import Skeleton from "../skeleton";
import Link from "../link";
import Text from "../text";

import styles from "./Breadcrumbs.module.css";

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
  children = "Crumb",
  href = { pathname: "/", query: {} },
  separator = true,
  className = "",
  disabled = false,
}) {
  const disabledStyle = disabled ? styles.disabled : "";
  const key = cyKey({ name: children, prefix: "crumb" });

  return (
    <div
      className={`${styles.breadcrumb} ${className} ${disabledStyle}`}
      data-cy={key}
    >
      <Link href={href} className={`${styles.link}`}>
        <Text tag="span" type="text3">
          {children}
        </Text>
      </Link>
      {separator && <Separator />}
    </div>
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
      <Breadcrumb
        {...props}
        className={`${props.className || ""} ${styles.skeleton}`}
        separator={false}
        onClick={null}
        disabled={true}
      >
        <Skeleton />
        {"Crumb"}
      </Breadcrumb>
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

  return (
    <div className={styles.breadcrumbs}>
      {path.map((c, i) => {
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
      })}
    </div>
  );
}

// PropTypes for component
Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  skeleton: PropTypes.bool,
  crumbs: PropTypes.number, // For skeleton use only
  href: PropTypes.string,
};
