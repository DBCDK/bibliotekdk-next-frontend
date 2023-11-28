import React, { useRef } from "react";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import styles from "./PopoverTrigger.module.css";
import Translate from "@/components/base/translate/Translate";
import Popover from "@/components/search/advancedSearch/popover/Popover";
import SearchIcon from "@/components/header/icons/search/search";

import Tooltip from "@/components/base/tooltip/Tooltip";

/**
 * Opens advanced search popover
 * @returns
 */
const PopoverTrigger = ({ className, simbleSearchRef }) => {
  const { showPopover, setShowPopover, showInfoTooltip } =
    useAdvancedSearchContext();
  const triggerContainerRef = useRef(null);
  const tooltipRef = useRef(null);
  console.log("showInfoTooltip", showInfoTooltip);
  return (
    <>
      <Popover
        triggerContainerRef={triggerContainerRef}
        simbleSearchRef={simbleSearchRef}
        tooltipRef={tooltipRef}
      />

      <div className="container" ref={triggerContainerRef}>
        <Tooltip
          tooltipRef={tooltipRef}
          show={!showPopover && showInfoTooltip}
          labelToTranslate="advanced-search-tooltip"
          placement="bottom"
        >
          <SearchIcon
            className={`${styles.triggercontainer} ${className} ${
              showPopover ? styles.triggerActive : ""
            }`}
            onClick={() => {
              setShowPopover(!showPopover);
            }}
            title={Translate({ context: "search", label: "advanced" })}
            border={{ top: false, bottom: { keepVisible: true } }}
          />
        </Tooltip>

        {showPopover && <div className={styles.triangle} />}
      </div>
    </>
  );
};

export default PopoverTrigger;
