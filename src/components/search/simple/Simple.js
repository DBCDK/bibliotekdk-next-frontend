import React, { useEffect, useState } from "react";

import useHistory from "@/components/hooks/useHistory";
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

import { getQuery as getFiltersFromQuery } from "@/components/hooks/useFilters";

import styles from "./Simple.module.css";
import { DesktopMaterialSelect, MobileMaterialSelect } from "./select";
import { useFacets } from "../advancedSearch/useFacets";
import { useQuickFilters } from "../advancedSearch/useQuickFilters";
import { useAdvancedSearchContext } from "../advancedSearch/advancedSearchContext";

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
  onMaterialSelect,
}) {
  return (
    <>
      {isMobileSize && (
        <MobileMaterialSelect
          className={styles.materialSelectMobile}
          selected={selectedMaterial}
          onSelect={onMaterialSelect}
        />
      )}

      <div className={styles.simplesearch}>
        <DesktopMaterialSelect
          className={styles.select}
          selected={selectedMaterial}
          onSelect={onMaterialSelect}
        />

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
          <FakeSearchInput
            className={styles.fake}
            onClick={(e) => {
              e?.preventDefault();
              onSearch?.();
            }}
          />
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
    </>
  );
}

export default function Wrap({ onCommit = () => {} }) {
  const router = useRouter();
  const { q, setQ, setQuery, getQuery: getQ } = useQ();
  const [query, setQueryState] = useState(q[SuggestTypeEnum.ALL] || "");
  const [history, setHistory, clearHistory] = useHistory();

  const { resetDropdownIndices, dispatchResetMenuItemsEvent } =
    useAdvancedSearchContext();

  const init = getQ()[SuggestTypeEnum.ALL] || "";

  const breakpoint = useBreakpoint();
  const isMobileSize = ["xs", "sm", "md"].includes(breakpoint);
  const isMobileSuggester = isMobileSize && router?.query?.suggester;

  const { resetFacets } = useFacets();
  const { resetQuickFilters } = useQuickFilters();

  // read workTypes directly from the URL (without SWR/useFilters hook subscription)
  const { workTypes } = getFiltersFromQuery(router.query || {});
  const urlWorkType = workTypes?.[0] || SuggestTypeEnum.ALL;

  // local state for selected material type
  const [selectedMaterial, setSelectedMaterial] = useState(urlWorkType);

  // Sync initial query text
  useEffect(() => {
    setQueryState(q[SuggestTypeEnum.ALL] || "");
  }, [q]);

  // Sync selectedMaterial when the URL workType changes (e.g. via back/forward)
  useEffect(() => {
    setSelectedMaterial(urlWorkType);
  }, [urlWorkType]);

  const doSearch = (value = query, suggestion = null) => {
    const queryDiffers = value !== init;
    const workTypeDiffers = urlWorkType !== selectedMaterial;

    if (queryDiffers || workTypeDiffers) {
      const queryKey = "all";
      const method = isMobileSuggester ? "replace" : "push";

      const newQ = isEmpty(value) ? { ...q, all: "" } : { [queryKey]: value };

      const extras = {
        tid: suggestion?.traceId,
        quickfilters: router?.query?.quickfilters,
        // send workType as an extra param – bypassing useFilters
        workTypes:
          selectedMaterial === SuggestTypeEnum.ALL
            ? undefined
            : selectedMaterial,
      };

      // reset facets if WorkType is changed
      resetFacets();
      // remove local quickFilters if WorkType is changed
      resetQuickFilters();
      // exclude quickFilters if WorkType is changed
      delete extras.quickfilters;

      // reset advanced search filters;
      resetDropdownIndices();
      dispatchResetMenuItemsEvent();

      // callback
      onCommit?.(value, selectedMaterial);

      setQuery({
        include: newQ,
        exclude: ["page"],
        pathname: "/find/simpel",
        query: extras,
        method,
      });

      document.activeElement?.blur();

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
      // callback for both MobileMaterialSelect and DesktopMaterialSelect
      onMaterialSelect={setSelectedMaterial}
    />
  );
}
