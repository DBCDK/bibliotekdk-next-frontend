/**
 * @file LinkArrow is used by LectorReviewPage to go back to the origin book
 * TODO: We should refactor LinkArrow so it is the same across the project.
 *  Currently we have 2 LinkArrows. Top.js implements its own "LinkArrow"
 */

import Link from "@/components/base/link";
import styles from "./LinkArrow.module.css";
import animations from "css/animations";
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
