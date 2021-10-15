import CloseSvg from "@/public/icons/close.svg";

import Translate from "@/components/base/translate";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";

import animations from "@/components/base/animation/animations.module.css";
import styles from "./Main.module.css";

export default function Main({ label, close, className }) {
  return (
    <div className={styles.top}>
      <div className={styles.wrap}>
        {label && (
          <Title type="title4" className={`${styles.title} ${className.title}`}>
            {Translate({
              context: "modal",
              label,
            })}
          </Title>
        )}

        <Icon
          dataCy="close-modal"
          ariaHidden={false}
          tabIndex="0"
          title={Translate({
            context: "general",
            label: "close-modal-title",
          })}
          alt={Translate({
            context: "general",
            label: "close-modal-title",
          })}
          className={`${styles.icon} ${animations["on-hover"]} ${animations["on-focus"]} ${animations["h-elastic"]} ${animations["f-elastic"]} ${className.icon}`}
          size={2}
          onClick={() => close && close()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.keyCode === 13) {
              close && close();
            }
          }}
        >
          <CloseSvg />
        </Icon>
      </div>
    </div>
  );
}
