import { useId } from "react";
import styles from "./Expand.module.css";

/**
 * Maximize/Minimize toggle-ikon til modal (docket højre <-> fuldskærm).
 * Ikonet viser NÆSTE handling:
 *   - Unchecked (docket højre): viser MAXIMIZE (klik => fuldskærm)
 *   - Checked (fuldskærm):     viser MINIMIZE (klik => dock til højre)
 */
export default function ExpandIcon({
  defaultChecked = false,
  disabled = false,
  onChange,
  className = "",
}) {
  const id = useId();

  function onKeyDown(e) {
    // Gør Enter/Space til klik på label (toggler checkbox via htmlFor)
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      e.currentTarget.click();
    }
  }

  return (
    <span className={`${styles.wrap} ${className}`}>
      <input
        id={id}
        type="checkbox"
        className={`${styles.input} ${styles.visuallyHidden}`}
        defaultChecked={defaultChecked}
        disabled={disabled}
        aria-label="Skift mellem højre-dock og fuldskærm"
        onChange={onChange}
      />

      <label
        htmlFor={id}
        className={styles.button}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-disabled={disabled || undefined}
        onKeyDown={disabled ? undefined : onKeyDown}
      >
        <span className={styles.icon} aria-hidden="true">
          {/* Minimize (højre-docket sidebar) */}
          <svg className={styles.mini} viewBox="0 0 20 20">
            {/* skærmramme */}
            <rect x="3" y="4" width="14" height="12" rx="2" fill="none" />
            {/* højre sidebar */}
            <rect x="11" y="6" width="4" height="8" rx="1" />
          </svg>

          {/* Maximize (fullscreen corners) */}
          <svg className={styles.max} viewBox="0 0 20 20">
            <path d="M6 4h-2v2" />
            <path d="M14 4h2v2" />
            <path d="M6 16h-2v-2" />
            <path d="M14 16h2v-2" />
          </svg>
        </span>
      </label>
    </span>
  );
}
