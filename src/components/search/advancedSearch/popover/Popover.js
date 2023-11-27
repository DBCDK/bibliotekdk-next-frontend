import { useEffect, useRef } from "react";
import AdvancedSearch from "@/components/search/advancedSearch/advancedSearch/AdvancedSearch";
import styles from "./Popover.module.css";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
/**
 * Popover where advanced search can be performed from
 * @returns
 */
const Popover = ({ triggerContainerRef, simbleSearchRef }) => {
  const { showPopover, setShowPopover, setShowInfoTooltip } =
    useAdvancedSearchContext();
  const popppverRef = useRef(null);

  useEffect(() => {
    //hide if user clicks outside the popover.
    function handleClickOutside(event) {
      if (!simbleSearchRef?.current?.contains(event.target)) {
        setShowInfoTooltip(true);
      }
      if (
        popppverRef.current &&
        !popppverRef.current.contains(event.target) &&
        !triggerContainerRef?.current?.contains(event.target)
      ) {
        setShowPopover(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popppverRef]);

  if (!showPopover) {
    return null;
  }
  return (
    <div className={styles.popoverContainer} ref={popppverRef}>
      <AdvancedSearch />
    </div>
  );
};

export default Popover;
