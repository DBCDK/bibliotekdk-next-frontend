import React, { useRef } from "react";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import styles from "./PopoverTrigger.module.css";
import Translate from "@/components/base/translate/Translate";
import Popover from "@/components/search/advancedSearch/popover/Popover";
import SearchIcon from "../../../../header/icons/search/search";
//import Tooltip from 'react-bootstrap/Tooltip';
import { OverlayTrigger } from "react-bootstrap";
import Tooltip from "@/components/base/tooltip/Tooltip";

/**
 * Opens advanced search popover
 * @returns
 */
const PopoverTrigger = ({ className, simbleSearchRef }) => {
  const { showPopover, setShowPopover, showInfoTooltip, setShowInfoTooltip } =
    useAdvancedSearchContext();
  const triggerContainerRef = useRef(null);
  //set variable in context
  //close if click outside
  console.log("PopoverTrigger.showInfoTooltip", showInfoTooltip);
  return (
    <>
      <Popover
        triggerContainerRef={triggerContainerRef}
        simbleSearchRef={simbleSearchRef}
      />

      <div className="container" ref={triggerContainerRef}>
        <Tooltip
          target={triggerContainerRef}
          show={showInfoTooltip && !showPopover}
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
