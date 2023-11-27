import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import Icon from "@/components/base/icon";
import styles from "./Tooltip.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";

export default function Tooltip({
  placement = "bottom",
  labelToTranslate,
  customClass,
  trigger = ["focus"],
  iconSize = 3,
  children,
  show = false,
  target = null,
  toolTipClassName,
}) {
  const spanRef = useRef();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <span className={`${customClass ? customClass : ""}`}>
      <OverlayTrigger
        trigger={trigger}
        delayShow={300}
        delayHide={150}
        placement={placement}
        show={show}
        target={target}
        overlay={
          <Popover
            id={`tooltip-${labelToTranslate}`}
            className={`${styles.popover} ${toolTipClassName}`}
          >
            <div
              className={styles.tooltipContainer}
              data-cy="popover-container"
            >
              <Text type="text3" lines={2}>
                {Translate({ context: "tooltip", label: labelToTranslate })}
              </Text>
            </div>
          </Popover>
        }
      >
        <span
          ref={spanRef}
          tabIndex="0"
          className={styles.tooltipWrap}
          onKeyUp={(e) => {
            if (e.code === "Escape") {
              spanRef?.current?.blur?.();
            }
          }}
        >
          {children ? (
            children
          ) : (
            <Icon
              src="questionmark.svg"
              alt="info"
              data-cy="tooltip-icon"
              size={iconSize}
              className={styles.tooltipCursor}
            ></Icon>
          )}
        </span>
      </OverlayTrigger>
    </span>
  );
}

// PropTypes for component
Tooltip.propTypes = {
  placement: PropTypes.string,
  labelToTranslate: PropTypes.string,
  customClass: PropTypes.string,
  trigger: PropTypes.array,
  iconSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  children: PropTypes.node,
};
