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

export default function WorkTypeMenu({ className = "", onClick = () => {} }) {
  const router = useRouter();
  const { workType, changeWorkType } = useAdvancedSearchContext();
  const breakpoint = useBreakpoint();
  const isSmallScreen =
    breakpoint === "md" || breakpoint === "xs" || breakpoint === "sm";

  // 📡 Parse URL param safely
  const getWorkTypeFromUrl = () => {
    const { workTypes } = router.query;
    if (!workTypes) return "all";
    if (Array.isArray(workTypes)) return workTypes[0] || "all";
    return workTypes || "all";
  };

  // 🔁 Keep context in sync with URL (initially and on Back/Forward)
  useEffect(() => {
    const fromUrl = getWorkTypeFromUrl();
    if (fromUrl !== workType) {
      changeWorkType(fromUrl);
    }
  }, [router.query.workTypes]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (type) => {
    onClick(type);
    changeWorkType(type);
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
