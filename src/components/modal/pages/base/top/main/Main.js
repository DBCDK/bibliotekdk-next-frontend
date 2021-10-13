import CloseSvg from "@/public/icons/close.svg";

import Translate from "@/components/base/translate";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";

import styles from "./Main.module.css";

export function Main({ title, isVisible, close }) {
  return (
    <div className={styles.top}>
      <div className={styles.close}>
        <div className={styles.wrap}>
          {title && (
            <Title type="title4" className={styles.title}>
              {title}
            </Title>
          )}

          <Icon
            dataCy="close-modal"
            tabIndex={isVisible ? "0" : "-1"}
            title={Translate({
              context: "general",
              label: "close-modal-title",
            })}
            alt={Translate({
              context: "general",
              label: "close-modal-title",
            })}
            className={styles.closeIcon}
            // src="close_white.svg"
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
    </div>
  );
}
