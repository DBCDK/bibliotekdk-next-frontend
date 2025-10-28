// hooks/useSearchSync.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MODE,
  initialSnap,
  computeUrlForMode,
  reduceCommit,
  hydrateFromUrl,
} from "../utils/searchSyncCore";

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

// Named export
export function useSearchSync({ router, ..._rest }) {
  const [snap, setSnap] = useState(initialSnap());
  const lastOriginRef = useRef(null);

  const mode = useMemo(() => getModeFromRouter(router), [router.asPath]);

  useEffect(() => {
    const currentMode = getModeFromRouter(router);
    const next = hydrateFromUrl(
      { mode: currentMode, query: router.query },
      { snap, lastOrigin: lastOriginRef.current }
    );
    if (next && next.snap !== snap) {
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
      // Special-case: CQL → ADVANCED uden CQL-commit:
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
        pushUrl(MODE_PATH[MODE.ADVANCED], {
          fieldSearch,
          ...(workTypes && { workTypes }),
          ...(router.query?.tid && { tid: router.query.tid }),
        });
        return;
      }

      const { query } = computeUrlForMode({
        targetMode: target,
        snap,
        lastOrigin: lastOriginRef.current,
        tid: router.query?.tid,
      });
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
    (type) => {
      const next = reduceCommit(
        { snap, lastOrigin: lastOriginRef.current },
        { type: "SET_WORKTYPE", workTypes: type || "all" }
      );
      setSnap(next.snap);
      const { query } = computeUrlForMode({
        targetMode: mode,
        snap: next.snap,
        lastOrigin: next.lastOrigin ?? lastOriginRef.current,
        tid: router.query?.tid,
      });
      pushUrl(getPathForMode(mode), query);
    },
    [snap, mode, pushUrl, router.query?.tid]
  );

  const handleSimpleCommit = useCallback(
    (text) => {
      const next = reduceCommit(
        { snap, lastOrigin: lastOriginRef.current },
        { type: "COMMIT_SIMPLE", qAll: text }
      );
      setSnap(next.snap);
      lastOriginRef.current = next.lastOrigin;
      const { query } = computeUrlForMode({
        targetMode: MODE.SIMPLE,
        snap: next.snap,
        lastOrigin: next.lastOrigin,
        tid: router.query?.tid,
      });
      pushUrl(getPathForMode(MODE.SIMPLE), query);
    },
    [snap, pushUrl, router.query?.tid]
  );

  const handleAdvancedCommit = useCallback(
    (fieldSearchString, extras = {}) => {
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
      pushUrl(getPathForMode(MODE.ADVANCED), query);
    },
    [snap, pushUrl]
  );

  const handleCqlCommit = useCallback(
    (cqlString) => {
      const next = reduceCommit(
        { snap, lastOrigin: lastOriginRef.current },
        { type: "COMMIT_CQL", cql: cqlString }
      );
      setSnap(next.snap);
      lastOriginRef.current = next.lastOrigin;

      const query = { ...(isNonEmpty(cqlString) && { cql: cqlString }) };
      pushUrl(getPathForMode(MODE.CQL), query);
    },
    [snap, pushUrl]
  );

  const handleCqlClear = useCallback(() => {
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
export { MODE };
