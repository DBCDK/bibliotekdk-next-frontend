// components/Popover.js
import { useEffect, useRef, useState } from "react";
import AdvancedSearch from "@/components/search/advancedSearch/advancedSearch/AdvancedSearch";
import styles from "./Popover.module.css";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
/**
 * Popover where advanced search can be performed
 * @returns
 */
const Popover = ({ triggerContainerRef }) => {
  const { showOver, setShowOver } = useAdvancedSearchContext();
  const popppverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      console.log("(event.target", event.target);
      if (
        popppverRef.current &&
        !popppverRef.current.contains(event.target) &&
        !triggerContainerRef.current.contains(event.target)
      ) {
        setShowOver(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popppverRef]);

  if (!showOver) {
    return null;
  }
  return (
    <div className={styles.popoverContainer} ref={popppverRef}>
      {/* <div className={styles.popoverContent}> */}

      <AdvancedSearch />
      {/* </div> */}
    </div>
  );
};

export default Popover;
