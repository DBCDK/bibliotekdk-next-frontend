import styles from "./loader.module.css";

/**
 *
 * @returns component
 */

function Loader({ duration = 2, delay = 1, className }) {
  const animation = {
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
  };

  return (
    <div className={`${styles.loader} ${className}`}>
      <div className={styles.bar} style={animation} />
    </div>
  );
}

export default Loader;
