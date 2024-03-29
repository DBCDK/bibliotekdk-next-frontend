import Popover from "react-bootstrap/Popover";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import Icon from "@/components/base/icon";
import styles from "./Tooltip.module.css";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import cx from "classnames";

export default function Tooltip({
  placement = "bottom",
  labelToTranslate,
  customClass,
  childClassName,
  trigger = ["focus"],
  iconSize = 3,
  children,
  show,
  tooltipRef,
  toolTipClassName,
  tabIndex = 0,
}) {
  const spanRef = useRef();

  const [mounted, setMounted] = useState(false);

  //fixes hydration error. https://stackoverflow.com/questions/75094010/nextjs-13-hydration-failed-because-the-initial-ui-does-not-match-what-was-render
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <span className={`${customClass ? customClass : ""}`} ref={tooltipRef}>
      <OverlayTrigger
        trigger={trigger}
        delayShow={300}
        delayHide={150}
        placement={placement}
        show={show}
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
          tabIndex={tabIndex}
          className={cx(
            styles.tooltipWrap,
            { [styles.border_animation]: !childClassName },
            childClassName
          )}
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
