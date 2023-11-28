import { useEffect, useRef } from "react";
import AdvancedSearch from "@/components/search/advancedSearch/advancedSearch/AdvancedSearch";
import styles from "./Popover.module.css";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
/**
 * Popover where advanced search can be performed from
 * @returns
 */
const Popover = ({ triggerContainerRef, simpleSearchRef, tooltipRef }) => {
  const { showPopover, setShowPopover, setShowInfoTooltip } =
    useAdvancedSearchContext();
  const popoverRef = useRef(null);

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
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef, showPopover]);

  if (!showPopover) {
    return null;
  }
  return (
    <div className={styles.popoverContainer} ref={popoverRef}>
      <AdvancedSearch />
    </div>
  );
};

export default Popover;
