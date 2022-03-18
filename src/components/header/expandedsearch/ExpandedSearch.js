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

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

const isEmpty = (objectToCheck) => !Object.values(objectToCheck).some((v) => v);

function ExpandedSearch({
  q,
  onChange,
  data,
  doSearch,
  onReset,
  state,
  onClear,
}) {
  const [collapseOpen, setCollapseOpen] = useState(false);

  console.log(state, "EXPANDSTAGE");

  useEffect(() => {
    if (!isEmpty(state) && !collapseOpen) {
      console.log("FISK");
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
        <div className={styles.wrapper}>
          <div className={styles.flex} id="example-collapse-text">
            <TitleSuggester
              data={data}
              q={q}
              onChange={onChange}
              doSearch={doSearch}
              onClear={onClear}
              value={state["title"]}
            />
            <CreatorSuggester
              data={data}
              q={q}
              onChange={onChange}
              doSearch={doSearch}
              onClear={onClear}
              value={state["creator"]}
            />
            <SubjectSuggester
              data={data}
              q={q}
              onChange={onChange}
              doSearch={doSearch}
              onClear={onClear}
              value={state["subject"]}
            />
          </div>

          <div className={styles.flexnav}>
            <div className={styles.buttoninline}>
              <button
                type="button"
                onClick={() => {
                  doSearch();
                }}
                data-cy={cyKey({
                  name: "searchbutton",
                  prefix: "header",
                })}
                className={styles.button}
              >
                <span>{Translate({ context: "header", label: "search" })}</span>
              </button>
            </div>
            <span className={!collapseOpen ? styles.hide : styles.linkshowless}>
              <MoreOptionsLink onSearchClick={expandClick} />
            </span>
          </div>
        </div>
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

function TitleSuggester({ q, onChange, data, doSearch, value = "", onClear }) {
  return (
    <div className={styles.suggesterright}>
      <div className={styles.labelinline}> TITLE:</div>
      <Suggester
        id="advanced-search-title"
        data={data}
        onSelect={(e) => {
          doSearch();
          onChange(e, "title");
        }}
        onClear={() => onClear && onClear("title")}
        initialValue={value}
      >
        <Input
          id="search-title"
          dataCy="search-input-title"
          placeholder={"title"}
          onChange={(e) => {
            console.log("ONCHANGE INPUT");
            const val = e?.target?.value;
            onChange(val, "title");
            if (e.key === "Enter") {
              document.activeElement.blur();
            }
          }}
          value={value}
        />
      </Suggester>
    </div>
  );
}

function CreatorSuggester({
  q,
  onChange,
  data,
  doSearch,
  onClear,
  value = "",
}) {
  return (
    <div className={styles.suggesterright}>
      <div className={styles.labelinline}> CREATOR:</div>
      <Suggester
        id="advanced-search-creator"
        data={data}
        onSelect={(e) => {
          onChange(e, "creator");
          doSearch();
        }}
        onClear={onClear}
        className={styles.suggestionswrap}
        initialValue={value}
      >
        <Input
          id="search-creator"
          dataCy="search-input-creator"
          placeholder={"creators"}
          onChange={(e) => {
            const val = e?.target?.value;
            onChange(val, "creator");
            if (e.key === "Enter") {
              document.activeElement.blur();
            }
          }}
        />
      </Suggester>
    </div>
  );
}

function SubjectSuggester({ q, onChange, data, onClear, value = "" }) {
  return (
    <div className={styles.suggesterright}>
      <div className={styles.labelinline}> SUBJECT:</div>
      <Suggester
        id="advanced-search-subject"
        data={data}
        onSelect={(e) => {
          onChange(e, "subject");
        }}
        onClear={onClear}
        onChange={(e) => {
          const val = e?.target?.value;
          onChange(val, "subject");
        }}
        initialValue={value}
      >
        <Input
          id="search-subject"
          dataCy="search-input-subject"
          placeholder={"subject"}
          onChange={(e) => {
            const val = e?.target?.value;
            onChange(val, "subject");
            if (e.key === "Enter") {
              document.activeElement.blur();
            }
          }}
        />
      </Suggester>
    </div>
  );
}

function cleanParams(params, headerQuery) {
  const ret = {};
  console.log(params, "CLEANPARAMS");
  Object.entries(params).forEach(([key, value]) => {
    if (key === "all" && value !== headerQuery) {
      headerQuery ? (ret[`q.${key}`] = headerQuery) : "";
    } else {
      value ? (ret[`q.${key}`] = value) : "";
    }
  });
  return ret;
}

function cleanInitial(initial, headerQuery) {
  const ret = {};
  Object.entries(initial).forEach(([key, value]) => {
    if (key === "all" && value !== headerQuery) {
      headerQuery ? (ret[key] = headerQuery) : "";
    } else {
      value ? (ret[key] = value) : "";
    }
  });
  return ret;
}

export default function Wrap({ router = null, headerQuery }) {
  const { q: _q, base, setQuery } = useQ();
  const { filters } = useFilters();

  if (!headerQuery && _q.all) {
    headerQuery = _q.all;
  }

  let initial = { ...base, ..._q };

  const [state, setState] = useState({ ...initial });

  useEffect(() => {
    setState({ ...initial });
  }, [_q]);

  const [type, setType] = useState("title");

  // extract selected workType, if any
  const workType = filters.workType?.[0] || null;

  const suggest_q = state[type];

  // use the useData hook to fetch data
  const { data, isLoading, error } = useData(all({ q: suggest_q, workType }));

  const filtered = data?.suggest?.result?.map((obj) => ({
    value: obj.value || obj.title || obj.name,
  }));

  const stateValues = cleanParams(state, headerQuery);
  const paramValues = { ...stateValues, ...filters };

  if (error) {
    return null;
  }
  const onChange = (val, type) => {
    setType(type);
    setState({ ...initial, [type]: val });
  };

  const onReset = () => {
    const clearState = { ...state, creator: "", subject: "", title: "" };
    const stateValues = cleanParams(clearState, headerQuery);
    //const paramValues = { ...stateValues, ...filters };
    router &&
      router["push"]({
        query: stateValues,
      });
  };

  const onClear = (type) => {
    const newState = { ...state, title: "" };
    setState({ ...newState });
    const stateValues = cleanParams(state, headerQuery);
    router &&
      router["push"]({
        query: stateValues,
      });
  };

  const doSearch = () => {
    router &&
      Object.keys(stateValues).length > 0 &&
      router["push"]({
        pathname: "/find",
        query: paramValues,
      });
  };

  return (
    <ExpandedSearch
      data={filtered}
      q={suggest_q}
      onChange={onChange}
      doSearch={doSearch}
      state={state}
      onClear={onClear}
      onReset={onReset}
    />
  );
}
