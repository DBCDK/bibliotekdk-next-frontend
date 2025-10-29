// components/hooks/useSearchSync.js
/**
 * UI-hook der bruger core-funktionerne:
 * - hydrateFromUrl (på asPath/query ændringer)
 * - reduceCommit (handlers)
 * - computeUrlForMode (tab-skift)
 *
 * Ingen afhængighed til AdvancedSearchContext.
 */
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

function getModeFromRouter(router) {
  const base = (router?.asPath || router?.pathname || "").split("?")[0];
  if (base.includes("/find/historik")) return MODE.HISTORY;
  if (base.includes("/find/avanceret")) return MODE.ADVANCED;
  if (base.includes("/find/cql")) return MODE.CQL;
  return MODE.SIMPLE;
}

export function useSearchSync({ router }) {
  const [snap, setSnap] = useState(initialSnap);
  const lastOriginRef = useRef(null);

  const mode = useMemo(() => getModeFromRouter(router), [router.asPath]);

  // Hydration fra URL (inkl. CQL=cql → “commit” + nedad-nulstilling)
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

  // Tab-skift
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

  // SIMPLE commit
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

  // ADVANCED commit
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

  // CQL commit (rigtig CQL-søgning – IKKE bare visitation med fieldSearch seed)
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
      pushUrl(MODE_PATH[MODE.CQL], q);
    },
    [snap, pushUrl]
  );

  return {
    mode,
    goToMode,
    handleSimpleCommit,
    handleAdvancedCommit,
    handleCqlCommit,
  };
}

export default useSearchSync;
