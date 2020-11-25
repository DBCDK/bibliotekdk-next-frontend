/**
 * Custom basket action menu
 */

import Action from "@/components/base/action";
import Badge from "@/components/base/badge";

import styles from "./basket.module.css";

export default function BasketIcon(props) {
  const { className, items } = props;

  return (
    <Action {...props} className={`${className} ${styles.trigger}`}>
      <div className={styles.basket}>
        <div className={styles.icon}>
          <div className={styles.bag}>
            <div className={styles.handle} />
          </div>

          <div className={styles._bag} />

          <Badge className={styles.badge} children={items} />
        </div>
      </div>
    </Action>
  );
}
