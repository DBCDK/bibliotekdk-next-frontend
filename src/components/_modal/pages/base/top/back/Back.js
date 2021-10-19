import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Text from "@/components/base/text";

import Arrow from "@/components/base/animation/arrow";

import animations from "@/components/base/animation/animations.module.css";

import styles from "./Back.module.css";

export default function Back({ close, className }) {
  return (
    <div className={`${styles.back} ${className}`}>
      <div className={styles.wrap}>
        <Link
          border={false}
          className={`${styles.link} ${animations["on-hover"]} ${animations["on-focus"]}`}
          onClick={() => close && close()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.keyCode === 13) {
              close && close();
            }
          }}
        >
          <span className={styles.flex}>
            <Arrow
              flip
              className={`${styles.arrow} ${animations["h-bounce-left"]} ${animations["f-bounce-left"]}`}
            />
            <Text
              type="text3"
              className={`${animations["f-border-bottom"]} ${animations["h-border-bottom"]}`}
            >
              {Translate({ context: "general", label: "back" })}
            </Text>
          </span>
        </Link>
      </div>
    </div>
  );
}
