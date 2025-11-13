// components/sample/epub/EpubProgress.jsx
import styles from "./Progress.module.css";

export default function EpubProgress({
  labels,
  segments,
  overallPctDerived,
  onJump,
  Link,
  Text,
  show = true,
}) {
  if (!show) return null;

  return (
    <div className={styles.progress}>
      {!!labels.length && (
        <div
          className={styles.labels}
          role="navigation"
          aria-label="Bogsektioner"
          style={{ ["--segments"]: segments }}
        >
          {labels.map((it, i) => (
            <div
              className={`${styles.labelBtn} ${it.active ? styles.active : ""}`}
              key={`${it.href}-${i}`}
              style={{ width: `calc(100% / ${segments})` }}
            >
              <Link
                title={it.label}
                onClick={() => onJump(it.href)}
                className={styles.labelText}
                aria-current={it.active ? "true" : undefined}
              >
                <Text type="text5">{it.label}</Text>
              </Link>
            </div>
          ))}
        </div>
      )}

      <div
        className={styles.progressTrack}
        style={{ ["--segments"]: segments }}
        aria-label="Bogprogress"
      >
        <div
          className={styles.progressFill}
          style={{ width: `${overallPctDerived}%` }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(overallPctDerived)}
        />
      </div>
    </div>
  );
}
