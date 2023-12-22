import { useEffect, useRef } from "react";
import AdvancedSearch from "@/components/search/advancedSearch/advancedSearch/AdvancedSearch";
import styles from "./Popover.module.css";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import Tooltip from "@/components/base/tooltip/Tooltip";
import SearchIcon from "@/components/header/icons/search/search";
import Translate from "@/components/base/translate/Translate";
import cx from "classnames";

/**
 * Popover where advanced search can be performed from
 * @returns
 */
const Popover = ({ className, simpleSearchRef }) => {
  const {
    showPopover,
    setShowPopover,
    setShowInfoTooltip,
    showInfoTooltip,
    popoverRef,
  } = useAdvancedSearchContext();
  const triggerContainerRef = useRef(null);
  const tooltipRef = useRef(null);

  const handleScrollBarClick = () => {
    //click on scroll bar closes the popover only in safari. This is a hack for solving the popover is closing on safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const viewportWidth = window.innerWidth;
    const clickPositionX = event.clientX;

    return showPopover && isSafari && viewportWidth - clickPositionX <= 10;
  };
  useEffect(() => {
    //hide popover if user clicks outside the popover.
    function handleClickOutside(event) {
      //dont hide popover if click is on scroll bar
      const clickOnScrollBar = handleScrollBarClick(event);
      if (clickOnScrollBar) {
        return;
      }
      //returns true if the click is inside the given ref
      const isClickInsideRef = (ref, target) => ref?.current?.contains(target);
      //if click outside popover and outside trigger, then hide popover
      if (
        !popoverRef?.current?.contains(event.target) &&
        !triggerContainerRef?.current?.contains(event.target)
      ) {
        setShowPopover(false);
      }
      //if click inside simple search, we want to show info tooltip
      if (showPopover && isClickInsideRef(simpleSearchRef, event.target)) {
        if (!isClickInsideRef(triggerContainerRef, event.target)) {
          setShowInfoTooltip(true);
        }
      }
      //else if click is outside the tooltip and the showInfoTooltip is visible, we want to hide it
      if (
        !isClickInsideRef(simpleSearchRef, event.target) &&
        !isClickInsideRef(tooltipRef, event.target)
      ) {
        setShowInfoTooltip(false);
      }

      if (showInfoTooltip && !isClickInsideRef(tooltipRef, event.target)) {
        setShowInfoTooltip(false);
      }
    }
    document.body.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.body.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef, showPopover]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        //hide popover on escape key press
        setShowPopover(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="container" ref={triggerContainerRef}>
        <Tooltip
          childClassName={cx(styles.border_none)}
          tooltipRef={tooltipRef}
          show={!showPopover && showInfoTooltip}
          labelToTranslate="advanced-search-tooltip"
          placement="bottom"
          tabIndex="0"
        >
          <SearchIcon
            className={`${styles.triggercontainer} ${className} ${
              showPopover ? styles.triggerActive : ""
            }`}
            onClick={() => {
              setShowPopover(!showPopover);
            }}
            title={Translate({ context: "search", label: "advanced" })}
          />
        </Tooltip>

        <div
          className={cx(styles.triangle, {
            [styles.showTriangle]: showPopover,
          })}
        />
      </div>

      <div
        aria-expanded={showPopover}
        tabIndex="-1"
        className={cx(styles.popoverContainer, styles.popoverAnimation)}
        ref={popoverRef}
      >
        <AdvancedSearch
          ariaExpanded={showPopover}
          className={cx(styles.popoverAnimation_advancedSearch)}
        />
      </div>
    </>
  );
};

export default Popover;
