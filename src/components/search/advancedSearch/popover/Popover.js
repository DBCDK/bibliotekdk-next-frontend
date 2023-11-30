import { useEffect, useRef } from "react";
import AdvancedSearch from "@/components/search/advancedSearch/advancedSearch/AdvancedSearch";
import styles from "./Popover.module.css";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import Tooltip from "@/components/base/tooltip/Tooltip";
import SearchIcon from "@/components/header/icons/search/search";
import Translate from "@/components/base/translate/Translate";

/**
 * Popover where advanced search can be performed from
 * @returns
 */
const Popover = ({ className, simpleSearchRef }) => {
  const { showPopover, setShowPopover, setShowInfoTooltip, showInfoTooltip } =
    useAdvancedSearchContext();
  const popoverRef = useRef(null);
  const triggerContainerRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    //hide if user clicks outside the popover.
    function handleClickOutside(event) {
      //returns true if the click is inside the given ref
      const isClickInsideRef = (ref, target) => ref?.current?.contains(target);
      //if click outside popover and outside trigger, then hide popover
      if (
        !popoverRef?.current?.contains(event.target) &&
        !triggerContainerRef?.current?.contains(event.target)
      ) {
        setShowPopover(false);
      }
      //if click inside simple search, we want to show info tooltip
      if (showPopover && isClickInsideRef(simpleSearchRef, event.target)) {
        if (!isClickInsideRef(triggerContainerRef, event.target)) {
          setShowInfoTooltip(true);
        }
      }
      //else if click is outside the tooltip and the showInfoTooltip is visible, we want to hide it
      if (
        !isClickInsideRef(simpleSearchRef, event.target) &&
        !isClickInsideRef(tooltipRef, event.target)
      ) {
        setShowInfoTooltip(false);
      }

      if (showInfoTooltip && !isClickInsideRef(tooltipRef, event.target)) {
        setShowInfoTooltip(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef, showPopover]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        //hide popover on escape key press
        setShowPopover(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {showPopover && (
        <div className={styles.popoverContainer} ref={popoverRef}>
          <AdvancedSearch />
        </div>
      )}

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

export default Popover;
