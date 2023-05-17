import PropTypes from "prop-types";

import styles from "./iconButton.module.css";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";

import animations from "@/components/base/animation/animations.module.css";
/**
 * For now only can only be used with Close-icon. Can be expanded if other icons are needed.
 *
 */
function IconButton({
  className,
  onClick,
  alt = "",
  children,
  icon = "close",
  ...props
}) {
  return (
    <button
      className={`${styles.close} ${animations["on-hover"]} ${animations["on-focus"]} ${className}`}
      border={false}
      onClick={() => onClick && onClick()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          onClick && onClick();
        }
      }}
      {...props}
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
        src={`${icon}.svg`}
      />
    </button>
  );
}

IconButton.propTypes = {
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onClick: PropTypes.func,
  alt: PropTypes.string,
  children: PropTypes.any,
  /** Has to match an svg file name inside public/icons folder*/
  icon: PropTypes.string,
};
export default IconButton;
