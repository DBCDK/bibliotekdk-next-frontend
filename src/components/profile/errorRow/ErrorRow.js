import styles from "./ErrorRow.module.css";

/**
 * A a row that shows an error message
 * @returns ErrorRow component
 */

export default function ErrorRow({ text }) {
  return <div className={styles.ErrorRow}>{text}</div>;
}
