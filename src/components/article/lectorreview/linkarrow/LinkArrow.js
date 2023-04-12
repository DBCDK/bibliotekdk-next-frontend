/**
 * LinkArrow is used by LectorReviewPage to go back to the origin book
 */

import Link from "@/components/base/link";
import styles from "@/components/article/lectorreview/linkarrow/LinkArrow.module.css";
import animations from "@/components/base/animation/animations.module.css";
import Icon from "@/components/base/icon";
import ChevronSvg from "@/public/icons/chevron_left.svg";
import Text from "@/components/base/text";
import PropTypes from "prop-types";

export function LinkArrow({ children, link, textType = "text3", className }) {
  return (
    <Link
      dataCy="modal-back"
      className={`${styles.flex_box} ${animations["on-hover"]} ${animations["on-focus"]} ${className}`}
      border={false}
      href={link}
    >
      <Icon
        size={{ w: 2, h: "auto" }}
        dataCy="back-modal"
        className={`${animations["h-bounce-left"]} ${animations["f-bounce-left"]}`}
        title={JSON.stringify(children)}
        alt={JSON.stringify(children)}
      >
        <ChevronSvg />
      </Icon>

      <Text
        type={textType}
        className={`${animations["f-border-bottom"]} ${animations["h-border-bottom"]}`}
      >
        {children}
      </Text>
    </Link>
  );
}

LinkArrow.propTypes = {
  children: PropTypes.string,
  link: PropTypes.string,
  textType: PropTypes.string,
  className: PropTypes.string,
};
