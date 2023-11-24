// components/Popover.js
import React, { useMemo, useState } from "react";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
//import SearchIcon from "./icons/search";
import SearchSvg from "@/public/icons/search.svg";
import animations from "css/animations";
import styles from "./PopoverTrigger.module.css";
import Icon from "@/components/base/icon";
import Action from "@/components/base/action";
import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text/Text";

/**
 * Opens advanced search popover
 * @returns
 */
const PopoverTrigger = ({ className }) => {
  const { showOver, setShowOver } = useAdvancedSearchContext();

  return (
    <div
      className={`${styles.triggercontainer} ${className}`}
      onClick={() => setShowOver(!showOver)}
    >
      <Icon
        size={{ w: "auto", h: 3 }}
        alt=""
        className={`${styles.arrow} ${animations["h-bounce-right"]} ${animations["f-bounce-right"]}`}
      >
        <SearchSvg />
      </Icon>
      <Text> {Translate({ context: "search", label: "advanced" })} </Text>
    </div>
  );
  //   return (
  //     <Action
  //       data-icon-type="search"
  //       title={Translate({ context: "search", label: "advanced" })}
  //       onClick={() => setShowOver(!showOver)}
  //     >
  //       <Icon src="search.svg" alt="" />
  //     </Action>
  //   );
};

export default PopoverTrigger;
