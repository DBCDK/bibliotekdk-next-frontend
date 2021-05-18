import { useState, useEffect } from "react";
import styles from "./progress.module.css";

/**
 *
 * @returns component
 */

function Progress({ className, start, duration = 2, delay = 1, callback }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const finished = (duration + delay) * 1000;
    if (start) {
      // fire loading animation
      setLoading(true);
      // fire callback on loading done
      setTimeout(() => {
        callback && callback();
        // cleanup
        setTimeout(() => {
          loading && setLoading(false);
        }, finished);
      }, finished);
    }
  }, [start]);

  const animation = {
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  };

  const activeClass = loading ? styles.active : "";

  return (
    <div className={`${styles.progress} ${activeClass} ${className}`}>
      <div className={styles.bar} style={animation} />
    </div>
  );
}

export default Progress;
