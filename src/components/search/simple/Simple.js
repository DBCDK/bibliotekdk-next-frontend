import React, { useEffect, useState } from "react";

import useHistory from "@/components/hooks/useHistory";
import useFilters from "@/components/hooks/useFilters";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import useQ from "@/components/hooks/useQ";

import Suggester, { blurInput } from "./suggester";
import { openMobileSuggester } from "./suggester/Suggester";
import FakeSearchInput from "./suggester/fakesearchinput";

import { useRouter } from "next/router";
import { SuggestTypeEnum } from "@/lib/enums";
import isEmpty from "lodash/isEmpty";

import Translate from "@/components/base/translate";
import Button from "@/components/base/button";

import styles from "./Simple.module.css";
import { DesktopMaterialSelect } from "./select";

export function SimpleSearch({
  query,
  history,
  selectedMaterial,
  isMobileSize,
  onSelect,
  onChange,
  onKeyDown,
  onClose,
  onSearch,
  clearHistory,
}) {
  return (
    <div className={styles.simplesearch}>
      <DesktopMaterialSelect className={styles.select} />
      <Suggester
        className={styles.suggester}
        history={history}
        clearHistory={clearHistory}
        query={query}
        selectedMaterial={selectedMaterial}
        onSelect={onSelect}
        onChange={onChange}
        dataCy="simple-search-input"
        onClose={onClose}
        onKeyDown={onKeyDown}
      />

      {isMobileSize ? (
        <FakeSearchInput className={styles.fake} />
      ) : (
        <Button
          className={styles.button}
          onClick={(e) => {
            e?.preventDefault();
            onSearch?.();
            blurInput();
          }}
          data-cy="header-searchbutton"
        >
          {Translate({ context: "header", label: "search" })}
        </Button>
      )}
    </div>
  );
}

// ⚙️ "Smart" komponent med al logik
export default function Wrap({ onCommit = () => {} }) {
  const router = useRouter();
  const { getQuery, filters } = useFilters();
  const { q, setQ, setQuery, getQuery: getQ } = useQ();
  const [query, setQueryState] = useState(q[SuggestTypeEnum.ALL] || "");
  const [history, setHistory, clearHistory] = useHistory();

  const init = getQ()[SuggestTypeEnum.ALL] || "";

  const breakpoint = useBreakpoint();
  const isMobileSize = ["xs", "sm", "md"].includes(breakpoint);
  const isMobileSuggester = isMobileSize && router?.query?.suggester;

  const { workTypes } = getQuery();

  // accept null for an answer
  const selectedMaterial = filters?.workTypes?.length
    ? filters?.workTypes?.[0]
    : SuggestTypeEnum.ALL;

  // Sync initial query
  useEffect(() => {
    setQueryState(q[SuggestTypeEnum.ALL] || "");
  }, [q]);

  const doSearch = (value = query, suggestion = null) => {
    // Differs from Url state params
    const queryDiffers = value !== init;
    const workTypeDiffers = workTypes?.[0] !== selectedMaterial;

    if (queryDiffers || workTypeDiffers) {
      const queryKey = "all";
      const method = isMobileSuggester ? "replace" : "push";

      const newQ = isEmpty(value) ? { ...q, all: "" } : { [queryKey]: value };

      const extras = {
        tid: suggestion?.traceId,
        quickfilters: router?.query?.quickfilters,
        workTypes: selectedMaterial,
      };

      // callback
      onCommit?.(value);

      setQuery({
        include: newQ,
        exclude: ["page"],
        pathname: "/find/simpel",
        query: extras,
        method,
      });

      document.activeElement.blur();

      setTimeout(() => {
        setHistory(value);
      }, 300);
    }
  };

  const handleSelect = (suggestionValue, suggestion) => {
    const formattedValue = history.some((t) => t.term === suggestionValue)
      ? suggestionValue
      : `"${suggestionValue}"`;
    doSearch(formattedValue, suggestion);
  };

  const handleChange = (val) => {
    setQueryState(val);
    setQ({ ...q, all: val });
  };

  const handleKeyDown = (e) => {
    if (router?.query?.suggester) {
      if (e.key === "Enter" && !e.preventBubbleHack) {
        doSearch();
      }
    } else {
      openMobileSuggester();
    }
  };

  const handleClose = () => {
    if (router) {
      router.back();
    }
  };

  const filteredHistory = history.filter(({ term }) => term && term !== "");

  return (
    <SimpleSearch
      query={query}
      history={filteredHistory}
      selectedMaterial={selectedMaterial}
      isMobileSize={isMobileSize}
      onSelect={handleSelect}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onClose={handleClose}
      onSearch={() => doSearch()}
      clearHistory={clearHistory}
    />
  );
}
