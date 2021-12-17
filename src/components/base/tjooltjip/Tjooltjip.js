import { OverlayTrigger, Popover } from "react-bootstrap";
import Icon from "@/components/base/icon";
import styles from "./TjoolTjip.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import PropTypes from "prop-types";

export default function TjoolTjip({
  placement = "bottom",
  labelToTranslate,
  customClass,
}) {
  return (
    <span className={`${styles.inline} ${customClass ? customClass : ""}`}>
      <OverlayTrigger
        placement={placement}
        rootClose
        trigger="click"
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
        <Icon
          src="questionmark.svg"
          alt="info"
          data-cy="tooltip-icon"
          size={3}
          className={styles.tooltipcursor}
        ></Icon>
      </OverlayTrigger>
    </span>
  );
}

// PropTypes for component
TjoolTjip.propTypes = {
  placement: PropTypes.string,
  labelToTranslate: PropTypes.string,
};
