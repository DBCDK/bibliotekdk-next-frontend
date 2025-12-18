// Cover.jsx
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import cx from "classnames";

import Skeleton from "@/components/base/skeleton";
import styles from "./Cover.module.css";

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
  const imageRef = useRef(null);

  // Resolve src if it's an array
  let resolvedSrc = src;
  if (Array.isArray(src)) {
    resolvedSrc = src.map((t) => t?.cover?.detail).filter(Boolean)?.[0];
  }

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [resolvedSrc]);

  const showSkeleton = Boolean(skeleton || (resolvedSrc && !loaded));

  const loadedClass = loaded ? styles.loaded : "";
  const skeletonClass = showSkeleton ? styles.skeleton : "";
  const frameStyle = bgColor ? styles.frame : "";

  const backgroundColor = {
    backgroundColor: bgColor
      ? bgColor
      : resolvedSrc
      ? "transparent"
      : "var(--iron)",
  };

  const interactive = typeof onClick === "function";

  // A11y: aktiver med Enter/Space
  const handleKeyDown = (e) => {
    if (!interactive) return;
    if (e.key === " ") {
      e.preventDefault(); // undgå scroll på Space
    }
    if (e.key === "Enter") {
      onClick?.(e);
    }
  };

  const handleKeyUp = (e) => {
    if (!interactive) return;
    // Space aktiveres på keyup for rolle=button
    if (e.key === " ") {
      onClick?.(e);
    }
  };

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onClick={interactive ? onClick : undefined}
      style={backgroundColor}
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
      data-cy={resolvedSrc ? "cover-present" : "missing-cover"}
    >
      {skeletonClass && <Skeleton />}

      {resolvedSrc && !error && (
        <img
          ref={imageRef}
          alt=""
          src={resolvedSrc}
          loading="lazy"
          decoding="async"
          draggable="false"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(true);
            setError(true);
          }}
        />
      )}

      {((!skeleton && !resolvedSrc) || error) && (
        <div className={styles.fallback} />
      )}

      {children}
    </div>
  );
}

export default function Container(props) {
  return <Cover {...props} />;
}

Container.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  bgColor: PropTypes.string,
  size: PropTypes.oneOf(["thumbnail", "medium", "large", "fill", "fill-width"]),
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
};
