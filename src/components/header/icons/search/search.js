/**
 * Custom burger action menu
 */

import Action from "@/components/base/action";

import styles from "./search.module.css";

export default function SearchIcon(props) {
  const { className } = props;

  return (
    <Action {...props} className={`${className} ${styles.trigger}`}>
      <div className={styles.search}>
        <div className={styles.icon}>
          <div className={styles.lens}>
            <div className={styles.handle} />
          </div>
        </div>
      </div>
    </Action>
  );
}
