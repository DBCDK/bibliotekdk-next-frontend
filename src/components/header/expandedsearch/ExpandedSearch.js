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

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

/*const translations = (workType) => {
  return {
    // Get workType specific labels if set, else fallback to a general text
    labelTitle: Translate({
      context: "search",
      label: workType ? `label-${workType}-title` : `label-title`,
    }),
    labelCreator: Translate({
      context: "search",
      label: workType ? `label-${workType}-creator` : `label-creator`,
    }),
    labelSubject: Translate({
      context: "search",
      label: workType ? `label-${workType}-subject` : `label-subject`,
    }),
    placeholderTitle: Translate({
      context: "search",
      label: workType ? `label-${workType}-title` : `label-title`,
    }),
    placeholderCreator: Translate({
      context: "search",
      label: workType ? `label-${workType}-creator` : `label-creator`,
    }),
    placeholderSubject: Translate({
      context: "search",
      label: workType ? `label-${workType}-subject` : `label-subject`,
    }),
  };
};*/

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

export function ExpandedSearch({
  q,
  onChange,
  data,
  onClear,
  doSearch,
  onSelect,
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
                  title={translations(workType).labelTitle}
                  q={q}
                  data={data}
                  onSelect={onSelect}
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
                  title={translations(workType).labelCreator}
                  q={q}
                  data={data}
                  onSelect={onSelect}
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
                  title={translations(workType).labelSubject}
                  q={q}
                  data={data}
                  onSelect={onSelect}
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
                <MoreOptionsLink onSearchClick={expandClick} />
              </span>
            </div>
          </div>
        </form>
      </Collapse>
      <div
        className={`${styles.marginauto} ${collapseOpen ? styles.hide : ""}`}
      >
        <MoreOptionsLink onSearchClick={expandClick} type="showmore" />
      </div>
    </div>
  );
}

export function MoreOptionsLink({ onSearchClick, type }) {
  return (
    <span
      className={
        type === "showmore" ? styles.linkshowmore : styles.linkshowless
      }
    >
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
          <span>
            <Icon
              src="search_blue.svg"
              size={2}
              className={styles.iconinline}
            />
          </span>
          {Translate({
            context: "search",
            label:
              type === "showmore"
                ? "advancedSearchLink"
                : "advancedSearchLinkCount",
          })}
        </Text>
      </Link>
    </span>
  );
}

export function TitleSuggester({
  onChange,
  data,
  onSelect,
  q,
  value = "",
  onClear,
  title = "",
  placeHolder = "",
}) {
  return (
    <div className={styles.suggestionswrap}>
      <Suggester
        id="advanced-search-title"
        data={data}
        onSelect={(val) => {
          onSelect && onSelect(val, "title");
        }}
        onClear={() => onClear && onClear("title")}
        initialValue={value}
      >
        <Input
          className={styles.expandedinput}
          id="search-title"
          dataCy="search-input-title"
          placeholder={title}
          onChange={(e) => {
            onChange && onChange(e?.target?.value, "title");
          }}
          value={q["title"]}
        />
      </Suggester>
    </div>
  );
}

export function CreatorSuggester({
  onChange,
  data,
  onSelect,
  q,
  onClear,
  value = "",
  title,
}) {
  return (
    <div className={styles.suggestionswrap}>
      <Suggester
        id="advanced-search-creator"
        data={data}
        onSelect={(val) => {
          onSelect && onSelect(val, "creator");
        }}
        onClear={() => onClear && onClear("creator")}
        initialValue={value}
      >
        <Input
          className={styles.expandedinput}
          id="search-creator"
          dataCy="search-input-creator"
          placeholder={title}
          onChange={(e) => {
            onChange && onChange(e?.target?.value, "creator");
          }}
        />
      </Suggester>
    </div>
  );
}

export function SubjectSuggester({
  onChange,
  onSelect,
  data,
  onClear,
  q,
  title,
}) {
  return (
    <div className={styles.suggestionswrap}>
      <Suggester
        className={styles.expandedsuggestercontainer}
        id="advanced-search-subject"
        data={data}
        onSelect={(val) => {
          onSelect(val, "subject");
        }}
        onClear={() => onClear && onClear("subject")}
        onChange={(e) => {
          onChange(e?.target?.value, "subject");
        }}
        initialValue={q["subject"]}
      >
        <Input
          className={styles.expandedinput}
          id="search-subject"
          dataCy="search-input-subject"
          placeholder={title}
          onChange={(e) => {
            onChange && onChange(e.target.value, "subject");
          }}
        />
      </Suggester>
    </div>
  );
}

export function initExpanded({ collapseOpen = false, setCollapseOpen }) {
  // connect useQ hook
  const { q, setQ, clearQ, setQuery } = useQ();
  const [type, setType] = useState("all");

  // connected filters hook
  const { filters } = useFilters();

  // extract selected workType, if any
  const workType = filters.workType?.[0];

  // use the useData hook to fetch data
  const query = q[type] ? q[type] : "";
  const { data, isLoading, error } = useData(all({ q: query, workType }));

  const filtered = data?.suggest?.result?.map((obj) => ({
    value: obj.value || obj.title || obj.name,
  }));

  const onReset = () => clearQ({ exclude: ["all"] });

  const doSearch = () => {
    setQuery({ pathname: "/find" });
    document.activeElement.blur();
  };

  const onChange = (val, type) => {
    setType(type);
    setQ({ ...q, [type]: val });
  };

  const onSelect = (val, type) => {
    setQuery({ include: { ...q, [type]: val } });
    document.activeElement.blur();
  };

  const onClear = (type) => {
    setQuery({ include: { ...q, [type]: "" } });
  };

  return {
    q,
    filtered,
    onSelect,
    onChange,
    onReset,
    doSearch,
    workType,
    collapseOpen,
    setCollapseOpen,
  };
}

export default function Wrap({
  router = null,
  headerQuery = "",
  collapseOpen = false,
  setCollapseOpen,
}) {
  const init = initExpanded({
    router,
    headerQuery,
    collapseOpen,
    setCollapseOpen,
  });
  return (
    <ExpandedSearch
      q={init.q}
      data={init.filtered}
      onSelect={init.onSelect}
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
