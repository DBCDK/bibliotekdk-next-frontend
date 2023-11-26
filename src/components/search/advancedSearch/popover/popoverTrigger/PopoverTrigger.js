// components/Popover.js
import React, { useMemo, useRef, useState } from "react";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
//import SearchIcon from "./icons/search";
import SearchSvg from "@/public/icons/search.svg";
import animations from "css/animations";
import styles from "./PopoverTrigger.module.css";
import Icon from "@/components/base/icon";
import Action from "@/components/base/action";
import Translate from "@/components/base/translate/Translate";
import Text from "@/components/base/text/Text";
import Popover from "@/components/search/advancedSearch/popover/Popover";
import Tooltip from "@/components/base/tooltip/Tooltip";

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
      <div className="container">
        {false && <div className={styles.tip} />}
        {/* <Tooltip
          labelToTranslate="advanced-search-tooltip"
          placement="bottom"
          show={true}
          className={styles.tooltipStyle}
        > */}
        <div
          ref={triggerContainerRef}
          className={`${styles.triggercontainer} ${className}`}
          onClick={() => {
            setShowOver(!showOver);
          }}
        >
          <Icon
            size={{ w: "auto", h: 3 }}
            alt=""
            className={`${styles.arrow} ${animations["h-bounce-right"]} ${animations["f-bounce-right"]}`}
          >
            <SearchSvg />
          </Icon>
          <Text className={styles.triggerText}>
            {" "}
            {Translate({ context: "search", label: "advanced" })}{" "}
          </Text>
        </div>
        {/* </Tooltip> */}
        {showOver && <div className={styles.triangle} />}
      </div>
    </>
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
