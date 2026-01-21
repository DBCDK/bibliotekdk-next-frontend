import { useId } from "react";
import styles from "./Expand.module.css";
import Icon from "@/components/base/icon";

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
        <span className={styles.iconWrap} aria-hidden="true">
          <Icon
            className={`${styles.icon} ${styles.minimize}`}
            size={3}
            src={"minimize.svg"}
          />
          <Icon
            className={`${styles.icon} ${styles.maximize}`}
            size={3}
            src={"maximize.svg"}
          />
        </span>
      </label>
    </span>
  );
}
