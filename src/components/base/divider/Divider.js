import styles from "./Divider.module.css";

/**
 * divider  - basically hr
 * @returns {JSX.Element}
 * @constructor
 */
export function Divider({ style, className = "" }) {
  return <hr className={`${styles.divider} ${className}`} style={style} />;
}
