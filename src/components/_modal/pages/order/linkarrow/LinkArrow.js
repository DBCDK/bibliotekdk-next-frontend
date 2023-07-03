import styles from "./LinkArrow.module.css";
import animations from "css/animations";
import Link from "@/components/base/link";
import Arrow from "@/components/base/animation/arrow";

export function LinkArrow({ onClick, disabled, children, className = "" }) {
  return (
    <div
      className={`${animations["on-hover"]} ${className}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          onClick(e);
        }
      }}
    >
      <Link
        className={`${animations["on-focus"]}`}
        disabled={disabled}
        onClick={(e) => e.preventDefault()}
        border={{ bottom: { keepVisible: !disabled } }}
      >
        {children}
      </Link>
      <Arrow
        className={`${styles.arrow} ${animations["h-bounce-right"]} ${animations["f-bounce-right"]}`}
      />
    </div>
  );
}
