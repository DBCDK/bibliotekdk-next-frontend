import { OverlayTrigger, Popover } from "react-bootstrap";
import Icon from "@/components/base/icon";
import styles from "./TjoolTjip.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import PropTypes from "prop-types";
import { useState } from "react";

export default function TjoolTjip({
  placement = "bottom",
  labelToTranslate,
  customClass,
}) {
  return (
    <span className={`${customClass ? customClass : ""}`}>
      <OverlayTrigger
        trigger={["focus"]}
        delayShow={300}
        delayHide={150}
        placement={placement}
        overlay={
          <Popover id={`tooltip-${labelToTranslate}`}>
            <div
              className={styles.tooltipcontainer}
              data-cy="popover-container"
            >
              <Text type="text3" lines={2}>
                {Translate({ context: "tooltip", label: labelToTranslate })}
              </Text>
            </div>
          </Popover>
        }
      >
        <span tabIndex="0" className={styles.tooltipwrap}>
          <Icon
            src="questionmark.svg"
            alt="info"
            data-cy="tooltip-icon"
            size={3}
            className={styles.tooltipcursor}
          ></Icon>
        </span>
      </OverlayTrigger>
    </span>
  );
}

// PropTypes for component
TjoolTjip.propTypes = {
  placement: PropTypes.string,
  labelToTranslate: PropTypes.string,
};
