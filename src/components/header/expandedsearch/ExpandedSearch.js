/**
 * @file Component for specific search on title, creator and subject. Desktop version
 */
import useQ from "@/components/hooks/useQ";
import useFilters from "@/components/hooks/useFilters";
import React, { useEffect } from "react";
import styles from "./ExpandedSearch.module.css";
import { cyKey } from "@/utils/trim";
import Translate from "@/components/base/translate";

import { MoreOptionsLink } from "../utils";
import Collapse from "react-bootstrap/Collapse";
import { expandtranslations as translations } from "@/components/header/expandedsearch/expandedTranslations";
import { SuggestTypeEnum } from "@/lib/enums";

import Label from "@/components/base/forms/label/Label";
import SuggesterTemplate from "@/components/header/expandedsearch/suggestertemplate/SuggesterTemplate";

/**
 * Check if given object has any values.
 * @param objectToCheck
 * @returns {boolean}
 */
export const isEmpty = (objectToCheck) => {
  let empty = true;
  for (const [key, value] of Object.entries(objectToCheck)) {
    if (key === SuggestTypeEnum.ALL) {
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
 * @param workType
 * @param collapseOpen
 * @param setCollapseOpen
 * @returns {React.ReactElement | null}
 */
export function ExpandedSearch({
  workType,
  className,
  collapseOpen,
  setCollapseOpen,
}) {
  const { getQuery } = useQ();

  const queryParams = getQuery();
  useEffect(() => {
    if (!isEmpty(queryParams) && !collapseOpen) {
      setCollapseOpen(true);
    }
  }, [JSON.stringify(queryParams)]);

  const singleSearchInputParams = [
    {
      labelTranslation: translations(workType).labelTitle,
      suggestType: SuggestTypeEnum.TITLE,
    },
    {
      labelTranslation: translations(workType).labelCreator,
      suggestType: SuggestTypeEnum.CREATOR,
    },
    {
      labelTranslation: translations(workType).labelSubject,
      suggestType: SuggestTypeEnum.SUBJECT,
    },
  ];
  const singleSearchInputList = singleSearchInputParams.map(
    ({ labelTranslation, suggestType }) => (
      <SingleSearchInput
        key={suggestType}
        labelTranslation={labelTranslation}
        suggestType={suggestType}
      />
    )
  );

  return (
    <div className={`${styles.flexnav} ${className}`}>
      <Collapse in={collapseOpen} className={styles.wrapper}>
        <div className={styles.wrapper}>
          <div className={styles.flex} id="example-collapse-text">
            {singleSearchInputList}
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

function SingleSearchInput({ labelTranslation, suggestType }) {
  return (
    <div className={styles.suggesterright} key={suggestType}>
      <div className={styles.labelinline}>
        <Label for="advanced-search-title">{labelTranslation}</Label>
      </div>
      <SuggesterTemplate type={suggestType} title={labelTranslation} />
    </div>
  );
}

/**
 * Initialize component. Seperate function for reuse in mobile version. @see /expandedmobile/ExpandedSearchMobile.js
 * Returns parameters to be used.
 *
 * @param {boolean} collapseOpen
 * @param {function} setCollapseOpen
 * @returns {{collapseOpen: boolean, setCollapseOpen: Function, doSearch: doSearch, workTypes: *}}
 */
export function useInitExpanded({ collapseOpen = false, setCollapseOpen }) {
  const { setQuery } = useQ();
  // connected filters hook
  const { filters, types } = useFilters();

  const exclude = types.filter((t) => t !== "workTypes");

  const workTypes = filters.workTypes?.[0];
  const doSearch = () => {
    setQuery({
      pathname: "/find",
      query: { workTypes },
      exclude: ["page", ...exclude],
    });
    document.activeElement.blur();
  };
  return {
    doSearch,
    collapseOpen,
    setCollapseOpen,
    workTypes,
  };
}

/**
 * Wrapper
 *
 * @param {boolean} collapseOpen
 * @param {function} setCollapseOpen
 * @param {string} className
 * @returns {React.ReactElement | null}
 */
export default function Wrap({
  collapseOpen = false,
  setCollapseOpen,
  className = "",
}) {
  const init = useInitExpanded({
    collapseOpen,
    setCollapseOpen,
  });
  return (
    <ExpandedSearch
      workType={init.workTypes}
      className={className}
      collapseOpen={init.collapseOpen}
      setCollapseOpen={init.setCollapseOpen}
    />
  );
}
