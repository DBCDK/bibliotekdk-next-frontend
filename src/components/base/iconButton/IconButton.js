import PropTypes from "prop-types";
import styles from "./iconButton.module.css";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";
import animations from "@/components/base/animation/animations.module.css";
import Link from "@/components/base/link";

/**
 * An animated button that contains a text and an Icon. Pass Icon name that matches an svg file inside public/icons
 * @param {obj} props
 * @param {string} props.className
 * @param {function} props.onClick
 * @param {string} props.alt
 * @param {obj} props.children
 * @param {string} props.icon
 * @returns {component}
 */
function IconButton({
  className,
  onClick,
  alt = "",
  children,
  icon = "close",
  textType = "text3",
  keepUnderline,
  ...props
}) {
  return (
    <button
      className={`${styles.container} ${animations["on-hover"]} ${animations["on-focus"]} ${className}`}
      onClick={() => onClick && onClick()}
      {...props}
    >
      <Link
        className={`${animations["on-focus"]} ${styles.textWrapper} `}
        onClick={(e) => e.preventDefault()}
        border={{ bottom: { keepVisible: keepUnderline } }}
        tag="div"
      >
        <Text type={textType}>{children}</Text>
      </Link>
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
  /** type prop for the <Text/> component */
  textType: PropTypes.string,
  /** Has to match an svg file name inside public/icons folder*/
  icon: PropTypes.string,
};
export default IconButton;
