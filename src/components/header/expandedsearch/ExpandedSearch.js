import Suggester from "@/components/base/suggester/Suggester";
import Input from "@/components/base/forms/input/Input";
import useQ from "@/components/hooks/useQ";
import useFilters from "@/components/hooks/useFilters";
import React, { useState } from "react";
import { useData } from "@/lib/api/api";
import { all } from "@/lib/api/suggest.fragments";
import styles from "./ExpandedSearch.module.css";
import { cyKey } from "@/utils/trim";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon/Icon";
import Text from "@/components/base/text/Text";

function ExpandedSearch({ q, onChange, data, doSearch }) {
  const [showExpandedSearch, setShowExpandedSearch] = useState(false);
  return (
    <div>
      <div
        className={
          showExpandedSearch ? styles.showexpanded : styles.hideexpanded
        }
      >
        <div className={styles.flex}>
          <TitleSuggester data={data} q={q} onChange={onChange} />

          <CreatorSuggester data={data} q={q} onChange={onChange} />
          <SubjectSuggester data={data} q={q} onChange={onChange} />
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
          <div className={styles.marginauto}>
            <MoreOptionsLink
              countQ={0}
              onSearchClick={() => {
                setShowExpandedSearch(!showExpandedSearch);
              }}
              type="showless"
            />
          </div>
        </div>
      </div>
      <div className={styles.flex}>
        <div
          className={
            showExpandedSearch ? styles.hideexpanded : styles.showexpanded
          }
        >
          <MoreOptionsLink
            onSearchClick={() => {
              setShowExpandedSearch(!showExpandedSearch);
            }}
            type="showmore"
          />
        </div>
      </div>
    </div>
  );
}

function MoreOptionsLink({ onSearchClick, type }) {
  return (
    <div className={styles.flex}>
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
    </div>
  );
}

export function TitleSuggester({ q, onChange, data }) {
  return (
    <div className={styles.suggesterright}>
      <div className={styles.labelinline}> TITLE:</div>
      <Suggester
        id="advanced-search-title"
        data={data}
        onSelect={(e) => {
          onChange(e, "title");
        }}
        onClear={() => {
          onChange("", "title");
        }}
      >
        <Input
          id="search-title"
          dataCy="search-input-title"
          placeholder={"title"}
          onChange={(e) => {
            const val = e?.target?.value;
            onChange(val, "title");
          }}
        />
      </Suggester>
    </div>
  );
}

export function CreatorSuggester({ q, onChange, data }) {
  return (
    <div className={styles.suggesterright}>
      <div className={styles.labelinline}> CREATOR:</div>
      <Suggester
        id="advanced-search-creator"
        data={data}
        onSelect={(e) => {
          onChange(e, "creator");
        }}
        onClear={() => {
          onChange("", "creator");
        }}
        className={styles.suggestionswrap}
      >
        <Input
          id="search-creator"
          dataCy="search-input-creator"
          placeholder={"creators"}
          onChange={(e) => {
            const val = e?.target?.value;
            onChange(val, "creator");
          }}
        />
      </Suggester>
    </div>
  );
}

export function SubjectSuggester({ q, onChange, data }) {
  return (
    <>
      <div className={styles.labelinline}> SUBJECT:</div>
      <Suggester
        id="advanced-search-subject"
        data={data}
        onSelect={(e) => {
          onChange(e, "subject");
        }}
        onClear={() => {
          onChange("", "subject");
        }}
      >
        <Input
          id="search-subject"
          dataCy="search-input-subject"
          placeholder={"subject"}
          onChange={(e) => {
            const val = e?.target?.value;
            onChange(val, "subject");
          }}
        />
      </Suggester>
    </>
  );
}

function cleanParams(params) {
  const ret = {};
  Object.entries(params).forEach(([key, value]) =>
    value ? (ret[`q.${key}`] = value) : ""
  );
  console.log(ret, "PARAMS");
  return ret;
}

export default function Wrap({ router = null, show }) {
  const { q: _q, base } = useQ();

  console.log(_q, "Q");

  const { filters } = useFilters();

  console.log(filters, "FILTERS");

  const [state, setState] = useState({ ...base, ..._q });
  const [type, setType] = useState("title");

  // extract selected workType, if any
  const workType = filters.workType?.[0] || null;

  const q = state[type];

  // use the useData hook to fetch data
  const { data, isLoading, error } = useData(all({ q, workType }));

  const filtered = data?.suggest?.result?.map((obj) => ({
    value: obj.value || obj.title || obj.name,
  }));

  // const params = { ["q.all"]: "fisk" };
  const stateValues = cleanParams(state);
  const paramValues = { ...stateValues, ...filters };
  const doSearch = () => {
    router &&
      Object.keys(paramValues).length > 0 &&
      router["push"]({
        pathname: "/find",
        query: paramValues,
      });
  };

  if (error) {
    return null;
  }

  return (
    <ExpandedSearch
      data={filtered}
      q={q}
      onChange={(val, type) => {
        setType(type);
        setState({ ...state, [type]: val });
      }}
      doSearch={doSearch}
      show={show}
    />
  );
}
