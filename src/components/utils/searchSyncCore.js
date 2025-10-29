// src/components/search/utils/searchSyncCore.js
/**
 * Core sync- og URL-logik for søgningens “stige”.
 * - MODE + initialSnap
 * - reduceCommit: SIMPLE / ADVANCED / CQL
 * - hydrateFromUrl: læs URL ind i snap (inkl. default workTypes = "all")
 * - computeUrlForMode: byg query til target mode efter reglerne
 *
 * Stige-regel:
 *  - CQL commit (eller CQL-url med cql=...) = lastOrigin='cql' + ryd SIMPLE/ADV og workTypes='all'
 *  - Ved navigation NED fra cql → (avanceret/simpel) returneres altid TOM visning
 *  - Opad (simpel → avanceret → cql) må seedes, inkl. workType
 */

import { dbgCORE } from "./debug";

/* ---------- Modes ---------- */
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

/* ---------- Helpers ---------- */
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

/** SIMPLE -> fieldSearch seed */
function buildFSFromSimple(all) {
  const v = stripOuterQuotesOnce(all);
  if (!isNonEmpty(v)) return undefined;
  return stringifySafe({
    inputFields: [
      { value: v, prefixLogicalOperator: null, searchIndex: "term.default" },
    ],
  });
}

/** fieldSearch.workType -> snap.workTypes */
function safeExtractWorkType(fieldSearchStr) {
  try {
    if (!fieldSearchStr) return null;
    const obj = JSON.parse(fieldSearchStr);
    const wt = obj?.workType;
    return wt && typeof wt === "string" ? wt : null;
  } catch {
    return null;
  }
}

/** injicer workType ind i en FS-string */
function injectWorkTypeIntoFS(fieldSearch, workType) {
  if (!isNonEmpty(fieldSearch)) return fieldSearch || "";
  if (!workType || workType === "all") return fieldSearch;
  const obj = parseJSONSafe(fieldSearch) || {};
  obj.workType = workType;
  return stringifySafe(obj);
}

/* ---------- initialSnap ---------- */
export const initialSnap = {
  simple: { qAll: null },
  advanced: { fieldSearch: null },
  cql: { cql: null },
  workTypes: "all",
};

/* ---------- reduceCommit ---------- */
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
      next.lastOrigin = MODE.SIMPLE;
      break;
    }

    case "COMMIT_ADVANCED": {
      const fs = norm(action.fieldSearch);
      next.snap.advanced.fieldSearch = isNonEmpty(fs) ? fs : null;
      // sync workTypes til senere brug
      const wt = safeExtractWorkType(fs) || next.snap.workTypes || "all";
      next.snap.workTypes = wt;
      next.lastOrigin = MODE.ADVANCED;
      break;
    }

    case "COMMIT_CQL": {
      const cql = norm(action.cql);
      next.snap.cql.cql = isNonEmpty(cql) ? cql : null;

      // Stige-politik: Ryd nedre trin + reset workTypes
      next.snap.simple.qAll = null;
      next.snap.advanced.fieldSearch = null;
      next.snap.workTypes = "all";

      next.lastOrigin = MODE.CQL;
      break;
    }

    case "SET_WORKTYPE": {
      const wt = norm(action.workType);
      next.snap.workTypes = isNonEmpty(wt) ? wt : "all";
      break;
    }

    default:
      break;
  }

  dbgCORE("reduceCommit() out", { out: next });
  return next;
}

/* ---------- hydrateFromUrl ---------- */
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

  // workTypes fra URL (fallback = "all")
  let wtParam = query?.workTypes;
  if (Array.isArray(wtParam)) wtParam = wtParam[0];
  const urlWT = norm(wtParam);
  next.snap.workTypes = isNonEmpty(urlWT)
    ? urlWT
    : next.snap.workTypes || "all";

  // CQL-hydration: hvis vi står i CQL og har ?cql=..., så behandl som commit
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

  dbgCORE("hydrateFromUrl()", {
    currentMode,
    query,
    out: { snap: next.snap, lastOrigin: next.lastOrigin },
  });
  return next;
}

/* ---------- computeUrlForMode ---------- */
export function computeUrlForMode(targetMode, snap, lastOrigin) {
  const empty = () => ({ query: {} });

  const toAdvancedFromSimple = (qAll, wt) => {
    const fs = buildFSFromSimple(qAll);
    const seeded = injectWorkTypeIntoFS(fs, wt);
    return {
      query: {
        fieldSearch: seeded,
        ...(wt && wt !== "all" ? { workTypes: wt } : {}),
      },
    };
  };

  // Ned fra CQL er altid tom visning (ingen seed nedad)
  if (lastOrigin === MODE.CQL) {
    if (targetMode === MODE.ADVANCED || targetMode === MODE.SIMPLE) {
      const out = empty();
      dbgCORE("computeUrlForMode() out CQL→down (empty)", out);
      return out;
    }
  }

  if (targetMode === MODE.ADVANCED) {
    if (lastOrigin === MODE.SIMPLE && isNonEmpty(snap.simple.qAll)) {
      const wt = snap.workTypes || "all";
      const out = toAdvancedFromSimple(snap.simple.qAll, wt);
      dbgCORE("computeUrlForMode() out SIMPLE→ADV", out);
      return out;
    }
    if (lastOrigin === MODE.ADVANCED && isNonEmpty(snap.advanced.fieldSearch)) {
      const out = { query: { fieldSearch: snap.advanced.fieldSearch } };
      dbgCORE("computeUrlForMode() out ADV→ADV", out);
      return out;
    }
    const out = empty();
    dbgCORE("computeUrlForMode() out ADV empty", out);
    return out;
  }

  if (targetMode === MODE.CQL) {
    // *** NY: bliver du i CQL (efter at have været nede og kigge i simpel/adv), så behold cql i URL ***
    if (lastOrigin === MODE.CQL) {
      if (isNonEmpty(snap.cql.cql)) {
        const out = { query: { cql: snap.cql.cql } };
        dbgCORE("computeUrlForMode() out CQL→CQL keep", out);
        return out;
      }
      const out = empty();
      dbgCORE("computeUrlForMode() out CQL→CQL empty", out);
      return out;
    }

    if (lastOrigin === MODE.ADVANCED && isNonEmpty(snap.advanced.fieldSearch)) {
      const wt = snap.workTypes || "all";
      const out = {
        query: {
          fieldSearch: snap.advanced.fieldSearch,
          ...(wt && wt !== "all" ? { workTypes: wt } : {}),
        },
      };
      dbgCORE("computeUrlForMode() out ADV→CQL", out);
      return out;
    }
    if (lastOrigin === MODE.SIMPLE && isNonEmpty(snap.simple.qAll)) {
      const wt = snap.workTypes || "all";
      const out = toAdvancedFromSimple(snap.simple.qAll, wt);
      dbgCORE("computeUrlForMode() out SIMPLE→CQL", out);
      return out;
    }
    const out = empty();
    dbgCORE("computeUrlForMode() out CQL empty", out);
    return out;
  }

  if (targetMode === MODE.SIMPLE) {
    if (lastOrigin === MODE.SIMPLE && isNonEmpty(snap.simple.qAll)) {
      const wt = snap.workTypes || "all";
      const q = { "q.all": snap.simple.qAll };
      if (wt && wt !== "all") q.workTypes = wt;
      const out = { query: q };
      dbgCORE("computeUrlForMode() out SIMPLE→SIMPLE", out);
      return out;
    }
    const out = empty();
    dbgCORE("computeUrlForMode() out SIMPLE empty", out);
    return out;
  }

  const out = empty();
  dbgCORE("computeUrlForMode() out default empty", out);
  return out;
}
