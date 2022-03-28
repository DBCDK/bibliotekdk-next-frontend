/**
 * @file Component for specific search on title, creator and subject. Desktop version
 */
import useQ from "@/components/hooks/useQ";
import useFilters from "@/components/hooks/useFilters";
import React, { useEffect, useState } from "react";
import styles from "./ExpandedSearch.module.css";
import { cyKey } from "@/utils/trim";
import Translate from "@/components/base/translate";

import { MoreOptionsLink } from "../utils";
import Collapse from "react-bootstrap/Collapse";
import Label from "@/components/base/forms/label/Label";
import { expandtranslations as translations } from "@/components/header/expandedsearch/expandedTranslations";
import SuggesterTemplate from "@/components/header/expandedsearch/SuggesterTemplate";

/**
 * Check if given object has any values.
 * @param objectToCheck
 * @returns {boolean}
 */
export const isEmpty = (objectToCheck) => {
  let empty = true;
  for (const [key, value] of Object.entries(objectToCheck)) {
    if (key === "all") {
      continue;
    }
    if (value) {
      empty = false;
      break;
    }
  }
  return empty;
};

/**
 * Main component - shows three input fields with suggestions (title, creator, subject). Collapsible
 * @param q
 * @param onChange
 * @param data
 * @param onClear
 * @param doSearch
 * @param onSelect
 * @param workType
 * @param collapseOpen
 * @param setCollapseOpen
 * @returns {JSX.Element}
 * @constructor
 */
export function ExpandedSearch({
  workType,
  className,
  collapseOpen,
  setCollapseOpen,
}) {
  const { getCount, getQuery } = useQ();
  const countQ = getCount({ exclude: ["all"] }).toString();

  const queryParams = getQuery();
  useEffect(() => {
    if (!isEmpty(queryParams) && !collapseOpen) {
      setCollapseOpen(true);
    }
  }, [JSON.stringify(queryParams)]);

  return (
    <div className={`${styles.flexnav} ${className}`}>
      <Collapse in={collapseOpen} className={styles.wrapper}>
        <div className={styles.wrapper}>
          <div className={styles.flex} id="example-collapse-text">
            <div className={styles.suggesterright}>
              <div className={styles.labelinline}>
                <Label for="advanced-search-title">
                  {translations(workType).labelTitle}
                </Label>
              </div>
              <SuggesterTemplate
                type="title"
                title={translations(workType).labelTitle}
              />
            </div>
            <div className={styles.suggesterright}>
              <div className={styles.labelinline}>
                <Label for="advanced-search-title">
                  {translations(workType).labelCreator}
                </Label>
              </div>
              <SuggesterTemplate
                type="creator"
                title={translations(workType).labelCreator}
              />
            </div>
            <div className={styles.suggesterright}>
              <div className={styles.labelinline}>
                <Label for="advanced-search-title">
                  {translations(workType).labelSubject}
                </Label>
              </div>
              <SuggesterTemplate
                type="subject"
                title={translations(workType).labelSubject}
              />
            </div>
          </div>

          <div className={styles.buttonflexnav}>
            <div className={styles.buttoninline}>
              <button
                type="submit"
                data-cy={cyKey({
                  name: "searchbutton",
                  prefix: "header",
                })}
                className={styles.button}
              >
                <span>{Translate({ context: "header", label: "search" })}</span>
                <div className={styles.fill} />
              </button>
            </div>
            <span className={!collapseOpen ? styles.hide : styles.linkshowless}>
              <MoreOptionsLink
                onSearchClick={() => setCollapseOpen(!collapseOpen)}
                className={styles.linkshowless}
              >
                {Translate({
                  context: "search",
                  label: "advancedSearchLinkLess",
                })}
              </MoreOptionsLink>
            </span>
          </div>
        </div>
      </Collapse>
    </div>
  );
}

/**
 * Initialize component. Seperate function for reuse in mobile version. @see /expandedmobile/ExpandedSearchMobile.js
 * Returns parameters to be used.
 *
 * @param collapseOpen
 * @param setCollapseOpen
 * @returns {{q: any, collapseOpen: boolean, filtered: unknown[], onChange: onChange, onClear: onClear, workType: *, setCollapseOpen, onReset: (function(): void), doSearch: doSearch, onSelect: onSelect}}
 */
export function initExpanded({ collapseOpen = false, setCollapseOpen }) {
  const { setQuery } = useQ();
  // connected filters hook
  const { filters } = useFilters();

  const workType = filters.workType?.[0];
  const doSearch = () => {
    setQuery({
      pathname: "/find",
      query: { workType },
    });
    document.activeElement.blur();
  };
  return {
    doSearch,
    collapseOpen,
    setCollapseOpen,
    workType,
  };
}

/**
 * Wrapper
 *
 * @param collapseOpen
 * @param setCollapseOpen
 * @returns {JSX.Element}
 * @constructor
 */
export default function Wrap({
  collapseOpen = false,
  setCollapseOpen,
  className = "",
}) {
  const init = initExpanded({
    collapseOpen,
    setCollapseOpen,
  });
  return (
    <ExpandedSearch
      doSearch={init.doSearch}
      workType={init.workType}
      className={className}
      collapseOpen={init.collapseOpen}
      setCollapseOpen={init.setCollapseOpen}
    />
  );
}
