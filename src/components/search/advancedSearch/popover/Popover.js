// components/Popover.js
import { useState } from "react";
import AdvancedSearch from "@/components/search/advancedSearch/advancedSearch/AdvancedSearch";
import styles from "./Popover.module.css";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
/**
 * Popover where advanced search can be performed
 * @returns
 */
const Popover = () => {
  const { showOver } = useAdvancedSearchContext();
  if (!showOver) {
    return null;
  }
  return (
    <div className={styles.popoverContainer}>
      <AdvancedSearch />
    </div>
  );
};

export default Popover;
