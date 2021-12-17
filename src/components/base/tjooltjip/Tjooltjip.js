import { OverlayTrigger, Popover } from "react-bootstrap";
import Icon from "@/components/base/icon";
import styles from "./TjoolTjip.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import PropTypes from "prop-types";

export default function TjoolTjip({ placement = "bottom", labelToTranslate }) {
  return (
    <div className="progress-wrapper">
      <OverlayTrigger
        placement={placement}
        trigger="click"
        overlay={
          <Popover id={`tooltip-${labelToTranslate}`}>
            <div
              className={styles.tooltipcontainer}
              data-cy="popover-container"
            >
              <Text type="text3" lines={2} tag="span">
                {Translate({ context: "tooltip", label: labelToTranslate })}
              </Text>
            </div>
          </Popover>
        }
      >
        <Icon src="questionmark.svg" alt="info"></Icon>
      </OverlayTrigger>
    </div>
  );
}

// PropTypes for component
TjoolTjip.propTypes = {
  placement: PropTypes.string,
  labelToTranslate: PropTypes.string,
};
