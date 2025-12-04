// ==============================================
// File: components/hooks/useSearchSync.js
// Purpose: Tiny UI hook that wires URL <-> state
// ==============================================
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MODE,
  MODE_PATH,
  initialSnap,
  reduceCommit,
  computeUrlForMode,
  hydrateFromUrl,
} from "@/components/utils/searchSyncCore";
import { dbgSYNC } from "@/components/utils/debug";

/**
 * Helper: derive mode purely from pathname (NEVER from query)
 */
function getModeFromRouter(router) {
  const base = (router?.asPath || router?.pathname || "").split("?")[0];
  if (base.includes("/find/historik")) return MODE.HISTORY;
  if (base.includes("/find/avanceret")) return MODE.ADVANCED;
  if (base.includes("/find/cql")) return MODE.CQL;
  return MODE.SIMPLE;
}

/**
 * Public hook API used by Search.Wrap
 * - Keeps a small, serializable snapshot (snap)
 * - All business rules live in searchSyncCore
 * - This hook ONLY:
 *   - reads router
 *   - hydrates from URL
 *   - emits URL updates (goToMode / commits / workType)
 */
export function useSearchSync({ router }) {
  const [snap, setSnap] = useState(initialSnap);
  const lastOriginRef = useRef(null); // MODE of last commit (SIMPLE/ADVANCED/CQL) or null

  const mode = useMemo(() => getModeFromRouter(router), [router.asPath]);

  // ----------- Hydration from URL -----------
  useEffect(() => {
    const out = hydrateFromUrl(
      mode,
      router.query || {},
      snap,
      lastOriginRef.current
    );
    setSnap(out.snap);
    lastOriginRef.current = out.lastOrigin;
  }, [mode, router.query]); // shallow OK

  // ----------- URL push (robust & shallow) -----------
  const pushUrl = useCallback(
    (pathname, queryObj) => {
      const query = Object.fromEntries(
        Object.entries(queryObj || {}).filter(
          ([, v]) => v !== undefined && v !== null && String(v).trim() !== ""
        )
      );
      dbgSYNC("pushUrl()", { pathname, query });
      router
        .push(
          { pathname, query: Object.keys(query).length ? query : undefined },
          undefined,
          { shallow: true }
        )
        .catch(() => {});
    },
    [router]
  );

  // ----------- Tab navigation -----------
  const goToMode = useCallback(
    (targetMode) => {
      dbgSYNC("goToMode() start", {
        from: mode,
        to: targetMode,
        lastOrigin: lastOriginRef.current,
        snap,
        urlQuery: router.query,
      });
      const { query } = computeUrlForMode(
        targetMode,
        snap,
        lastOriginRef.current
      );
      const pathname = MODE_PATH[targetMode] || MODE_PATH[MODE.SIMPLE];
      dbgSYNC("goToMode() computed", { target: targetMode, query });
      pushUrl(pathname, query);
    },
    [mode, snap, router.query, pushUrl]
  );

  // ----------- WorkType change (does NOT alter search terms) -----------
  const setWorkType = useCallback(
    (workType) => {
      dbgSYNC("setWorkType()", {
        workTypeBefore: snap.workTypes,
        workTypeNext: workType,
      });

      const out = reduceCommit(
        { type: "SET_WORKTYPE", workType },
        snap,
        lastOriginRef.current
      );
      setSnap(out.snap);
      lastOriginRef.current = out.lastOrigin; // unchanged by SET_WORKTYPE

      // Build query for current visible mode using existing content rules
      const { query } = computeUrlForMode(mode, out.snap, out.lastOrigin);

      // Ensure workTypes mirrors state when relevant
      if (out.snap.workTypes && out.snap.workTypes !== "all") {
        query.workTypes = out.snap.workTypes;
      } else {
        delete query.workTypes;
      }

      delete query.facets;
      delete query.quickfilters;
      delete query.page;

      dbgSYNC("setWorkType() → pushUrl", { mode, query });
      pushUrl(MODE_PATH[mode] || MODE_PATH[MODE.SIMPLE], query);
    },
    [mode, snap, pushUrl]
  );

  // ----------- Commits -----------
  const handleSimpleCommit = useCallback(
    (text) => {
      dbgSYNC("handleSimpleCommit()", { text, prevWT: snap.workTypes });
      const out = reduceCommit(
        { type: "COMMIT_SIMPLE", qAll: text },
        snap,
        lastOriginRef.current
      );
      setSnap(out.snap);
      lastOriginRef.current = out.lastOrigin;

      const q = {};
      if (out.snap.simple.qAll) q["q.all"] = out.snap.simple.qAll;
      if (out.snap.workTypes && out.snap.workTypes !== "all")
        q.workTypes = out.snap.workTypes;

      dbgSYNC("handleSimpleCommit() → pushUrl", { query: q });
      pushUrl(MODE_PATH[MODE.SIMPLE], q);
    },
    [snap, pushUrl]
  );

  const handleAdvancedCommit = useCallback(
    (fieldSearchString, extras = {}) => {
      dbgSYNC("handleAdvancedCommit()", { fieldSearchString, extras });
      const out = reduceCommit(
        { type: "COMMIT_ADVANCED", fieldSearch: fieldSearchString },
        snap,
        lastOriginRef.current
      );
      setSnap(out.snap);
      lastOriginRef.current = out.lastOrigin;

      const q = {};
      if (out.snap.advanced.fieldSearch)
        q.fieldSearch = out.snap.advanced.fieldSearch;
      if (out.snap.workTypes && out.snap.workTypes !== "all")
        q.workTypes = out.snap.workTypes;

      dbgSYNC("handleAdvancedCommit() → pushUrl", { query: q });
      pushUrl(MODE_PATH[MODE.ADVANCED], q);
    },
    [snap, pushUrl]
  );

  const handleCqlCommit = useCallback(
    (cqlString) => {
      dbgSYNC("handleCqlCommit()", { cqlString });
      const out = reduceCommit(
        { type: "COMMIT_CQL", cql: cqlString },
        snap,
        lastOriginRef.current
      );
      setSnap(out.snap);
      lastOriginRef.current = out.lastOrigin;

      const q = {};
      if (out.snap.cql.cql) q.cql = out.snap.cql.cql;

      dbgSYNC("handleCqlCommit() → pushUrl", { query: q });
      // Never carry workTypes in CQL mode (policy)
      pushUrl(MODE_PATH[MODE.CQL], q);
    },
    [snap, pushUrl]
  );

  return {
    mode,
    goToMode,
    setWorkType,
    handleSimpleCommit,
    handleAdvancedCommit,
    handleCqlCommit,
  };
}

export default useSearchSync;
