// components/search/hooks/useSearchSync.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MODE,
  initialSnap,
  computeUrlForMode,
  reduceCommit,
  hydrateFromUrl,
  withWorkTypeInFS,
} from "../utils/searchSyncCore";
import { dbgSYNC } from "../utils/debug";

export const MODE_PATH = {
  [MODE.SIMPLE]: "/find/simpel",
  [MODE.ADVANCED]: "/find/avanceret",
  [MODE.CQL]: "/find/cql",
  [MODE.HISTORY]: "/find/historik/seneste",
};

function getModeFromRouter(router) {
  const base = (router?.asPath || router?.pathname || "").split("?")[0];
  if (base.includes("/find/historik")) return MODE.HISTORY;
  if (base.includes("/find/avanceret")) return MODE.ADVANCED;
  if (base.includes("/find/cql")) return MODE.CQL;
  return MODE.SIMPLE;
}
function getPathForMode(mode) {
  return MODE_PATH[mode] || MODE_PATH[MODE.SIMPLE];
}
const norm = (v) => (v == null ? "" : String(v).trim());
const isNonEmpty = (v) => norm(v) !== "";

function parseJSONSafe(s) {
  try {
    return typeof s === "string" ? JSON.parse(s) : s || null;
  } catch {
    return null;
  }
}
function deriveWorkTypeFromUrl(query) {
  const wtParam = query?.workTypes;
  if (isNonEmpty(wtParam)) {
    return Array.isArray(wtParam) ? wtParam[0] || "all" : String(wtParam);
  }
  const fs = query?.fieldSearch ? parseJSONSafe(query.fieldSearch) : null;
  const wtFs = fs?.workType;
  if (isNonEmpty(wtFs)) return String(wtFs);
  return "all";
}

export function useSearchSync({ router }) {
  const [snap, setSnap] = useState(initialSnap());
  const lastOriginRef = useRef(null);

  const mode = useMemo(() => getModeFromRouter(router), [router.asPath]);

  // Hydrate CQL from URL (?cql=) when in CQL
  useEffect(() => {
    const currentMode = getModeFromRouter(router);
    const next = hydrateFromUrl(
      { mode: currentMode, query: router.query },
      { snap, lastOrigin: lastOriginRef.current }
    );
    if (next && next.snap !== snap) {
      dbgSYNC("URL effect (hydrate)", {
        asPath: router.asPath,
        query: router.query,
        next,
      });
      setSnap(next.snap);
      lastOriginRef.current = next.lastOrigin;
    }
  }, [router.asPath]);

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

  const goToMode = useCallback(
    (target) => {
      dbgSYNC("goToMode() start", {
        from: mode,
        to: target,
        lastOrigin: lastOriginRef.current,
        snap,
        urlQuery: router.query,
      });

      // Special-case: CQL→ADV with URL fieldSearch seed (no CQL commit)
      if (
        mode === MODE.CQL &&
        target === MODE.ADVANCED &&
        router.query?.fieldSearch &&
        !router.query?.cql &&
        lastOriginRef.current !== MODE.CQL
      ) {
        const fieldSearch = String(router.query.fieldSearch);
        const workTypes = router.query.workTypes
          ? String(router.query.workTypes)
          : undefined;
        dbgSYNC("goToMode() special-case CQL→ADV w/URL seed", {
          fieldSearch,
          workTypes,
          tid: router.query?.tid,
        });
        pushUrl(MODE_PATH[MODE.ADVANCED], {
          fieldSearch,
          ...(workTypes && { workTypes }),
          ...(router.query?.tid && { tid: router.query.tid }),
        });
        return;
      }

      const wtEff =
        snap.workTypes && snap.workTypes !== "all"
          ? snap.workTypes
          : deriveWorkTypeFromUrl(router.query);

      const snapEff =
        wtEff !== snap.workTypes ? { ...snap, workTypes: wtEff } : snap;

      const { query } = computeUrlForMode({
        targetMode: target,
        snap: snapEff,
        lastOrigin: lastOriginRef.current,
        tid: router.query?.tid,
      });

      // Bevar FS.workType ved ADV→ADV/CQL (når wtEff === "all")
      if (
        target === MODE.ADVANCED &&
        lastOriginRef.current === MODE.ADVANCED &&
        isNonEmpty(snap.advanced.fieldSearch)
      ) {
        query.fieldSearch = withWorkTypeInFS(snap.advanced.fieldSearch, wtEff);
      }
      if (
        target === MODE.CQL &&
        lastOriginRef.current === MODE.ADVANCED &&
        isNonEmpty(snap.advanced.fieldSearch)
      ) {
        query.fieldSearch = withWorkTypeInFS(snap.advanced.fieldSearch, wtEff);
      }

      dbgSYNC("goToMode() computed", { target, query });
      pushUrl(getPathForMode(target), query);
    },
    [
      mode,
      snap,
      pushUrl,
      router.query?.tid,
      router.query?.fieldSearch,
      router.query?.cql,
      router.query?.workTypes,
    ]
  );

  const setWorkType = useCallback(
    (type, options = { push: true }) => {
      const nextWT = type || "all";
      dbgSYNC("setWorkType()", {
        nextWT,
        options,
        mode,
        beforeSnapWT: snap.workTypes,
      });

      const next = reduceCommit(
        { snap, lastOrigin: lastOriginRef.current },
        { type: "SET_WORKTYPE", workTypes: nextWT }
      );
      setSnap(next.snap);

      if (options?.push) {
        const wtEff =
          next.snap.workTypes && next.snap.workTypes !== "all"
            ? next.snap.workTypes
            : deriveWorkTypeFromUrl(router.query);

        if (
          mode === MODE.ADVANCED &&
          isNonEmpty(next.snap.advanced.fieldSearch)
        ) {
          const fsWithWT = withWorkTypeInFS(
            next.snap.advanced.fieldSearch,
            wtEff
          );
          pushUrl(getPathForMode(MODE.ADVANCED), { fieldSearch: fsWithWT });
          return;
        }
        if (mode === MODE.CQL && isNonEmpty(next.snap.cql.cql)) {
          pushUrl(getPathForMode(MODE.CQL), { cql: next.snap.cql.cql });
          return;
        }
        if (mode === MODE.SIMPLE && isNonEmpty(next.snap.simple.qAll)) {
          const query = {
            "q.all": next.snap.simple.qAll,
            ...(wtEff !== "all" && { workTypes: wtEff }),
          };
          pushUrl(getPathForMode(MODE.SIMPLE), query);
          return;
        }
        pushUrl(getPathForMode(mode), {});
      } else {
        dbgSYNC("setWorkType() (no push) – snapshot only");
      }
    },
    [snap, mode, pushUrl, router.query]
  );

  const handleSimpleCommit = useCallback(
    (text) => {
      const wtFromUrlOrFs = deriveWorkTypeFromUrl(router.query);
      dbgSYNC("handleSimpleCommit()", {
        text,
        prevWT: snap.workTypes,
        wtFromUrlOrFs,
      });

      // 🔧 VIGTIGT: send WT ind i reduceren, så snapshot skifter WT til SIMPLE-valget
      const next = reduceCommit(
        { snap, lastOrigin: lastOriginRef.current },
        { type: "COMMIT_SIMPLE", qAll: text, workTypes: wtFromUrlOrFs }
      );
      setSnap(next.snap);
      lastOriginRef.current = next.lastOrigin;

      const query = {
        ...(isNonEmpty(text) && { "q.all": text }),
        ...(isNonEmpty(text) &&
          wtFromUrlOrFs !== "all" && { workTypes: wtFromUrlOrFs }),
      };
      dbgSYNC("handleSimpleCommit() → pushUrl", { query });
      pushUrl(getPathForMode(MODE.SIMPLE), query);
    },
    [snap, pushUrl, router.query]
  );

  const handleAdvancedCommit = useCallback(
    (fieldSearchString, extras = {}) => {
      dbgSYNC("handleAdvancedCommit()", { fieldSearchString, extras });
      const next = reduceCommit(
        { snap, lastOrigin: lastOriginRef.current },
        { type: "COMMIT_ADVANCED", fieldSearch: fieldSearchString }
      );
      setSnap(next.snap);
      lastOriginRef.current = next.lastOrigin;

      const query = {
        ...(isNonEmpty(fieldSearchString) && {
          fieldSearch: fieldSearchString,
        }),
        ...(extras && extras.tid ? { tid: extras.tid } : {}),
      };
      dbgSYNC("handleAdvancedCommit() → pushUrl", { query });
      pushUrl(getPathForMode(MODE.ADVANCED), query);
    },
    [snap, pushUrl]
  );

  const handleCqlCommit = useCallback(
    (cqlString) => {
      dbgSYNC("handleCqlCommit()", { cqlString });
      const next = reduceCommit(
        { snap, lastOrigin: lastOriginRef.current },
        { type: "COMMIT_CQL", cql: cqlString }
      );
      setSnap(next.snap);
      lastOriginRef.current = next.lastOrigin;

      const query = { ...(isNonEmpty(cqlString) && { cql: cqlString }) };
      dbgSYNC("handleCqlCommit() → pushUrl", { query });
      pushUrl(getPathForMode(MODE.CQL), query);
    },
    [snap, pushUrl]
  );

  const handleCqlClear = useCallback(() => {
    dbgSYNC("handleCqlClear()");
    const next = reduceCommit(
      { snap, lastOrigin: lastOriginRef.current },
      { type: "COMMIT_CQL", cql: "" }
    );
    setSnap(next.snap);
    pushUrl(getPathForMode(MODE.CQL), {});
  }, [snap, pushUrl]);

  return {
    handleSimpleCommit,
    handleAdvancedCommit,
    handleCqlCommit,
    handleCqlClear,
    goToMode,
    setWorkType,
    mode,
  };
}

export default useSearchSync;
