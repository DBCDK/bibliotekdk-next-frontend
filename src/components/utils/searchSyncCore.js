// ../utils/searchSyncCore.js

export const MODE = {
  SIMPLE: "simpel",
  ADVANCED: "avanceret",
  CQL: "cql",
  HISTORY: "history",
};

export const initialSnap = () => ({
  simple: { qAll: null },
  advanced: { fieldSearch: null },
  cql: { cql: null },
  workTypes: "all",
});

const norm = (v) => (v == null ? "" : String(v).trim());
const isNonEmpty = (v) => norm(v) !== "";

function parseJSONSafe(s) {
  try {
    return typeof s === "string" ? JSON.parse(s) : s || null;
  } catch {
    return null;
  }
}
function stringifySafe(obj) {
  try {
    return JSON.stringify(obj ?? {});
  } catch {
    return "";
  }
}

function stripOuterQuotesOnce(s) {
  const str = norm(s);
  if (str.length >= 2) {
    const a = str[0],
      b = str[str.length - 1];
    if ((a === '"' && b === '"') || (a === "'" && b === "'"))
      return str.slice(1, -1);
  }
  return str;
}

export function buildFSFromSimple(all) {
  const v = stripOuterQuotesOnce(all);
  if (!isNonEmpty(v)) return undefined;
  return stringifySafe({
    inputFields: [
      { value: v, prefixLogicalOperator: null, searchIndex: "term.default" },
    ],
  });
}

/* workTypes helpers */
function normalizeWorkTypesParam(val) {
  if (!val) return "all";
  if (Array.isArray(val)) {
    const first = val.find(Boolean) || "all";
    return String(first);
  }
  return String(val) || "all";
}
function parseWorkTypeFromFS(fieldSearch) {
  const obj = parseJSONSafe(fieldSearch);
  return obj?.workType || "all";
}
function withWorkTypeInFS(fieldSearch, workType) {
  if (!isNonEmpty(fieldSearch)) return fieldSearch || "";
  const obj = parseJSONSafe(fieldSearch) || {};
  if (workType && workType !== "all") obj.workType = workType;
  else delete obj.workType;
  return stringifySafe(obj);
}

/* Reducer */
export function reduceCommit(state, action) {
  const { snap, lastOrigin } = state ?? {
    snap: initialSnap(),
    lastOrigin: null,
  };

  switch (action?.type) {
    case "COMMIT_SIMPLE": {
      const qAll = isNonEmpty(action.qAll) ? action.qAll : null;
      const nextWT = qAll ? snap.workTypes : "all";
      return {
        snap: { ...snap, simple: { qAll }, workTypes: nextWT },
        lastOrigin: MODE.SIMPLE,
      };
    }

    case "COMMIT_ADVANCED": {
      const fs = isNonEmpty(action.fieldSearch) ? action.fieldSearch : null;
      const wtFromFS = fs ? parseWorkTypeFromFS(fs) : "all";
      const nextWT = fs
        ? wtFromFS !== "all"
          ? wtFromFS
          : snap.workTypes
        : "all";
      return {
        snap: { ...snap, advanced: { fieldSearch: fs }, workTypes: nextWT },
        lastOrigin: MODE.ADVANCED,
      };
    }

    case "COMMIT_CQL": {
      const val = isNonEmpty(action.cql) ? action.cql : null;
      return { snap: { ...snap, cql: { cql: val } }, lastOrigin: MODE.CQL };
    }

    case "SET_WORKTYPE": {
      return {
        snap: { ...snap, workTypes: action.workTypes || "all" },
        lastOrigin,
      };
    }

    case "HYDRATE_CQL_FROM_URL": {
      const cql = isNonEmpty(action.cql) ? action.cql : null;
      if (!cql) return state;
      return { snap: { ...snap, cql: { cql } }, lastOrigin: MODE.CQL };
    }

    default:
      return state ?? { snap: initialSnap(), lastOrigin: null };
  }
}

function pickEffectiveOrigin(snap, lastOrigin) {
  if (lastOrigin === MODE.CQL && !isNonEmpty(snap.cql.cql)) {
    if (isNonEmpty(snap.advanced.fieldSearch)) return MODE.ADVANCED;
    if (isNonEmpty(snap.simple.qAll)) return MODE.SIMPLE;
    return MODE.CQL;
  }
  return lastOrigin;
}

/* URL computation */
export function computeUrlForMode({ targetMode, snap, lastOrigin, tid }) {
  const wt = normalizeWorkTypesParam(snap.workTypes);
  const base = tid ? { tid } : {};
  const origin = pickEffectiveOrigin(snap, lastOrigin);

  if (targetMode === MODE.SIMPLE) {
    if (origin === MODE.SIMPLE && isNonEmpty(snap.simple.qAll)) {
      return {
        query: {
          ...base,
          "q.all": snap.simple.qAll,
          ...(wt !== "all" && { workTypes: wt }),
        },
      };
    }
    return { query: { ...base } };
  }

  if (targetMode === MODE.ADVANCED) {
    if (origin === MODE.SIMPLE && isNonEmpty(snap.simple.qAll)) {
      const fsSeedRaw = buildFSFromSimple(snap.simple.qAll) || "{}";
      const fsSeedWithW = withWorkTypeInFS(fsSeedRaw, wt);
      return {
        query: {
          ...base,
          fieldSearch: fsSeedWithW,
          ...(wt !== "all" && { workTypes: wt }), // <— til Menu/andre læsere
        },
      };
    }
    if (origin === MODE.ADVANCED && isNonEmpty(snap.advanced.fieldSearch)) {
      const fsWithWT = withWorkTypeInFS(snap.advanced.fieldSearch, wt);
      return {
        query: {
          ...base,
          fieldSearch: fsWithWT,
          ...(wt !== "all" && { workTypes: wt }), // <— til Menu/andre læsere
        },
      };
    }
    return { query: { ...base } };
  }

  if (targetMode === MODE.CQL) {
    if (origin === MODE.CQL && isNonEmpty(snap.cql.cql)) {
      return { query: { ...base, cql: snap.cql.cql } };
    }
    if (origin === MODE.SIMPLE && isNonEmpty(snap.simple.qAll)) {
      const fsSeedRaw = buildFSFromSimple(snap.simple.qAll) || "{}";
      const fsSeedWithW = withWorkTypeInFS(fsSeedRaw, wt);
      return {
        query: {
          ...base,
          fieldSearch: fsSeedWithW,
          ...(wt !== "all" && { workTypes: wt }), // <— til Menu/andre læsere
        },
      };
    }
    if (origin === MODE.ADVANCED && isNonEmpty(snap.advanced.fieldSearch)) {
      const fsWithWT = withWorkTypeInFS(snap.advanced.fieldSearch, wt);
      return {
        query: {
          ...base,
          fieldSearch: fsWithWT,
          ...(wt !== "all" && { workTypes: wt }), // <— til Menu/andre læsere
        },
      };
    }
    return { query: { ...base } };
  }

  return { query: {} };
}

export function hydrateFromUrl({ mode, query }, state) {
  if (mode !== MODE.CQL) return state;
  const cql = norm(query?.cql || "");
  if (isNonEmpty(cql)) {
    return reduceCommit(state, { type: "HYDRATE_CQL_FROM_URL", cql });
  }
  return state;
}

export default {
  MODE,
  initialSnap,
  computeUrlForMode,
  reduceCommit,
  hydrateFromUrl,
  buildFSFromSimple,
};
