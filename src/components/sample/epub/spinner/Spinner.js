import styles from "./Spinner.module.css";

export default function Spinner({ show, label = "Indlæser…" }) {
  if (!show) return null;

  return (
    <div
      className={styles.backdrop}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div className={styles.content}>
        <div className={styles.spinner} aria-hidden="true">
          <span className={styles.ringOuter} />
          <span className={styles.ringInner} />
        </div>

        {label ? <div className={styles.label}>{label}</div> : null}
      </div>
    </div>
  );
}
