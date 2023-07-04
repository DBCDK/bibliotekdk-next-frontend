import Link, { LinkOnlyInternalAnimations } from "@/components/base/link";
import styles from "./IconLink.module.css";
import animations from "css/animations";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import PropTypes from "prop-types";
import cx from "classnames";
import ChevronSvg from "@/public/icons/chevron_left.svg";
import {
  PropType_Link_border,
  PropType_Link_href,
} from "@/components/base/link/Link";

/**
 * Used to easily create IconLinks
 * @param children
 * @param href
 * @param onClick
 * @param textType
 * @param className
 * @param border
 * @param tag
 * @param disabled
 * @param iconSrc
 * @param iconAnimation
 * @param iconOrientation
 * @param iconPlacement
 * @param iconStyle
 * @return {JSX.Element}
 */
export function IconLink({
  children,
  href = null,
  onClick = null,
  textType = "text3",
  className,
  border = { top: false, bottom: { keepVisible: true } },
  tag = null,
  disabled = false,
  iconSrc = null,
  iconAnimation = [animations["h-bounce-left"], animations["f-bounce-left"]],
  iconOrientation = 0,
  iconPlacement = "left",
  iconStyle = {},
}) {
  const IconChild = iconSrc === null ? ChevronSvg : iconSrc;

  const IconComponent = () => {
    return (
      <Icon
        size={{ w: 2, h: 2 }}
        dataCy="icon-link-icon"
        className={cx(...iconAnimation)}
        title={"Link kopieret"}
        alt={JSON.stringify(children.innerText)}
      >
        <IconChild
          style={{
            transform: `rotate(${iconOrientation}deg)`,
            marginTop: "var(--pt025)",
            ...iconStyle,
          }}
        />
      </Icon>
    );
  };

  return (
    <LinkOnlyInternalAnimations
      dataCy="icon-link-children"
      className={cx(styles.flex_box, className)}
      {...(href !== null && { href: href })}
      {...(onClick !== null && { onClick: onClick })}
      tag={tag}
      disabled={disabled}
    >
      {iconPlacement === "left" && <IconComponent />}
      <div>
        <Link border={disabled ? {} : border} tag={"span"} disabled={disabled}>
          {typeof children === "string" ? (
            <Text type={textType} tag="span">
              {children}
            </Text>
          ) : (
            children
          )}
        </Link>
      </div>
      {iconPlacement === "right" && <IconComponent />}
    </LinkOnlyInternalAnimations>
  );
}

IconLink.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  href: PropType_Link_href,
  onClick: PropTypes.func,
  textType: PropTypes.string,
  className: PropTypes.string,
  border: PropType_Link_border,
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(null)]),
  iconSrc: PropTypes.func,
  iconAnimation: PropTypes.arrayOf(PropTypes.string),
  iconOrientation: PropTypes.number,
  iconPlacement: PropTypes.string,
  iconStyle: PropTypes.object,
};
