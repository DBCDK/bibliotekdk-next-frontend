import RightSvg from "@/public/icons/arrowright_no_fill.svg";
import LeftSvg from "@/public/icons/arrowleft_no_fill.svg";
import styles from "@/components/work/overview/covercarousel/arrow/Arrow.module.css";
import Icon from "@/components/base/icon";
import animations from "@/components/base/animation/animations.module.css";
import Translate from "@/components/base/translate";
import React from "react";

export function Arrow({
  clickCallback,
  orientation,
  arrowClass,
  dataDisabled = false,
  dataCy = `${orientation}_arrow`,
  size = { w: 5, h: 5 },
}) {
  const ArrowTag = orientation === "right" ? RightSvg : LeftSvg;

  const classNames = [
    styles.arrow_functionality,
    dataDisabled && styles.disabled_icon,
    arrowClass,
    animations["h-elastic"],
    animations["f-elastic"],
  ].join(" ");

  return (
    <Icon
      size={size}
      className={classNames}
      alt={Translate({
        context: "recommendations",
        label: `arrow-${orientation}`,
      })}
      bgColor={"override"}
      onClick={clickCallback}
      tag={"button"}
      dataCy={dataCy}
    >
      <ArrowTag />
    </Icon>
  );
}
