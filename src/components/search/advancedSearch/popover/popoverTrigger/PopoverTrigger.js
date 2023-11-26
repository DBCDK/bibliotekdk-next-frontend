import React, { useRef } from "react";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import styles from "./PopoverTrigger.module.css";
import Translate from "@/components/base/translate/Translate";
import Popover from "@/components/search/advancedSearch/popover/Popover";
import SearchIcon from "../../../../header/icons/search/search";

/**
 * Opens advanced search popover
 * @returns
 */
const PopoverTrigger = ({ className }) => {
  const { showOver, setShowOver } = useAdvancedSearchContext();
  const triggerContainerRef = useRef(null);

  return (
    <>
      <Popover triggerContainerRef={triggerContainerRef} />
      <div className="container" ref={triggerContainerRef}>
        <SearchIcon
          className={`${styles.triggercontainer} ${className}`}
          onClick={() => {
            setShowOver(!showOver);
          }}
          title={Translate({ context: "search", label: "advanced" })}
          border={{ top: false, bottom: { keepVisible: true } }}
        />

        {showOver && <div className={styles.triangle} />}
      </div>
    </>
  );
};

export default PopoverTrigger;
