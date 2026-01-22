import { useState } from "react";
import styles from "./Expand.module.css";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";
import animations from "@/components/base/animation/animations.module.css";

/**
 * Maximize/Minimize toggle-ikon til modal (docket højre <-> fuldskærm).
 * Ikonet viser NÆSTE handling:
 *   - Unchecked (docket højre): viser MAXIMIZE (klik => fuldskærm)
 *   - Checked (fuldskærm):     viser MINIMIZE (klik => dock til højre)
 */
export default function ExpandIcon({
  defaultChecked = false,
  checked,
  disabled = false,
  onChange,
  onClick,
  onKeyDown,
  className = "",
  ...props
}) {
  const isControlled = typeof checked === "boolean";
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? checked : internalChecked;

  const ariaLabel =
    props["aria-label"] ??
    Translate({
      context: "general",
      label: isChecked ? "minimize" : "expand",
    });

  const ariaPressed = props["aria-pressed"] ?? isChecked;

  function handleToggle(e) {
    if (disabled) {
      return;
    }

    const nextChecked = !isChecked;

    if (!isControlled) {
      setInternalChecked(nextChecked);
    }

    onChange && onChange(nextChecked);
    if (onClick && onClick !== onChange) {
      onClick(e);
    }
  }

  function handleKeyDown(e) {
    onKeyDown && onKeyDown(e);

    if (e.defaultPrevented) {
      return;
    }

    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      handleToggle(e);
    }
  }

  return (
    <span className={`${styles.container} ${className}`}>
      <Link
        tag="button"
        type="button"
        border={false}
        disabled={disabled}
        className={`${styles.button} ${animations["on-hover"]} ${
          animations["on-focus"]
        } ${isChecked ? styles.checked : ""}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        {...props}
      >
        <span className={styles.wrap} aria-hidden="true">
          <span className={styles.iconWrap}>
            <Icon
              className={`${styles.icon} ${styles.minimize} ${animations["h-elastic"]} ${animations["f-elastic"]}`}
              size={{ w: 2, h: "auto" }}
              src={"minimize.svg"}
            />
            <Icon
              className={`${styles.icon} ${styles.maximize} ${animations["h-elastic"]} ${animations["f-elastic"]}`}
              size={{ w: 2, h: "auto" }}
              src={"maximize.svg"}
            />
          </span>
          <span className={styles.labelWrap}>
            <Text
              tag="span"
              type="text3"
              className={`${styles.label} ${styles.minimize} ${animations["f-border-bottom"]} ${animations["h-border-bottom"]}`}
            >
              {Translate({ context: "general", label: "minimize" })}
            </Text>
            <Text
              tag="span"
              type="text3"
              className={`${styles.label} ${styles.maximize} ${animations["f-border-bottom"]} ${animations["h-border-bottom"]}`}
            >
              {Translate({ context: "general", label: "expand" })}
            </Text>
          </span>
        </span>
      </Link>
    </span>
  );
}
