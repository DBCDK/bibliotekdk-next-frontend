import styles from "./Divider.module.css";

/**
 * divider  - basically hr with a div
 * @returns {JSX.Element}
 * @constructor
 */
export function Divider({}) {
  return <hr className={styles.divider} />;
}
