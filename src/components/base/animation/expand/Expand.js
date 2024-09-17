import Icon from "@/components/base/icon/Icon";

import styles from "./Expand.module.css";

export default function Expand({
  open,
  size = 3,
  src = "expand.svg",
  bgColor = "var(--blue)",
  iconColor = "white",
}) {
  return (
    <Icon
      size={size}
      bgColor={bgColor}
      dataCy="expand-icon"
      className={`${styles.expandicon} ${open ? styles.opened : styles.closed}`}
      alt="expand"
      src={src}
    >
      {/* Lines to be animated */}
      <div>
        <span style={{ background: iconColor }} />
        <span style={{ background: iconColor }} />
      </div>
    </Icon>
  );
}
