import styles from "./Arrow.module.css";

/**
 * Animated arrow that turns into a line when hovered/focused
 */
export default function Arrow({ flip = false, className = "" }) {
  const flipClass = flip ? styles.flip : "";

  return (
    <div className={`${styles.arrow} ${flipClass} ${className}`}>
      <div className={styles.trapezoid} />
      <div className={styles.trapezoid} />
      <div className={styles.trapezoid} />
      <div className={styles.trapezoid} />
    </div>
  );
}
