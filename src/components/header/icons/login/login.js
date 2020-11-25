/**
 * Custom login action menu
 */

import Action from "@/components/base/action";

import styles from "./login.module.css";

export default function LoginIcon(props) {
  const { className } = props;

  return (
    <Action {...props} className={`${className} ${styles.trigger}`}>
      <div className={styles.login}>
        <div className={styles.icon}>
          <div className={styles.head} />
          <div className={styles.bodyWrap}>
            <div className={styles.body}>
              <div className={styles.border} />
            </div>
          </div>
        </div>
      </div>
    </Action>
  );
}
