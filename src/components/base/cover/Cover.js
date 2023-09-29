import PropTypes from "prop-types";

import Skeleton from "@/components/base/skeleton";

import styles from "./Cover.module.css";
import { useEffect, useRef, useState } from "react";
import cx from "classnames";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
function Cover({
  children = null,
  src = null,
  className = "",
  bgColor = null,
  size = "large",
  onClick = null,
  skeleton,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imageRef = useRef();

  // If src is an array of cover images, select the first valid in line
  if (src instanceof Array) {
    src = src.map((t) => t.cover && t.cover.detail).filter((c) => c)[0];
  }

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  // Add class for missing cover image
  const loadedClass = loaded ? styles.loaded : "";

  const skeletonClass = skeleton || (!loaded && src) ? styles.skeleton : "";

  const frameStyle = bgColor ? styles.frame : "";

  const backgroundColor = {
    backgroundColor: bgColor ? bgColor : src ? "transparent" : "var(--iron)",
  };

  const dynamicStyles = {
    ...backgroundColor,
  };

  return (
    <div
      style={dynamicStyles}
      className={cx(
        styles.cover,
        frameStyle,
        loadedClass,
        skeletonClass,
        className,
        {
          [styles.large]: size === "large",
          [styles.medium]: size === "medium",
          [styles.thumbnail]: size === "thumbnail",
          [styles.fill]: size === "fill",
          [styles["fill-width"]]: size === "fill-width",
        }
      )}
      onClick={onClick}
      data-cy={src ? "cover-present" : "missing-cover"}
    >
      {skeletonClass && <Skeleton />}
      {src && !error && (
        <img
          ref={imageRef}
          alt=""
          data-src={src}
          data-bg={src}
          className="lazyload"
          onLoad={() => {
            setLoaded(true);
          }}
          onError={() => {
            setLoaded(true);
            setError(true);
          }}
        />
      )}
      {((!skeleton && !src) || error) && <div className={styles.fallback} />}
      {children}
    </div>
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
  return <Cover {...props} />;
}

// PropTypes for the Component
Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  bgColor: PropTypes.string,
  size: PropTypes.oneOf(["thumbnail", "medium", "large", "fill", "fill-width"]),
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
};
