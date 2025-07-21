import React, { useEffect, useRef, useState } from "react";

import useHistory from "@/components/hooks/useHistory";
import useFilters from "@/components/hooks/useFilters";

import Suggester, { focusInput, blurInput } from "./suggester";

import { useModal } from "@/components/_modal";

import { DesktopMaterialSelect } from "@/components/search/select";

import { useRouter } from "next/router";
import { SuggestTypeEnum } from "@/lib/enums";
import isEmpty from "lodash/isEmpty";
import useBreakpoint from "@/components/hooks/useBreakpoint";

import useAuthentication from "@/components/hooks/user/useAuthentication";

import Translate from "@/components/base/translate";
import Button from "@/components/base/button";
import useQ from "@/components/hooks/useQ";

import styles from "./Simple.module.css";

export function SimpleSearch({ story = false }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthentication();
  const modal = useModal();
  const filters = useFilters();

  const { q, setQ, setQuery } = useQ();
  const [query, setQueryState] = useState(q[SuggestTypeEnum.ALL] || "");

  const [history, setHistory, clearHistory] = useHistory();

  const { workTypes } = filters.getQuery();
  const selectedMaterial = workTypes[0] || SuggestTypeEnum.ALL;

  const breakpoint = useBreakpoint();
  const isMobileSize = ["xs", "sm", "md"].includes(breakpoint);

  const suggesterVisibleMobile =
    (story && story.suggesterVisibleMobile) ||
    (isMobileSize && router && router.query.suggester);

  const suggesterVisibleMobileClass = suggesterVisibleMobile
    ? styles.suggester__visible
    : "";

  // Sync q.all into internal state on mount
  useEffect(() => {
    setQueryState(q[SuggestTypeEnum.ALL] || "");
  }, [q]);

  const doSearch = (value, suggestion) => {
    const querykey = "all";
    const method = suggesterVisibleMobile ? "replace" : "push";

    const type = {
      tid: suggestion?.traceId,
      workTypes:
        selectedMaterial !== SuggestTypeEnum.ALL ? selectedMaterial : null,
    };

    const newQ = isEmpty(value) ? { ...q, all: "" } : { [querykey]: value };

    setQuery({
      include: newQ,
      exclude: ["page"],
      pathname: "/find",
      query: type,
      method,
    });

    document.activeElement.blur();

    setTimeout(() => {
      setHistory(value);
    }, 300);
  };

  const keyPressed = (e) => {
    if (e.key === "Enter" && !e.preventBubbleHack) {
      doSearch(query);
    }
  };

  return (
    <div className={styles.simplesearch}>
      <DesktopMaterialSelect className={styles.select} />

      <div
        className={`${styles.suggester__wrap} ${suggesterVisibleMobileClass}`}
      >
        <Suggester
          className={`${styles.suggester}`}
          history={history}
          clearHistory={clearHistory}
          isMobile={suggesterVisibleMobile}
          query={query}
          selectedMaterial={selectedMaterial}
          onSelect={(suggestionValue, suggestion) => {
            const formatedValue = history?.some(
              (t) => t.term === suggestionValue
            )
              ? suggestionValue
              : `"${suggestionValue}"`;

            doSearch(formatedValue, suggestion);
          }}
          onChange={(val) => {
            setQueryState(val);
            setQ({ ...q, all: val });
          }}
          dataCy="simple-search-input"
          onClose={() => {
            if (router) {
              router.back();
            }
            story && story.setSuggesterVisibleMobile(false);
          }}
          onKeyDown={keyPressed}
        />
      </div>

      <Button
        className={`${styles.button}`}
        onClick={(e) => {
          e?.preventDefault();
          doSearch(query);

          story && alert(`/find?q.all=${query}`);
          story && story.setSuggesterVisibleMobile(false);
          blurInput();
        }}
        data-cy="header-searchbutton"
      >
        {Translate({ context: "header", label: "search" })}
      </Button>
    </div>
  );
}

export default function Wrap() {
  return <SimpleSearch />;
}
