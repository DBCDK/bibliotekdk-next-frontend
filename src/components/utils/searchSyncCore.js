// =====================================================
// File: src/components/search/utils/searchSyncCore.js
// Purpose: Single source of truth for the "ladder" rules
// =====================================================

import { dbgCORE } from "@/components/utils/debug";

// ---------------- Modes & Paths ----------------
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

// ---------------- Small utils ----------------
const norm = (v) => (v == null ? "" : String(v).trim());
export const isNonEmpty = (v) => norm(v) !== "";

function stripOuterQuotesOnce(s) {
  const str = norm(s);
  if (str.length >= 2) {
    const a = str[0];
    const b = str[str.length - 1];
    if ((a === '"' && b === '"') || (a === "'" && b === "'")) {
      return str.slice(1, -1);
    }
  }
  return str;
}

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

// ---------------- FieldSearch helpers ----------------
export function buildFSFromValue(value = "") {
  return stringifySafe({
    inputFields: [
      { value, prefixLogicalOperator: null, searchIndex: "term.default" },
    ],
  });
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

export function safeExtractWorkType(fieldSearchStr) {
  try {
    if (!fieldSearchStr) return null;
    const obj = JSON.parse(fieldSearchStr);
    const wt = obj?.workType;
    return wt && typeof wt === "string" ? wt : null;
  } catch {
    return null;
  }
}

export function injectWorkTypeIntoFS(fieldSearch, workType) {
  if (!isNonEmpty(fieldSearch)) return fieldSearch || "";
  if (!workType || workType === "all") return fieldSearch;
  const obj = parseJSONSafe(fieldSearch) || {};
  obj.workType = workType;
  return stringifySafe(obj);
}

// ---------------- Snapshot shape ----------------
/**
 * snap := single source of truth kept in the hook
 * - simple.qAll
 * - advanced.fieldSearch
 * - cql.cql
 * - workTypes (current selected type, default "all")
 */
export const initialSnap = {
  simple: { qAll: null },
  advanced: { fieldSearch: null },
  cql: { cql: null },
  workTypes: "all",
};

// ---------------- Reducer with LADDER RULES ----------------
/**
 * action types:
 * - COMMIT_SIMPLE (text)
 * - COMMIT_ADVANCED (fieldSearch)
 * - COMMIT_CQL (cql)
 * - SET_WORKTYPE (workType)
 *
 * lastOrigin (SIMPLE/ADVANCED/CQL or null) is passed in and returned so the
 * hook can remember where the last real search came from.
 */
export function reduceCommit(action, snap, lastOrigin) {
  const next = {
    snap: {
      simple: { ...snap.simple },
      advanced: { ...snap.advanced },
      cql: { ...snap.cql },
      workTypes: snap.workTypes,
    },
    lastOrigin,
  };

  dbgCORE("reduceCommit() in", { action, snap, lastOrigin });

  switch (action.type) {
    case "COMMIT_SIMPLE": {
      const qAll = norm(action.qAll);
      next.snap.simple.qAll = isNonEmpty(qAll) ? qAll : null;

      // Simpel søgning har ikke workTypes-UI,
      // så en ny simpel søgning resetter workTypes til "all"
      if (isNonEmpty(qAll)) {
        next.snap.workTypes = "all";
      }

      if (lastOrigin === MODE.CQL) {
        next.snap.advanced.fieldSearch = null;
        next.snap.cql.cql = null;
      }

      next.lastOrigin = MODE.SIMPLE;
      break;
    }

    case "COMMIT_ADVANCED": {
      const fs = norm(action.fieldSearch);
      next.snap.advanced.fieldSearch = isNonEmpty(fs) ? fs : null;

      // BUGFIX:
      // Keep workTypes in sync with fieldSearch.workType.
      // If fieldSearch omits workType, interpret that as "all" (clear any previous non-all).
      const wtFromFS = safeExtractWorkType(fs);
      if (wtFromFS != null) {
        next.snap.workTypes = wtFromFS;
      } else {
        next.snap.workTypes = "all";
      }

      // If previously at CQL and now committing in ADVANCED, reset CQL rung
      if (lastOrigin === MODE.CQL) {
        next.snap.cql.cql = null;
      }

      next.lastOrigin = MODE.ADVANCED;
      break;
    }

    case "COMMIT_CQL": {
      const cql = norm(action.cql);
      next.snap.cql.cql = isNonEmpty(cql) ? cql : null;

      // CQL commit clears lower rungs + resets workTypes (policy: NO carry-down)
      next.snap.simple.qAll = null;
      next.snap.advanced.fieldSearch = null;
      next.snap.workTypes = "all";

      next.lastOrigin = MODE.CQL;
      break;
    }

    case "SET_WORKTYPE": {
      const wt = norm(action.workType);
      next.snap.workTypes = isNonEmpty(wt) ? wt : "all";
      // lastOrigin unchanged
      break;
    }

    default:
      break;
  }

  dbgCORE("reduceCommit() out", { out: next });
  return next;
}

// ---------------- URL -> State hydration ----------------
/**
 * - Always reflect ?workTypes= (fallback "all")
 * - In CQL mode, a cql= param is treated as a COMMIT (and clears others)
 * - In ADVANCED mode, fieldSearch without workType => workTypes becomes "all" (bugfix mirror)
 * - IMPORTANT: ADVANCED hydration only sets lastOrigin=ADVANCED when lastOrigin is null
 *              (deep-link / first load). Seeded nav from SIMPLE must not change origin.
 */
export function hydrateFromUrl(currentMode, query, snap, lastOrigin) {
  const next = {
    snap: {
      simple: { ...snap.simple },
      advanced: { ...snap.advanced },
      cql: { ...snap.cql },
      workTypes: snap.workTypes,
    },
    lastOrigin,
  };

  // --- workTypes fra URL ---
  let wtParam = query?.workTypes;
  if (Array.isArray(wtParam)) wtParam = wtParam[0];
  const urlWT = norm(wtParam);

  // Er der en simpel søgning i URL'en?
  const simpleAllInUrl = norm(query?.["q.all"]);
  const hasSimpleAll =
    currentMode === MODE.SIMPLE && isNonEmpty(simpleAllInUrl);

  if (isNonEmpty(urlWT)) {
    // URL'en siger eksplicit hvad workTypes er (simpel søgning)
    next.snap.workTypes = urlWT;
  } else if (hasSimpleAll) {
    // VIGTIGT:
    // Vi står på simpel /find/simpel med q.all, men UDEN workTypes-param.
    // Det betyder "all" og SKAL overskrive en gammel værdi som fx "article".
    next.snap.workTypes = "all";
  } else {
    // Ellers: behold eksisterende eller default "all"
    next.snap.workTypes = next.snap.workTypes || "all";
  }

  // --- resten af funktionen som du allerede har ---
  if (currentMode === MODE.CQL) {
    const cqlInUrl = norm(query?.cql);
    if (isNonEmpty(cqlInUrl)) {
      next.snap.cql.cql = cqlInUrl;
      next.snap.simple.qAll = null;
      next.snap.advanced.fieldSearch = null;
      next.snap.workTypes = "all";
      next.lastOrigin = MODE.CQL;
    }
  }

  if (currentMode === MODE.ADVANCED) {
    const fsInUrl = norm(query?.fieldSearch);
    if (isNonEmpty(fsInUrl)) {
      next.snap.advanced.fieldSearch = fsInUrl;
      const wt = safeExtractWorkType(fsInUrl);
      next.snap.workTypes = wt ?? "all";

      if (!next.lastOrigin) {
        next.lastOrigin = MODE.ADVANCED;
      }
    }
  }

  if (currentMode === MODE.SIMPLE) {
    const allInUrl = norm(query?.["q.all"]);
    if (isNonEmpty(allInUrl)) {
      next.snap.simple.qAll = allInUrl;
      if (!next.lastOrigin) next.lastOrigin = MODE.SIMPLE;
    }
  }

  dbgCORE("hydrateFromUrl()", {
    currentMode,
    query,
    out: { snap: next.snap, lastOrigin: next.lastOrigin },
  });
  return next;
}

// ---------------- State -> URL computation ----------------
/** Policy refresher
 * 1) SIMPLE commit may seed ADVANCED + CQL (with workType)
 * 2) ADVANCED commit may seed CQL (with workType)
 * 3) CQL commit never seeds down; going down after CQL shows empty views
 * 4) Returning to SIMPLE should show its committed query ONLY if SIMPLE is the origin
 */
export function computeUrlForMode(targetMode, snap, lastOrigin) {
  const empty = () => ({ query: {} });

  const toAdvancedSeed = (qAll, wt) => {
    const fs = buildFSFromSimple(qAll);
    const seeded = injectWorkTypeIntoFS(fs, wt);
    return {
      query: {
        fieldSearch: seeded,
        // ...(wt && wt !== "all" ? { workTypes: wt } : {}),
      },
    };
  };

  // 3) Down from CQL → always empty
  if (
    lastOrigin === MODE.CQL &&
    (targetMode === MODE.ADVANCED || targetMode === MODE.SIMPLE)
  ) {
    const out = empty();
    dbgCORE("computeUrlForMode() out CQL→down (empty)", out);
    return out;
  }

  if (targetMode === MODE.ADVANCED) {
    // 1) SIMPLE → ADVANCED (seed)
    if (lastOrigin === MODE.SIMPLE && isNonEmpty(snap.simple.qAll)) {
      const wt = snap.workTypes || "all";
      const out = toAdvancedSeed(snap.simple.qAll, wt);
      dbgCORE("computeUrlForMode() out SIMPLE→ADV", out);
      return out;
    }
    // Keep ADVANCED's own query if present
    if (isNonEmpty(snap.advanced.fieldSearch)) {
      const q = { fieldSearch: snap.advanced.fieldSearch };
      const wt = snap.workTypes;
      if (wt && wt !== "all") q.workTypes = wt;
      const out = { query: q };
      dbgCORE("computeUrlForMode() out ADV keep", out);
      return out;
    }
    const out = empty();
    dbgCORE("computeUrlForMode() out ADV empty", out);
    return out;
  }

  if (targetMode === MODE.CQL) {
    // Staying on CQL keeps its own query
    if (lastOrigin === MODE.CQL) {
      const out = isNonEmpty(snap.cql.cql)
        ? { query: { cql: snap.cql.cql } }
        : empty();
      dbgCORE("computeUrlForMode() out CQL→CQL keep/empty", out);
      return out;
    }
    // 2) ADVANCED → CQL (seed with fieldSearch and workType)
    if (lastOrigin === MODE.ADVANCED && isNonEmpty(snap.advanced.fieldSearch)) {
      // const wt = snap.workTypes || "all";
      const q = { fieldSearch: snap.advanced.fieldSearch };
      // if (wt && wt !== "all") q.workTypes = wt;
      const out = { query: q };
      dbgCORE("computeUrlForMode() out ADV→CQL", out);
      return out;
    }
    // 1) SIMPLE → CQL (seed via fieldSearch from simple)
    if (lastOrigin === MODE.SIMPLE && isNonEmpty(snap.simple.qAll)) {
      const wt = snap.workTypes || "all";
      const out = toAdvancedSeed(snap.simple.qAll, wt);
      dbgCORE("computeUrlForMode() out SIMPLE→CQL", out);
      return out;
    }
    const out = empty();
    dbgCORE("computeUrlForMode() out CQL empty", out);
    return out;
  }

  if (targetMode === MODE.SIMPLE) {
    // IMPORTANT: Only show SIMPLE when SIMPLE is the origin (latest commit).
    if (lastOrigin === MODE.SIMPLE && isNonEmpty(snap.simple.qAll)) {
      const wt = snap.workTypes || "all";
      const q = { "q.all": snap.simple.qAll };
      if (wt && wt !== "all") q.workTypes = wt;
      const out = { query: q };
      dbgCORE("computeUrlForMode() out SIMPLE→SIMPLE (origin match)", out);
      return out;
    }
    const out = empty();
    dbgCORE("computeUrlForMode() out SIMPLE empty (not origin)", out);
    return out;
  }

  const out = empty();
  dbgCORE("computeUrlForMode() out default empty", out);
  return out;
}
