import Icon from "@/components/base/icon/Icon";

import styles from "./Expand.module.css";

export default function Expand({ open, size = 3 }) {
  return (
    <Icon
      size={size}
      bgColor="var(--blue)"
      dataCy="expand-icon"
      className={`${styles.expandicon} ${open ? styles.opened : styles.closed}`}
      alt="expand"
    >
      {/* Lines to be animated */}
      <div>
        <span />
        <span />
      </div>
    </Icon>
  );
}
