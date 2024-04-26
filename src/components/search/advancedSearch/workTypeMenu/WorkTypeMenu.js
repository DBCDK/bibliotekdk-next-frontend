/**
 * @file
 * This file render a menu for selection of work type in advanced search popover.
 */

import React from "react";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

import IconButton from "@/components/base/iconButton/IconButton";
import Link from "@/components/base/link/Link";

import Text from "@/components/base/text";
import workTypes from "./workTypes.json";
import styles from "./WorkTypeMenu.module.css";
import Translate from "@/components/base/translate/Translate";
export default function WorkTypeMenu() {
  const { workType, setWorkType } = useAdvancedSearchContext();
  return (
    <div className={styles.dropdownMenu}>
      {workTypes.map((type) => {
        const isSelected = type === workType;
        const Tag = isSelected ? IconButton : Link;
        return (
          <Tag
            key={type}
            className={styles.menuItem}
            icon="arrowrightblue"
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
          </Tag>
        );
      })}
    </div>
  );
}
