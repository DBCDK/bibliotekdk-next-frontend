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
import IconButton from "@/components/base/iconButton/IconButton";
import Text from "@/components/base/text";
import materialTypes from "./materialTypes.json";
import styles from "./MaterialTypeMenu.module.css";
export default function MaterialTypeMenu() {
  return (
    <div className={styles.container}>
      <ul className={styles.dropdownMenu}>
        {materialTypes.map((materialType, index) => {
          const isSelected = 1 === index; //dummy index for selected
          console.log(isSelected);
          return (
            <IconButton
              className={styles.menuItem}
              icon={isSelected ? "arrowrightblue" : null}
              keepUnderline={isSelected}
              iconSize={1}
              onClick={() => {
                if (materialType === "all") {
                  //reset state
                  //Cql worktype=""
                } else {
                  //add to state
                }
              }}
            >
              <Text type="text2">{materialType} </Text>
            </IconButton>
          );
        })}
      </ul>
    </div>
  );
}
