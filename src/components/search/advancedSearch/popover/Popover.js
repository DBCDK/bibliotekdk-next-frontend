// components/Popover.js
import { useState } from "react";
import AdvancedSearch from "@/components/search/advancedSearch/advancedSearch/AdvancedSearch";
import AdvancedSearchProvider from "@/components/search/advancedSearch/advancedSearchContext";
import styles from "./Popover.module.css";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

const Popover = () => {
  const { showPopup } = useAdvancedSearchContext();
console.log('Popover.showPopup',showPopup)
  if (!showPopup) {
    return null;
  }
  return (
    <div className={styles.popoverContainer}>
      <AdvancedSearchProvider>
        <AdvancedSearch />
      </AdvancedSearchProvider>
      {/* Popover content goes here */}
      This is a popover!
    </div>
  );
};

export default Popover;
