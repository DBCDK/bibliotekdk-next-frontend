/**
 * Custom basket action menu
 */

import Action from "@/components/base/action";
import Badge from "@/components/base/badge";

import styles from "./basket.module.css";

export default function BasketIcon(props) {
  const { className } = props;

  return (
    <Action
      {...props}
      badge={false}
      className={`${className} ${styles.hovertrigger}`}
    >
      <div className={styles.basket}>
        <div className={styles.icon}>
          <div className={styles.bag}>
            <div className={styles.handle} />
          </div>

          <div className={styles._bag} />

          <Badge className={styles.badge} children="1" />
        </div>
      </div>
    </Action>
  );
}
