import { useModal } from "@/components/_modal";

import CloseSvg from "@/public/icons/close.svg";
import ChevronSvg from "@/public/icons/chevron_left.svg";

import Link from "@/components/base/link";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";

import Translate from "@/components/base/translate";

import animations from "@/components/base/animation/animations.module.css";
import styles from "./Top.module.css";

export function Close({ className, onClose }) {
  return (
    <Link
      className={`${styles.close} ${animations["on-hover"]} ${animations["on-focus"]} ${className}`}
      border={false}
      dataCy="close-modal"
      onClick={() => onClose && onClose()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          onClose && onClose();
        }
      }}
    >
      <span className={styles.wrap}>
        <Text
          type="text3"
          className={`${animations["f-border-bottom"]} ${animations["h-border-bottom"]}`}
        >
          {Translate({ context: "general", label: "close" })}
        </Text>
        <Icon
          size={{ w: 2, h: "auto" }}
          className={`${styles.icon} ${animations["h-elastic"]} ${animations["f-elastic"]}`}
          title={Translate({
            context: "general",
            label: "close-modal-title",
          })}
          alt={Translate({
            context: "general",
            label: "close-modal-title",
          })}
        >
          <CloseSvg />
        </Icon>
      </span>
    </Link>
  );
}

export function Back({ className, onBack }) {
  return (
    <Link
      dataCy="modal-back"
      className={`${styles.back} ${animations["on-hover"]} ${animations["on-focus"]} ${className}`}
      border={false}
      onClick={() => onBack && onBack()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          onBack && onBack();
        }
      }}
    >
      <span className={styles.wrap}>
        <Icon
          size={{ w: 2, h: "auto" }}
          dataCy="back-modal"
          className={`${styles.icon} ${animations["h-bounce-left"]} ${animations["f-bounce-left"]}`}
          title={Translate({
            context: "general",
            label: "back-modal-title",
          })}
          alt={Translate({
            context: "general",
            label: "back-modal-title",
          })}
        >
          <ChevronSvg />
        </Icon>

        <Text
          type="text3"
          className={`${animations["f-border-bottom"]} ${animations["h-border-bottom"]}`}
        >
          {Translate({ context: "general", label: "back" })}
        </Text>
      </span>
    </Link>
  );
}

/**
 *
 * @param {*} props
 * @param {obj} props.className
 * @param {string} props.label
 * @param {func} props.close
 * @returns {component}
 */
export default function Top({
  modal = useModal(),
  className = {},
  title,
  back = true,
  sticky = false,
}) {
  const showBack = back && modal.index?.() > 0;

  const stickyClass = sticky ? styles.sticky : "";

  return (
    <div className={`${styles.top} ${stickyClass} ${className.top || ""}`}>
      <div className={`${styles.wrap}`}>
        <Close
          onClose={() => modal.clear()}
          className={className.close || ""}
        />
        {showBack && (
          <Back onBack={() => modal.prev()} className={className.back || ""} />
        )}
      </div>
      <div>
        {title && (
          <Title
            type="title4"
            className={`${styles.title} ${className.title || ""}`}
          >
            {title}
          </Title>
        )}
      </div>
    </div>
  );
}
