/**
 * Custom burger action menu
 */

import Action from "@/components/base/action";

import styles from "./burger.module.css";

export default function BurgerIcon(props) {
  const { className } = props;

  return (
    <Action {...props} className={`${className} ${styles.hovertrigger}`}>
      <div className={styles.burger}>
        <div className={styles.icon}>
          <div className={styles.line} />
          <div className={styles.line} />
          <div className={styles.line} />
        </div>
      </div>
    </Action>
  );
}
