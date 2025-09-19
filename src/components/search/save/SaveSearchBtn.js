// SaveSearchBtn.js — split into Wrap (logic) and UI (presentational)

import IconButton from "@/components/base/iconButton";
import styles from "./SaveSearchBtn.module.css";

// --- Wrap (handles hooks, data, side-effects) ---
import Translate from "@/components/base/translate";
import useSavedSearches from "@/components/hooks/useSavedSearches";
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
  const { deleteSearches, useSavedSearchByCql } = useSavedSearches();

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

  const searchHistoryObj = { key: advancedCql };

  const { savedObject, mutate } = useSavedSearchByCql({
    cql: searchHistoryObj.key,
  });

  const isSaved = !!savedObject?.id;

  const onSaveSearchClick = (e) => {
    e.stopPropagation();
    if (isSaved) {
      // Unsaving
      Promise.resolve(
        deleteSearches({ idsToDelete: [savedObject?.id] })
      ).finally(() => {
        mutate();
      });
    } else {
      // Saving
      modal.push("saveSearch", { item: searchHistoryObj, onSaveDone: mutate });
    }
  };

  const onSaveSearchLogin = (e) => {
    e.stopPropagation();
    openLoginModal({ modal });
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
