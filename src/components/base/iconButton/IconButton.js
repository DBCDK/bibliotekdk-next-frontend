import PropTypes from "prop-types";
import styles from "./iconButton.module.css";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";
import animations from "@/components/base/animation/animations.module.css";
import Link from "@/components/base/link";
import cx from "classnames";

/**
 * An animated button that contains a text and an Icon. Pass Icon name that matches an svg file inside public/icons
 * @param {Object} props
 * @param {string} props.className
 * @param {function} props.onClick
 * @param {string} props.alt
 * @param {Object} props.children
 * @param {string} props.icon
 * @param {string} props.textType
 * @param {boolean} props.keepUnderline
 * @param {string} props.dataCy
 * @returns {React.JSX.Element}
 */
function IconButton({
  className,
  onClick,
  alt = "",
  children,
  icon,
  iconSize = 2,
  textType = "text3",
  keepUnderline,
  dataCy,
  disabled = false,
  ...props
}) {
  const iconSrc = !disabled ? `${icon}.svg` : `${icon}_grey.svg`;

  return (
    <button
      className={cx(
        styles.container,
        animations["on-hover"],
        animations["on-focus"],
        styles.focusStyle,
        className
      )}
      tabIndex={disabled ? "-1" : "0"}
      onClick={(e) => onClick && onClick(e)}
      data-cy={dataCy}
      disabled={disabled}
      {...props}
    >
      <Link
        className={styles.textWrapper}
        onClick={(e) => e.preventDefault()}
        border={{ bottom: !disabled ? { keepVisible: keepUnderline } : false }}
        tag="div"
        tabIndex={-1}
      >
        <Text type={textType} tag="span" data-control="ICON-BUTTON">
          {children}
        </Text>
      </Link>
      <Icon
        size={{ w: iconSize, h: "auto" }}
        className={`${animations["h-elastic"]} ${animations["f-elastic"]}`}
        alt={alt}
        src={iconSrc}
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
