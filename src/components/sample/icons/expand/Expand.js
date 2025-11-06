import Translate from "@/components/base/translate";

import styles from "./Expand.module.css";

export default function ExpandIcon({
  id = "expand-toggle",
  defaultChecked = false,
  ariaLabel = "Skift mellem maximize og minimize",
  onChange,
  className = "",
}) {
  return (
    <span className={`${styles.wrap} ${className}`}>
      <input
        id={id}
        type="checkbox"
        className={styles.input + " " + styles.visuallyHidden}
        defaultChecked={defaultChecked}
        aria-label={ariaLabel}
        onChange={onChange}
      />
      <label htmlFor={id} className={styles.toggle}>
        <span className={styles.icon} aria-hidden="true">
          <span className={styles.arrow + " " + styles.arrowTR}>
            <i>▸</i>
          </span>
          <span className={styles.arrow + " " + styles.arrowBL}>
            <i>▸</i>
          </span>
        </span>
      </label>
    </span>
  );
}
