/**
 * @file
 * This file render a menu for selection of material type in advanced search popover.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

import IconButton from "@/components/base/iconButton/IconButton";
import Text from "@/components/base/text";
import workTypes from "./workTypes.json";
import styles from "./MaterialTypeMenu.module.css";
import Translate from "@/components/base/translate/Translate";
export default function MaterialTypeMenu() {
  //[workType, setWorkType]
  const { workType, setWorkType } = useAdvancedSearchContext();
  return (
    <div className={styles.container}>
      <ul className={styles.dropdownMenu}>
        {workTypes.map((type, index) => {
          const isSelected = type === workType; //dummy index for selected
          return (
            <IconButton
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
      </ul>
    </div>
  );
}
