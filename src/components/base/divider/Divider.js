import styles from "./Divider.module.css";

/**
 * divider  - basically hr
 * @returns {React.ReactElement | null}
 */
export default function Divider({ style, className = "" }) {
  return <hr className={`${styles.divider} ${className}`} style={style} />;
}
