/**
 * @file
 * This file render a menu for selection of material type in advanced search popover.
 */

import React from "react";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

import IconButton from "@/components/base/iconButton/IconButton";
import Text from "@/components/base/text";
import workTypes from "./workTypes.json";
import styles from "./MaterialTypeMenu.module.css";
import Translate from "@/components/base/translate/Translate";
export default function MaterialTypeMenu() {
  const { workType, setWorkType } = useAdvancedSearchContext();
  return (
    <div className={styles.dropdownMenu}>
      {workTypes.map((type) => {
        const isSelected = type === workType;
        return (
          <IconButton
            key={type}
            className={styles.menuItem}
            icon={isSelected ? "arrowrightblue" : null}
            keepUnderline={isSelected}
            iconSize={1}
            onClick={() => {
              setWorkType(type);
            }}
          >
            <Text type={isSelected ? "text4" : "text3"}>
              {Translate({
                context: "advanced_search_worktypes",
                label: type,
              })}
            </Text>
          </IconButton>
        );
      })}
    </div>
  );
}
