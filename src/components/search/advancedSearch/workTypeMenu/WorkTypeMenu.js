// components/search/advancedSearch/workTypeMenu/WorkTypeMenu.jsx
import React, { useEffect } from "react";
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

/** helpers */
const norm = (v) => (v == null ? "" : String(v).trim());
const isNonEmpty = (v) => norm(v) !== "";
const parseJSONSafe = (s) => {
  try {
    return typeof s === "string" ? JSON.parse(s) : s || null;
  } catch {
    return null;
  }
};

export default function WorkTypeMenu({ className = "", onClick = () => {} }) {
  const router = useRouter();
  const { workType, changeWorkType } = useAdvancedSearchContext();
  const breakpoint = useBreakpoint();
  const isSmallScreen =
    breakpoint === "md" || breakpoint === "xs" || breakpoint === "sm";

  /**
   * Læs workType fra URL:
   * 1) ?workTypes=... (Simple)
   * 2) fallback: fieldSearch.workType (Advanced/CQL seed)
   * ellers "all"
   */
  const getWorkTypeFromUrl = () => {
    const { workTypes: wtParam, fieldSearch } = router.query;

    // 1) Direkte query-param (Simple)
    if (wtParam) {
      if (Array.isArray(wtParam)) return wtParam[0] || "all";
      return wtParam || "all";
    }

    // 2) Fallback til fieldSearch.workType (Advanced/CQL)
    if (fieldSearch) {
      const fs = parseJSONSafe(fieldSearch);
      const wtFromFS = fs?.workType;
      if (isNonEmpty(wtFromFS)) return String(wtFromFS);
    }

    return "all";
  };

  // Hold kontekst i sync med URL – men KUN hvis forskellig (undgå loops)
  useEffect(() => {
    const fromUrl = getWorkTypeFromUrl();
    if (fromUrl !== workType) {
      changeWorkType(fromUrl);
    }
    // Vi lytter på begge, da wt kan komme enten som query-param eller inde i fieldSearch
  }, [router.query.workTypes, router.query.fieldSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (type) => {
    onClick(type); // kalder din hook.setWorkType via prop
    changeWorkType(type); // opdaterer AdvancedSearchContext (UI state)
  };

  if (isSmallScreen) {
    return (
      <div className={`${styles.tagWrapper} ${className}`}>
        <div className={styles.tagContainer}>
          {workTypes.map((type) => {
            const isSelected = type === workType;
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
      {workTypes.map((type) => {
        const isSelected = type === workType;
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
