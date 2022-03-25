/**
 * @file Component for specific search on title, creator and subject. Mobile version
 */

import {
  CreatorSuggester,
  initExpanded,
  SubjectSuggester,
  TitleSuggester,
  isEmpty,
} from "../expandedsearch/ExpandedSearch";
import React, { useEffect } from "react";
import styles from "@/components/header/expandedsearchmobile/ExpandedSearchMobile.module.css";
import Collapse from "react-bootstrap/Collapse";
import { cyKey } from "@/utils/trim";
import Translate from "@/components/base/translate";
import { expandtranslations as translations } from "@/components/header/expandedsearch/expandedTranslations";
import Label from "@/components/base/forms/label/Label";

import { MoreOptionsLink } from "../utils";

/**
 * Main component - shows three input fields with suggestions (title, creator, subject). Collapsible
 * @param q
 * @param onChange
 * @param data
 * @param onClear
 * @param doSearch
 * @param onReset
 * @param workType
 * @param collapseOpen
 * @param setCollapseOpen
 * @returns {JSX.Element}
 * @constructor
 */
function ExpandedSearchMobile({
  q,
  onChange,
  data,
  onClear,
  doSearch,
  onReset,
  workType,
  collapseOpen,
  setCollapseOpen,
}) {
  //const [collapseOpen, setCollapseOpen] = useState(false);
  useEffect(() => {
    if (!isEmpty(q) && !collapseOpen) {
      setCollapseOpen(true);
    }
  }, [q]);

  const expandClick = () => {
    if (collapseOpen) {
      onReset();
    }
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
                <TitleSuggester
                  q={q}
                  title={translations(workType).labelTitle}
                  data={data}
                  onChange={onChange}
                  onClear={onClear}
                  value={q["title"]}
                />
              </div>
              <div className={styles.suggesterright}>
                <div className={styles.labelinline}>
                  <Label for="advanced-search-title">
                    {translations(workType).labelCreator}
                  </Label>
                </div>
                <CreatorSuggester
                  q={q}
                  title={translations(workType).labelCreator}
                  data={data}
                  onChange={onChange}
                  onClear={onClear}
                  value={q["creator"]}
                />
              </div>
              <div className={styles.suggesterright}>
                <div className={styles.labelinline}>
                  <Label for="advanced-search-title">
                    {translations(workType).labelSubject}
                  </Label>
                </div>
                <SubjectSuggester
                  q={q}
                  title={translations(workType).labelSubject}
                  data={data}
                  onChange={onChange}
                  onClear={onClear}
                  value={q["subject"]}
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
 * @returns {JSX.Element}
 */
export default function wrap(props) {
  const init = initExpanded(props);

  return (
    <ExpandedSearchMobile
      q={init.q}
      data={init.filtered}
      onChange={init.onChange}
      onClear={init.onClear}
      onReset={init.onReset}
      doSearch={init.doSearch}
      workType={init.workType}
      collapseOpen={init.collapseOpen}
      setCollapseOpen={init.setCollapseOpen}
    />
  );
}
