// Cover.jsx
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import cx from "classnames";

import Skeleton from "@/components/base/skeleton";
import styles from "./Cover.module.css";

/**
 * Core Cover component (ikke default-export)
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
  const imageRef = useRef(null);

  // Hvis src er et array af cover-objekter, vælg første gyldige
  let resolvedSrc = src;
  if (Array.isArray(src)) {
    resolvedSrc = src
      .map((t) => t?.cover && t.cover.detail)
      .filter(Boolean)?.[0];
  }

  // Reset tilstand når kilden ændrer sig
  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [resolvedSrc]);

  // Vis skeleton når vi har en kilde men billedet ikke er loadet endnu
  const showSkeleton = Boolean(skeleton || (resolvedSrc && !loaded));

  // CSS-klasser
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

  // A11y: gør wrapper interaktiv (role/tabIndex/keyboard) KUN hvis onClick findes
  const interactive = typeof onClick === "function";
  const handleKeyActivate = (e) => {
    if (!interactive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault(); // undgå scroll på Space
      onClick(e);
    }
  };
  const interactiveProps = interactive
    ? { role: "button", tabIndex: 0, onKeyDown: handleKeyActivate }
    : {};

  return (
    <div
      {...interactiveProps}
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
      onClick={onClick}
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

/**
 * Default-export bevarer eksisterende import-pattern:
 * `import Cover from "@/components/base/cover"`
 */
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
