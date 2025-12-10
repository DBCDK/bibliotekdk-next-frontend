// components/search/advancedSearch/workTypeMenu/WorkTypeMenu.jsx
import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";

import IconButton from "@/components/base/iconButton/IconButton";
import Link from "@/components/base/link/Link";
import Text from "@/components/base/text";
import workTypes from "./workTypes.json";
import styles from "./WorkTypeMenu.module.css";
import Translate from "@/components/base/translate/Translate";
import Tag from "@/components/base/forms/tag";
import useBreakpoint from "@/components/hooks/useBreakpoint";

/* helpers */
const norm = (v) => (v == null ? "" : String(v).trim());
const isNonEmpty = (v) => norm(v) !== "";
const parseJSONSafe = (s) => {
  try {
    return typeof s === "string" ? JSON.parse(s) : s || null;
  } catch {
    return null;
  }
};

/** Læs effektiv WT fra URL:
 * 1) ?workTypes=...  2) fallback: fieldSearch.workType  3) "all"
 */
function getWorkTypeFromQuery(query) {
  const wtParam = query?.workTypes;
  if (isNonEmpty(wtParam)) {
    return Array.isArray(wtParam) ? wtParam[0] || "all" : wtParam;
  }
  const fs = query?.fieldSearch ? parseJSONSafe(query.fieldSearch) : null;
  const wtFromFS = fs?.workType;
  return isNonEmpty(wtFromFS) ? String(wtFromFS) : "all";
}

/**
 * WorkTypeMenu
 * - Når deferUrlUpdate = true: opdater KUN Advanced-context lokalt (ingen URL push)
 * - Når deferUrlUpdate = false: kald onClick(type) (typisk → useSearchSync.setWorkType → URL)
 */
export default function WorkTypeMenu({ className = "", onClick = () => {} }) {
  const router = useRouter();
  const { workType: ctxWT } = useAdvancedSearchContext();

  const breakpoint = useBreakpoint();
  const isSmallScreen =
    breakpoint === "md" || breakpoint === "xs" || breakpoint === "sm";

  // Vis værdi: brug Advanced-ctx hvis sat; ellers effektiv fra URL.
  const effectiveWT = useMemo(() => {
    return ctxWT || getWorkTypeFromQuery(router.query) || "all";
  }, [ctxWT, router.query?.workTypes, router.query?.fieldSearch]);

  const handleClick = (type) => {
    const workType = type === "all" ? null : type;

    let params = {};
    if (workType) {
      params = { fieldSearch: JSON.stringify({ workType }) };
    }

    router.replace({
      pathname: router.pathname,
      ...(router.query?.mode === "avanceret" && {
        query: {
          mode: "avanceret",
          ...params,
          submit: false, // <----------- OBS! prevent useData fetch in search/page and search/result compoenents
        },
      }),
    });

    onClick(type);
  };

  const items = workTypes;

  if (isSmallScreen) {
    return (
      <div className={`${styles.tagWrapper} ${className}`}>
        <div className={styles.tagContainer}>
          {items.map((type) => {
            const isSelected = type === effectiveWT;
            return (
              <Tag
                className={styles.tagItem}
                key={type}
                selected={isSelected}
                onClick={() => handleClick(type)}
              >
                <Text type={isSelected ? "text4" : "text3"}>
                  {Translate({
                    context: "advanced_search_worktypes",
                    label: type,
                  })}
                </Text>
              </Tag>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.dropdownMenu} ${className}`}>
      {items.map((type) => {
        const isSelected = type === effectiveWT;
        const LinkTag = isSelected ? IconButton : Link;
        const linkProps = isSelected
          ? { keepUnderline: true, iconSize: 1 }
          : {};

        return (
          <LinkTag
            key={type}
            className={styles.menuItem}
            icon="arrowrightblue"
            onClick={() => handleClick(type)}
            {...linkProps}
          >
            <Text type={isSelected ? "text4" : "text3"}>
              {Translate({
                context: "advanced_search_worktypes",
                label: type,
              })}
            </Text>
          </LinkTag>
        );
      })}
    </div>
  );
}
