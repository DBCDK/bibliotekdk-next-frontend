// SaveSearchBtn.js — split into Wrap (logic) and UI (presentational)

import IconButton from "@/components/base/iconButton";
import styles from "./SaveSearchBtn.module.css";

// --- Wrap (handles hooks, data, side-effects) ---
import Translate from "@/components/base/translate";
import { useSavedSearches } from "@/components/hooks/useSearchHistory";
import { useModal } from "@/components/_modal";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import { openLoginModal } from "@/components/_modal/pages/login/utils";
import {
  convertStateToCql,
  getCqlAndFacetsQuery,
} from "../advancedSearch/utils";
import { useAdvancedSearchContext } from "../advancedSearch/advancedSearchContext";
import { useFacets } from "../advancedSearch/useFacets";
import { useQuickFilters } from "../advancedSearch/useQuickFilters";
import { useCurrentSearchHistoryItem } from "@/components/hooks/useSearchHistory";
import { useMemo } from "react";

// =====================
// UI (dumb/presentational)
// =====================
export function SaveSearchBtnUI({
  onClick,
  isSaved,
  label,
  className,
  ...props
}) {
  return (
    <IconButton
      className={className}
      onClick={onClick}
      icon={isSaved ? "heart_filled" : "heart"}
      keepUnderline
      {...props}
    >
      {label}
    </IconButton>
  );
}

// =====================
// Wrap (logic/container)
// =====================
export default function SaveSearchBtn({ className = "" }) {
  const modal = useModal();
  const { isAuthenticated } = useAuthentication();
  const { savedSearches, deleteSearches, useSavedSearchByCql } =
    useSavedSearches();
  const currentSearchHistoryItem = useCurrentSearchHistoryItem();

  const advCtx = useAdvancedSearchContext();
  const { selectedFacets } = useFacets();
  const { selectedQuickFilters } = useQuickFilters();

  const cql = advCtx?.cqlFromUrl;
  const fieldSearch = advCtx?.fieldSearchFromUrl;

  const cqlAndFacetsQuery = getCqlAndFacetsQuery({
    cql,
    selectedFacets,
    quickFilters: selectedQuickFilters,
  });

  const advancedCql =
    cqlAndFacetsQuery ||
    convertStateToCql({
      ...fieldSearch,
      facets: selectedFacets,
      quickFilters: selectedQuickFilters,
    });

  // bruges kun til CQL-lookup / modal
  const searchHistoryObj = { key: advancedCql };

  const { mutate: mutateSavedByCql } = useSavedSearchByCql({
    cql: searchHistoryObj.key,
  });

  // fælles sandhed for om denne søgning er gemt:
  const matchingSaved = useMemo(
    () => savedSearches.find((ss) => ss.key === currentSearchHistoryItem?.key),
    [savedSearches, currentSearchHistoryItem?.key]
  );

  const isSaved = !!matchingSaved?.id;

  console.log("### savedSearches", savedSearches.length, {
    isSaved,
    matchingSaved,
    currentKey: currentSearchHistoryItem?.key,
  });

  const onSaveSearchClick = (e) => {
    e.stopPropagation();

    if (isSaved) {
      const idToDelete = matchingSaved?.id;
      if (!idToDelete) {
        console.warn("Tried to unsave but no id found");
        return;
      }

      deleteSearches({ idsToDelete: [idToDelete] }).then(() => {
        // opdater evt. CQL-single-lookup
        mutateSavedByCql && mutateSavedByCql();
      });
    } else {
      modal.push("saveSearch", {
        item: currentSearchHistoryItem,
        onSaveDone: mutateSavedByCql,
      });
    }
  };

  const onSaveSearchLogin = (e) => {
    e.stopPropagation();

    const callbackUID = modal.saveToStore("saveSearch", {
      item: currentSearchHistoryItem,
      onSaveDone: mutateSavedByCql,
      back: false,
    });

    openLoginModal({ modal, callbackUID });
  };

  const onClick = isAuthenticated ? onSaveSearchClick : onSaveSearchLogin;
  const label = Translate({ context: "search", label: "saveSearch" });

  return (
    <SaveSearchBtnUI
      className={`${styles.wrap} ${className}`}
      onClick={onClick}
      isSaved={isSaved}
      label={label}
    />
  );
}
