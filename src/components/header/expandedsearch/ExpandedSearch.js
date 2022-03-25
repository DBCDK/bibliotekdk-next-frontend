/**
 * @file Component for specific search on title, creator and subject. Desktop version
 */

import Suggester from "@/components/base/suggester/Suggester";
import Input from "@/components/base/forms/input/Input";
import useQ from "@/components/hooks/useQ";
import useFilters from "@/components/hooks/useFilters";
import React, { useEffect, useState } from "react";
import { useData } from "@/lib/api/api";
import { all } from "@/lib/api/suggest.fragments";
import styles from "./ExpandedSearch.module.css";
import { cyKey } from "@/utils/trim";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon/Icon";
import Text from "@/components/base/text/Text";
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
  doSearch,
  workType,
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

  const expandClick = () => {
    setCollapseOpen(!collapseOpen);
  };

  return (
    <div className={styles.flexnav}>
      <Collapse in={collapseOpen} className={styles.wrapper}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            doSearch();
          }}
        >
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
                  <span>
                    {Translate({ context: "header", label: "search" })}
                  </span>
                </button>
              </div>
              <span
                className={!collapseOpen ? styles.hide : styles.linkshowless}
              >
                <MoreOptionsLink
                  onSearchClick={expandClick}
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
        </form>
      </Collapse>
      <div
        className={`${styles.marginauto} ${collapseOpen ? styles.hide : ""}`}
      >
        <MoreOptionsLink
          onSearchClick={expandClick}
          className={styles.linkshowmore}
        >
          {Translate({
            context: "search",
            label: "advancedSearchLink",
          })}
        </MoreOptionsLink>
      </div>
    </div>
  );
}

export function MoreOptionsLink({ onSearchClick, className = "", children }) {
  return (
    <span className={className}>
      <Link
        tabIndex="-1"
        onClick={() => onSearchClick()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.keyCode === 13) {
            onSearchClick();
          }
        }}
        border={{ bottom: { keepVisible: true } }}
      >
        <Text type="text3" tag="span">
          {children}
        </Text>
      </Link>
    </span>
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
export default function Wrap({ collapseOpen = false, setCollapseOpen }) {
  const init = initExpanded({
    collapseOpen,
    setCollapseOpen,
  });
  return (
    <ExpandedSearch
      doSearch={init.doSearch}
      collapseOpen={init.collapseOpen}
      setCollapseOpen={init.setCollapseOpen}
    />
  );
}
