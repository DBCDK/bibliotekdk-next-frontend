/**
 * @file Component for specific search on title, creator and subject. Mobile version
 */

import SuggesterTemplate from "../expandedsearch/suggestertemplate/SuggesterTemplate";
import { isEmpty, useInitExpanded } from "../expandedsearch/ExpandedSearch";
import React, { useEffect } from "react";
import styles from "./ExpandedSearchMobile.module.css";
import Collapse from "react-bootstrap/Collapse";
import { cyKey } from "@/utils/trim";
import Translate from "@/components/base/translate";
import { expandtranslations as translations } from "@/components/header/expandedsearch/expandedTranslations";
import Label from "@/components/base/forms/label/Label";
import useQ from "@/components/hooks/useQ";
import { SuggestTypeEnum } from "@/lib/enums";

import { MoreOptionsLink } from "../utils";

/**
 * Main component - shows three input fields with suggestions (title, creator, subject). Collapsible
 * @param q
 * @param doSearch
 * @param workType
 * @param collapseOpen
 * @param setCollapseOpen
 * @returns {React.JSX.Element}
 */
function ExpandedSearchMobile({
  doSearch,
  workType,
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

  const expandClick = () => {
    setCollapseOpen(!collapseOpen);
  };

  return (
    <div data-cy="expanded-search-mobile">
      <Collapse in={collapseOpen} className={styles.wrapper}>
        <div>
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
                    type={SuggestTypeEnum.TITLE}
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
                    type={SuggestTypeEnum.CREATOR}
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
                    type={SuggestTypeEnum.SUBJECT}
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
                  <MoreOptionsLink onSearchClick={expandClick}>
                    {Translate({
                      context: "search",
                      label: "advancedSearchLinkLess",
                    })}
                  </MoreOptionsLink>
                </span>
              </div>
            </div>
          </form>
        </div>
      </Collapse>
      <div
        className={`${styles.marginauto} ${collapseOpen ? styles.hide : ""}`}
      >
        <MoreOptionsLink onSearchClick={expandClick} type="showmore">
          {Translate({
            context: "search",
            label: "advancedSearchLink",
          })}
        </MoreOptionsLink>
      </div>
    </div>
  );
}

/**
 * Wrapper
 * @param props
 * @returns {React.JSX.Element}
 */
export default function Wrap(props) {
  const init = useInitExpanded(props);

  return (
    <ExpandedSearchMobile
      doSearch={init.doSearch}
      collapseOpen={props.collapseOpen}
      setCollapseOpen={props.setCollapseOpen}
      workType={init.workType}
    />
  );
}
