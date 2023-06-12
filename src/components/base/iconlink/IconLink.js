import Link, { LinkOnlyInternalAnimations } from "@/components/base/link";
import styles from "@/components/base/iconlink/IconLink.module.css";
import animations from "@/components/base/animation/animations.module.css";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import PropTypes from "prop-types";
import cx from "classnames";
import ChevronSvg from "@/public/icons/chevron_left.svg";
import {
  PropType_Link_border,
  PropType_Link_href,
} from "@/components/base/link/Link";

export function IconLink({
  children,
  href = null,
  onClick = null,
  textType = "text3",
  className,
  border = { top: false, bottom: { keepVisible: true } },
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
        size={{ w: 2, h: "auto" }}
        dataCy="icon-link-icon"
        className={cx(styles.icon, ...iconAnimation)}
        title={JSON.stringify(children)}
        alt={JSON.stringify(children)}
      >
        <IconChild
          style={{ transform: `rotate(${iconOrientation}deg)`, ...iconStyle }}
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
    >
      {iconPlacement === "left" && <IconComponent />}
      <div>
        <Link border={border}>
          <Text type={textType} tag="span">
            {children}
          </Text>
        </Link>
      </div>
      {iconPlacement === "right" && <IconComponent />}
    </LinkOnlyInternalAnimations>
  );
}

IconLink.propTypes = {
  children: PropTypes.string,
  href: PropType_Link_href,
  onClick: PropTypes.func,
  textType: PropTypes.string,
  className: PropTypes.string,
  border: PropType_Link_border,
  iconSrc: PropTypes.func,
  iconAnimation: PropTypes.arrayOf(PropTypes.string),
  iconOrientation: PropTypes.number,
  iconPlacement: PropTypes.string,
};
