import { StoryTitle, StoryDescription } from "@/storybook";

import AdvancedSearchPopover from "@/components/search/advancedSearch/popover/Popover";
import styles from "./Popover.module.css";

const exportedObject = {
  title: "AdvancedSearch/Popover",
};

export function Default() {
  const popoverTriggerContainer = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    height: "56px",
    // marginTop: "449px"
  };

  const advancedSearchTrigger = {
    marginLeft: "16px",
  };

  return (
    <div>
      <StoryTitle>Advanced Search Popover</StoryTitle>
      <StoryDescription>Search Popover</StoryDescription>
      <div className={styles.popoverTriggerContainer}>
        <AdvancedSearchPopover
          className={styles.advancedSearchTrigger}
          //  simpleSearchRef={simpleSearchRef}
        />
      </div>
    </div>
  );
}

export default exportedObject;
