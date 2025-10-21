// hooks/useSearchSync.js
import { useCallback, useState } from "react";
import {
  buildFieldSearchFromAll,
  extractAllFromFieldSearch,
  stripOuterQuotes,
  isEmptyVal,
} from "../utils/searchHelpers";

export const MODE = {
  SIMPLE: "simpel",
  ADVANCED: "avanceret",
  CQL: "cql",
  HISTORY: "history",
};

export const MODE_PATH = {
  [MODE.SIMPLE]: "/find/simpel",
  [MODE.ADVANCED]: "/find/avanceret",
  [MODE.CQL]: "/find/cql",
  [MODE.HISTORY]: "/find/historik/seneste",
};

/**
 * Encapsulates commit-based sync rules between Simple and Advanced:
 * - Simple -> Advanced: always allowed on submit; sets a baseline fieldSearch.
 * - Advanced -> Simple: only lift back if advanced value is unchanged vs. baseline;
 *   otherwise clear q.all.
 *
 * No auto-normalization on tab switch.
 */
export function useSearchSync({ router, setQuery }) {
  // Last committed Simple text (what the user actually searched for in Simple)
  const [baselineFromSimple, setBaselineFromSimple] = useState(null); // stringified fieldSearch or null

  /**
   * Commit from Simple.
   * Always allowed to “transfer” into Advanced; we create/refresh baseline FS.
   */
  const handleSimpleCommit = useCallback(
    (text) => {
      const raw = (text ?? "").trim();
      // Build baseline fieldSearch from Simple value (strip outer quotes before building)
      const stripped = stripOuterQuotes(raw);
      const baselineFS = raw ? buildFieldSearchFromAll(stripped) : null;

      setBaselineFromSimple(baselineFS);

      // Reflect committed simple value in the URL (q.all).
      setQuery({
        query: {
          ...router.query,
          "q.all": raw || undefined,
          // Do not touch fieldSearch here; Advanced keeps its current UI value until Advanced submit.
        },
        exclude: ["page"],
      });
    },
    [router.query, setQuery]
  );

  /**
   * Commit from Advanced.
   * Only lift to Simple if fieldSearch equals the baseline created by last Simple commit.
   * Otherwise clear q.all.
   */
  const handleAdvancedCommit = useCallback(
    (fieldSearchString) => {
      const fs = fieldSearchString || null;
      const unchanged =
        !!fs && !!baselineFromSimple && fs === baselineFromSimple;

      const nextQAll = unchanged ? extractAllFromFieldSearch(fs) : null;

      setQuery({
        query: {
          ...router.query,
          "q.all": !isEmptyVal(nextQAll) ? nextQAll : undefined,
          fieldSearch: fs || undefined,
        },
        exclude: ["page"],
      });
    },
    [baselineFromSimple, router.query, setQuery]
  );

  return {
    handleSimpleCommit,
    handleAdvancedCommit,
  };
}
