import styles from "./iconButton.module.css";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";

import animations from "@/components/base/animation/animations.module.css";
/**
 * For now only can only be used with Close-icon. Can be expanded if other icons are needed.
 */
export default function IconButton({
  className,
  onClick,
  alt = "",
  children,
  ...props
}) {
  return (
    <button
      className={`${styles.close} ${animations["on-hover"]} ${animations["on-focus"]} ${className}`}
      border={false}
      dataCy="close-modal"
      onClick={() => onClick && onClick()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          onClick && onClick();
        }
      }}
    >
      <Text
        type="text3"
        className={`${animations["f-border-bottom"]} ${animations["h-border-bottom"]}`}
      >
        {children}
      </Text>
      <Icon
        size={{ w: 2, h: "auto" }}
        className={`${styles.icon} ${animations["h-elastic"]} ${animations["f-elastic"]}`}
        alt={alt}
        title={alt}
        src="close.svg"
      />
    </button>
  );
}
