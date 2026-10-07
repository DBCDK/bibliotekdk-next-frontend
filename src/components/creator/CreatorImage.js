import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import cx from "classnames";

import Image from "@/components/base/image";
import Skeleton from "@/components/base/skeleton";
import styles from "./CreatorImage.module.css";

export default function CreatorImage({
  src,
  alt = "",
  skeleton = false,
  onClick,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null);
  const interactive = typeof onClick === "function";

  useEffect(() => {
    setLoaded(false);
    setError(false);
    setAspectRatio(null);
  }, [src]);

  const handleLoad = (event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;

    if (naturalWidth && naturalHeight) {
      setAspectRatio(`${naturalWidth} / ${naturalHeight}`);
    }

    setLoaded(true);
  };

  const handleKeyDown = (event) => {
    if (!interactive) return;

    if (event.key === " ") {
      event.preventDefault();
    }

    if (event.key === "Enter") {
      onClick(event);
    }
  };

  const handleKeyUp = (event) => {
    if (interactive && event.key === " ") {
      onClick(event);
    }
  };

  const showSkeleton = Boolean(skeleton || (src && !loaded));

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className={cx(styles.image, {
        [styles.loaded]: loaded,
        [styles.interactive]: interactive,
      })}
      style={
        aspectRatio
          ? { "--creator-image-aspect-ratio": aspectRatio }
          : undefined
      }
    >
      {showSkeleton && <Skeleton />}

      {src && !error && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 767px) 100vw, 320px"
          draggable="false"
          onLoad={handleLoad}
          onError={() => {
            setLoaded(true);
            setError(true);
          }}
        />
      )}

      {((!skeleton && !src) || error) && <div className={styles.fallback} />}
    </div>
  );
}

CreatorImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  skeleton: PropTypes.bool,
  onClick: PropTypes.func,
};
