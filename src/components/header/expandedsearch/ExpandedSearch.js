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

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const translations = (workType) => {
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
};

const isEmpty = (objectToCheck) => {
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

function ExpandedSearch({
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
              <TitleSuggester
                q={q}
                title={translations(workType).labelTitle}
                data={data}
                onChange={onChange}
                onClear={onClear}
                value={q["title"]}
              />
              <CreatorSuggester
                q={q}
                title={translations(workType).labelCreator}
                data={data}
                onChange={onChange}
                onClear={onClear}
                value={q["creator"]}
              />
              <SubjectSuggester
                q={q}
                title={translations(workType).labelSubject}
                data={data}
                onChange={onChange}
                onClear={onClear}
                value={q["subject"]}
              />
            </div>

            <div className={styles.flexnav}>
              <div className={styles.buttoninline}>
                <button
                  type="submit"
                  onClick={() => {
                    doSearch();
                  }}
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

function MoreOptionsLink({ onSearchClick, type }) {
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

function TitleSuggester({
  onChange,
  data,
  q,
  value = "",
  onClear,
  title = "",
  placeHolder = "",
}) {
  return (
    <div className={styles.suggesterright}>
      <div className={styles.labelinline}>
        <Label for="advanced-search-title">{title}</Label>
      </div>
      <Suggester
        id="advanced-search-title"
        data={data}
        onSelect={(e) => {
          onChange && onChange(e, "title");
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

function CreatorSuggester({
  onChange,
  data,
  q,
  onClear,
  value = "",
  title = "",
}) {
  return (
    <div className={styles.suggesterright}>
      <div className={styles.labelinline}>
        <Label for="advanced-search-title">{title}</Label>
      </div>
      <Suggester
        id="advanced-search-creator"
        data={data}
        onSelect={(e) => {
          onChange && onChange(e, "creator");
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

function SubjectSuggester({ onChange, data, onClear, q, title = "" }) {
  return (
    <div className={styles.suggesterright}>
      <div className={styles.labelinline}>
        <Label for="advanced-search-title">{title}</Label>
      </div>
      <Suggester
        className={styles.expandedsuggestercontainer}
        id="advanced-search-subject"
        data={data}
        onSelect={(e) => {
          onChange(e, "subject");
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

function cleanParams(params, headerQuery) {
  const ret = {};
  if (!params["all"] && headerQuery) {
    params["all"] = headerQuery;
  }
  Object.entries(params).forEach(([key, value]) => {
    if (key === "all" && value !== headerQuery) {
      headerQuery ? (ret[key] = headerQuery) : "";
    } else {
      value ? (ret[key] = value) : "";
    }
  });

  return ret;
}

export default function Wrap({
  router = null,
  headerQuery,
  collapseOpen,
  setCollapseOpen,
}) {
  // connect useQ hook
  const { q, setQ, clearQ, setQuery } = useQ();
  const [type, setType] = useState("all");

  // connected filters hook
  const { filters } = useFilters();

  // extract selected workType, if any
  const workType = filters.workType?.[0];

  // preserve query from eg frontpage
  if (!headerQuery && q.all) {
    headerQuery = q.all;
  }

  // use the useData hook to fetch data
  const query = q[type] ? q[type] : "";
  const { data, isLoading, error } = useData(all({ q: query, workType }));

  const filtered = data?.suggest?.result?.map((obj) => ({
    value: obj.value || obj.title || obj.name,
  }));

  const onReset = () => clearQ({ exclude: ["all"] });

  // we need to check the 'all' query params - it might not be set
  // eg. if a subject is selected from frontpage
  const expandedSearchParams = cleanParams(q, headerQuery);
  setQ({ ...expandedSearchParams });

  const doSearch = () => {
    setQuery({ pathname: "/find" });
  };

  const onChange = (val, type) => {
    setType(type);
    setQ({ ...q, [type]: val });
  };

  const onClear = (type) => {
    setQ({ ...q, [type]: "" });
  };

  return (
    <ExpandedSearch
      q={q}
      data={filtered}
      onChange={onChange}
      onClear={onClear}
      onReset={onReset}
      doSearch={doSearch}
      workType={workType}
      collapseOpen={collapseOpen}
      setCollapseOpen={setCollapseOpen}
    />
  );
}
