import { useState, useEffect } from "react";
import styles from "./loader.module.css";

/**
 *
 * @returns component
 */

function Loader({ className, start, duration = 2, delay = 1, callback }) {
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

  console.log("activeClass", activeClass);

  return (
    <div className={`${styles.loader} ${activeClass} ${className}`}>
      <div className={styles.bar} style={animation} />
    </div>
  );
}

export default Loader;
