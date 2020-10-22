import styles from "./Divider.module.css";

/**
 * divider  - basically hr
 * @returns {JSX.Element}
 * @constructor
 */
export function Divider({}) {
  return <hr className={styles.divider} />;
}
