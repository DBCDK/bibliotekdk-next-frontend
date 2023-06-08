import Link from "@/components/base/link";
import styles from "@/components/article/lectorreview/linkarrow/LinkArrow.module.css";
import animations from "@/components/base/animation/animations.module.css";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import PropTypes from "prop-types";
import cx from "classnames";

export function IconLink({
  children,
  link = null,
  onClick = () => {},
  textType = "text3",
  className,
  border = { top: false, bottom: { keepVisible: true } },
  iconSrc,
  iconAnimation = [animations["h-bounce-left"], animations["f-bounce-left"]],
}) {
  return (
    <Link
      dataCy="icon-link-children"
      className={`${styles.flex_box} ${animations["on-hover"]} ${animations["on-focus"]} ${className}`}
      border={false}
      href={link}
    >
      <Icon
        size={{ w: 2, h: "auto" }}
        dataCy="back-modal"
        className={cx(iconAnimation)}
        title={JSON.stringify(children)}
        alt={JSON.stringify(children)}
        // src={"@/public/icons/chevron_left.svg"}
        // src={"@/public/icons/arrow_left.svg"}
        {...(typeof iconSrc === "string" && { src: iconSrc })}
        {...(typeof iconSrc === "function" && { children: iconSrc })}
      />

      <Link border={border} onClick={onClick}>
        <Text type={textType} tag="span">
          {children}
        </Text>
      </Link>
    </Link>
  );
}

IconLink.propTypes = {
  children: PropTypes.string,
  link: PropTypes.string,
  textType: PropTypes.string,
  iconSrc: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  className: PropTypes.string,
};
