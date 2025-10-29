// components/search/utils/searchSyncCore.js
import { dbgCORE } from "./debug";

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
    if ((a === '"' && b === "'") || (a === "'" && b === "'"))
      return str.slice(1, -1);
    if ((a === '"' && b === '"') || (a === "'" && b === "'"))
      return str.slice(1, -1);
  }
  return str;
}

/* SIMPLE <-> fieldSearch */
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

/**
 * withWorkTypeInFS
 * - Hvis workType === "all" → bevar eksisterende workType i FS (ingen sletning)
 * - Hvis workType !== "all" → skriv/overskriv workType i FS
 */
export function withWorkTypeInFS(fieldSearch, workType) {
  if (!isNonEmpty(fieldSearch)) return fieldSearch || "";
  const obj = parseJSONSafe(fieldSearch) || {};

  if (!workType || workType === "all") {
    return stringifySafe(obj);
  }

  obj.workType = workType;
  return stringifySafe(obj);
}

/* Reducer */
export function reduceCommit(state, action) {
  const base = state ?? { snap: initialSnap(), lastOrigin: null };
  const { snap, lastOrigin } = base;

  dbgCORE("reduceCommit() in", { action, snap, lastOrigin });

  let out = base;

  switch (action?.type) {
    case "COMMIT_SIMPLE": {
      const qAll = isNonEmpty(action.qAll) ? action.qAll : null;
      // VIGTIGT: brug WT fra action hvis givet (SIMPLE’s valg)
      const nextWT = qAll
        ? normalizeWorkTypesParam(action.workTypes ?? snap.workTypes)
        : "all";
      out = {
        snap: { ...snap, simple: { qAll }, workTypes: nextWT },
        lastOrigin: MODE.SIMPLE,
      };
      break;
    }

    case "COMMIT_ADVANCED": {
      const fs = isNonEmpty(action.fieldSearch) ? action.fieldSearch : null;
      const wtFromFS = fs ? parseWorkTypeFromFS(fs) : "all";
      const nextWT = fs
        ? wtFromFS !== "all"
          ? wtFromFS
          : snap.workTypes
        : "all";
      out = {
        snap: { ...snap, advanced: { fieldSearch: fs }, workTypes: nextWT },
        lastOrigin: MODE.ADVANCED,
      };
      break;
    }

    case "COMMIT_CQL": {
      const val = isNonEmpty(action.cql) ? action.cql : null;
      out = {
        snap: { ...snap, cql: { cql: val } },
        lastOrigin: MODE.CQL,
      };
      break;
    }

    case "SET_WORKTYPE": {
      out = {
        snap: { ...snap, workTypes: normalizeWorkTypesParam(action.workTypes) },
        lastOrigin,
      };
      break;
    }

    case "HYDRATE_CQL_FROM_URL": {
      const cql = isNonEmpty(action.cql) ? action.cql : null;
      if (!cql) {
        out = base;
      } else {
        out = { snap: { ...snap, cql: { cql } }, lastOrigin: MODE.CQL };
      }
      break;
    }

    default:
      out = base;
  }

  dbgCORE("reduceCommit() out", { out });
  return out;
}

function pickEffectiveOrigin(snap, lastOrigin) {
  if (lastOrigin === MODE.CQL && !isNonEmpty(snap.cql.cql)) {
    if (isNonEmpty(snap.advanced.fieldSearch)) return MODE.ADVANCED;
    if (isNonEmpty(snap.simple.qAll)) return MODE.SIMPLE;
    return MODE.CQL;
  }
  return lastOrigin;
}

/* URL computation (kun query – path håndteres i hook) */
export function computeUrlForMode({ targetMode, snap, lastOrigin, tid }) {
  dbgCORE("computeUrlForMode() in", { targetMode, snap, lastOrigin, tid });

  const wt = normalizeWorkTypesParam(snap.workTypes);
  const base = tid ? { tid } : {};
  const origin = pickEffectiveOrigin(snap, lastOrigin);

  let out = { query: { ...base } };

  if (targetMode === MODE.SIMPLE) {
    if (origin === MODE.SIMPLE && isNonEmpty(snap.simple.qAll)) {
      out = {
        query: {
          ...base,
          "q.all": snap.simple.qAll,
          ...(wt !== "all" && { workTypes: wt }),
        },
      };
    }
    dbgCORE("computeUrlForMode() out SIMPLE", out);
    return out;
  }

  if (targetMode === MODE.ADVANCED) {
    if (origin === MODE.SIMPLE && isNonEmpty(snap.simple.qAll)) {
      const fsSeedRaw = buildFSFromSimple(snap.simple.qAll) || "{}";
      const fsWithWT = withWorkTypeInFS(fsSeedRaw, wt);
      out = {
        query: {
          ...base,
          fieldSearch: fsWithWT,
          ...(wt !== "all" && { workTypes: wt }),
        },
      };
      dbgCORE("computeUrlForMode() out SIMPLE→ADV", out);
      return out;
    }
    if (origin === MODE.ADVANCED && isNonEmpty(snap.advanced.fieldSearch)) {
      const fsWithWT = withWorkTypeInFS(snap.advanced.fieldSearch, wt);
      out = {
        query: {
          ...base,
          fieldSearch: fsWithWT,
          ...(wt !== "all" && { workTypes: wt }),
        },
      };
      dbgCORE("computeUrlForMode() out ADV→ADV", out);
      return out;
    }
    if (origin === MODE.CQL) {
      out = { query: { ...base } };
      dbgCORE("computeUrlForMode() out CQL→ADV (blocked)", out);
      return out;
    }
    out = { query: { ...base } };
    dbgCORE("computeUrlForMode() out ADV default", out);
    return out;
  }

  if (targetMode === MODE.CQL) {
    if (origin === MODE.CQL && isNonEmpty(snap.cql.cql)) {
      out = { query: { ...base, cql: snap.cql.cql } };
      dbgCORE("computeUrlForMode() out CQL→CQL", out);
      return out;
    }
    if (origin === MODE.SIMPLE && isNonEmpty(snap.simple.qAll)) {
      const fsSeedRaw = buildFSFromSimple(snap.simple.qAll) || "{}";
      const fsWithWT = withWorkTypeInFS(fsSeedRaw, wt);
      out = {
        query: {
          ...base,
          fieldSearch: fsWithWT,
          ...(wt !== "all" && { workTypes: wt }),
        },
      };
      dbgCORE("computeUrlForMode() out SIMPLE→CQL", out);
      return out;
    }
    if (origin === MODE.ADVANCED && isNonEmpty(snap.advanced.fieldSearch)) {
      const fsWithWT = withWorkTypeInFS(snap.advanced.fieldSearch, wt);
      out = {
        query: {
          ...base,
          fieldSearch: fsWithWT,
          ...(wt !== "all" && { workTypes: wt }),
        },
      };
      dbgCORE("computeUrlForMode() out ADV→CQL", out);
      return out;
    }
    out = { query: { ...base } };
    dbgCORE("computeUrlForMode() out CQL default", out);
    return out;
  }

  out = { query: {} };
  dbgCORE("computeUrlForMode() out HISTORY", out);
  return out;
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
  withWorkTypeInFS,
};
