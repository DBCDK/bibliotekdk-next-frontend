import PropTypes from "prop-types";

import { cyKey } from "@/utils/trim";

import Skeleton from "@/components/base/skeleton";
import Link from "@/components/base/link";
import Text from "@/components/base/text";

import styles from "./Breadcrumbs.module.css";
import React from "react";

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
  link = true,
}) {
  const disabledStyle = disabled ? styles.disabled : "";
  const key = cyKey({ name: children, prefix: "crumb" });
  return (
    <div
      className={`${styles.breadcrumb} ${className} ${disabledStyle}`}
      data-cy={key}
    >
      {link ? (
        <Link href={href} className={`${styles.link}`}>
          <Text tag="span" type="text3">
            {children}
          </Text>
        </Link>
      ) : (
        <Text tag="span" type="text3">
          {children}
        </Text>
      )}

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
  let { path, crumbs = 5, skeleton, seperatorTail = false } = props;

  if (crumbs && skeleton) {
    path = Array.from(Array(Number(crumbs)).keys());
  }

  if (!path) {
    path = ["This", "is", "Some", "Relative", "Path"];
  }

  return (
    <div className={styles.breadcrumbs}>
      {path.map((c, i) => {
        const separator = seperatorTail || path.length > i + 1;

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
  link: PropTypes.bool,
};
