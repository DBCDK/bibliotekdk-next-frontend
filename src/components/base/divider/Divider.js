import styles from "./Divider.module.css";

/**
 * divider  - basically hr
 * @returns {React.JSX.Element}
 */
export default function Divider({ style, className = "" }) {
  return <hr className={`${styles.divider} ${className}`} style={style} />;
}
