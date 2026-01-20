// src/components/sample/epub/epub/epubLogic.js

const CANDIDATE_PREFIXES = [
  "",
  "OPS/",
  "OEBPS/",
  "EPUB/",
  "Text/",
  "XHTML/",
  "xhtml/",
];

/**
 * Strip #fragment and ?query from href (used for grouping / comparison).
 */
export function stripHashQuery(s = "") {
  return String(s).split("#")[0].split("?")[0];
}

function normalizeHrefForMatch(s = "") {
  const raw = String(s);
  const noFrag = stripHashQuery(raw);

  let clean;
  try {
    clean = decodeURIComponent(noFrag);
  } catch {
    clean = noFrag;
  }

  const fileName = clean.split("/").pop();
  const unique = new Set([clean, fileName]);

  for (const p of CANDIDATE_PREFIXES) {
    if (p && clean.startsWith(p)) unique.add(clean.slice(p.length));
  }

  const bases = Array.from(unique);
  for (const b of bases) {
    for (const pref of CANDIDATE_PREFIXES) unique.add(pref + b);
  }

  return Array.from(new Set(Array.from(unique).filter(Boolean)));
}

/**
 * Find spine index for a given href using a few normalization candidates.
 * Returns { idx, hit } where `hit` is the candidate href that matched.
 */
export function spineIndexOfDebug(book, href) {
  if (!book || !href) return { idx: null, hit: null };
  for (const candidate of normalizeHrefForMatch(href)) {
    try {
      const item = book.spine?.get?.(candidate);
      if (item && typeof item.index === "number")
        return { idx: item.index, hit: candidate };
    } catch {}
  }
  return { idx: null, hit: null };
}

/**
 * Normalize an href to something that exists in the spine (if possible).
 */
export function normalizeToSpineHref(book, href) {
  const r = spineIndexOfDebug(book, href);
  return typeof r.idx === "number" ? r.hit || href : null;
}

/**
 * Compute intra progress inside the currently displayed "file".
 * Uses epubjs location displayed.page/total (best-effort).
 */
export function calcFileIntra(loc) {
  const s = loc?.start?.displayed?.page ?? 0;
  const e = loc?.end?.displayed?.page ?? s;
  const total = loc?.start?.displayed?.total ?? 0;
  if (!s || !total) return 0;

  const visible = Math.max(1, e - s + 1);
  const completed = Math.min(total, s + visible - 1);

  let intra = completed / total;
  if (loc?.atEnd || intra >= 0.995) intra = 1;
  return Math.max(0, Math.min(1, intra));
}

/**
 * Turn href file name into a nicer label if the TOC label is weak.
 */
export function prettyLabelFromHref(href, fallback = "Indhold") {
  const base = (String(href).split("/").pop() || fallback).replace(
    /\.(x?html?)$/i,
    ""
  );
  const b = base.toLowerCase();

  // Index-like, id-like, or too short => fallback
  if (
    /^index(_split)?[_-]?\d+$/i.test(b) ||
    /^index\d+$/i.test(b) ||
    /^id\d+$/i.test(b) ||
    b.length <= 3
  ) {
    return fallback;
  }

  return base.replace(/[_\-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Guess cover href from spine.
 */
export function guessCoverHref(book) {
  const items = book?.spine?.spineItems || [];
  const byProp = items.find((it) => /\bcover\b/i.test(it?.properties || ""));
  if (byProp?.href) return byProp.href;

  const byName = items.find(
    (it) => /cover/i.test(it?.idref || "") || /cover/i.test(it?.href || "")
  );
  if (byName?.href) return byName.href;

  return items[0]?.href || null;
}

/**
 * Flatten navigation toc.
 */
export function buildFlatTocFromNav(book) {
  const navToc = book?.navigation?.toc || [];
  const out = [];
  const walk = (n) => {
    if (n?.href) out.push({ href: n.href, label: n.label || "" });
    (n?.subitems || []).forEach(walk);
  };
  navToc.forEach(walk);
  return out;
}

/**
 * Heuristic: is a label junk / not meaningful.
 */
export function isBadLabel(raw) {
  const s = String(raw || "").trim();
  if (!s) return true;

  // Common “junk” labels
  if (s === "-" || s === "–" || s === "—") return true;
  if (s === "•" || s === "*" || s === "·") return true;

  if (s.length <= 1) return true;

  return false;
}

/**
 * Score a candidate label (higher is better).
 */
export function labelScore(raw) {
  const s = String(raw || "").trim();
  if (isBadLabel(s)) return -999;

  let score = 0;

  // Prefer chapter-ish labels
  const chapterRe = /^(kapitel|chapter)\s+\d+\b/i;
  if (chapterRe.test(s)) score += 40;

  // Prefer sensible length
  const len = s.length;
  if (len >= 6 && len <= 80) score += 20;
  else if (len > 80) score -= 10;
  else if (len < 6) score -= 10;

  // Penalize generic labels
  const genericRe = /^(indhold|content|toc|menu)$/i;
  if (genericRe.test(s)) score -= 25;

  // Penalize index-like
  const indexRe = /^(index|id)\d+$/i;
  if (indexRe.test(s)) score -= 20;

  return score;
}

export function pickBestLabel(candidates, fallback) {
  let best = null;
  let bestScore = -Infinity;

  for (const c of candidates || []) {
    const s = labelScore(c);
    if (s > bestScore) {
      bestScore = s;
      best = c;
    }
  }

  const chosen = String(best || "").trim();
  if (!chosen || isBadLabel(chosen)) return fallback;
  return chosen;
}

/**
 * ✅ Ensure "1 section per spine href".
 * Many epubs have toc entries like "chapter.xhtml#h1", "chapter.xhtml#h2", ...
 * They should NOT become multiple segments/progress bars.
 */
export function dedupeTocBySpineHref(book, tocFlat) {
  const groups = new Map();

  for (const it of tocFlat || []) {
    const href = it?.href;
    if (!href) continue;

    const baseHref = stripHashQuery(href);

    const r = spineIndexOfDebug(book, baseHref);
    const spineIdx = typeof r.idx === "number" ? r.idx : null;

    const key = spineIdx !== null ? `spine:${spineIdx}` : `href:${baseHref}`;

    if (!groups.has(key)) {
      groups.set(key, {
        href: r.hit || baseHref,
        labels: [],
        spineIdx,
      });
    }

    groups.get(key).labels.push(it?.label);
  }

  const arr = Array.from(groups.values());
  arr.sort((a, b) => {
    const ai = a.spineIdx ?? Number.POSITIVE_INFINITY;
    const bi = b.spineIdx ?? Number.POSITIVE_INFINITY;
    if (ai !== bi) return ai - bi;
    return 0;
  });

  return arr.map((g) => {
    const fallback = prettyLabelFromHref(g.href, "Indhold");
    const label = pickBestLabel(g.labels, fallback);
    return { href: g.href, label };
  });
}

/**
 * Ensure missing spine sections before first toc entry are prepended
 * (e.g. cover/title page that toc doesn't include).
 */
export function prependMissingSpineSections(book, filteredToc) {
  const spineItems = book?.spine?.spineItems || [];
  if (!spineItems.length) return filteredToc;

  const firstTocHref = filteredToc?.[0]?.href;
  const firstTocIdx = firstTocHref
    ? spineIndexOfDebug(book, firstTocHref).idx
    : null;

  const coverHref = guessCoverHref(book);
  const coverIdx = coverHref ? spineIndexOfDebug(book, coverHref).idx : null;

  if (!filteredToc?.length) {
    return spineItems
      .filter((it) => it?.href)
      .map((it, i) => {
        const href = it.href;
        const idx = spineIndexOfDebug(book, href).idx ?? i;
        const isCover =
          typeof coverIdx === "number" ? idx === coverIdx : /cover/i.test(href);
        return {
          href,
          label: isCover
            ? "Forside"
            : prettyLabelFromHref(href, `Indhold ${idx + 1}`),
        };
      });
  }

  if (typeof firstTocIdx !== "number") return filteredToc;

  const existing = new Set(
    (filteredToc || []).map((x) => stripHashQuery(x.href))
  );
  const prepend = [];

  for (let i = 0; i < firstTocIdx; i++) {
    const href = spineItems[i]?.href;
    if (!href) continue;

    const key = stripHashQuery(href);
    if (existing.has(key)) continue;

    const isCover =
      typeof coverIdx === "number" ? i === coverIdx : /cover/i.test(href);
    prepend.push({
      href,
      label: isCover
        ? "Forside"
        : prettyLabelFromHref(href, `Indhold ${i + 1}`),
    });
  }

  // Ensure cover explicitly
  if (typeof coverIdx === "number" && coverIdx >= 0) {
    const coverKey = stripHashQuery(
      spineItems[coverIdx]?.href || coverHref || ""
    );
    const hasCover = [...prepend, ...filteredToc].some(
      (x) => stripHashQuery(x.href) === coverKey
    );
    if (!hasCover && coverHref)
      prepend.unshift({ href: coverHref, label: "Forside" });
  }

  return prepend.length ? [...prepend, ...filteredToc] : filteredToc;
}

// -----------------------------
// NEW: "Solution A" trigger for Blå Stjerne style labels
// -----------------------------

function normalizeForUniq(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[._\-]+/g, " ")
    .trim();
}

function stripTrailingNumber(s) {
  return normalizeForUniq(s)
    .replace(/\s+\d+\s*$/g, "")
    .trim();
}

function detectTitleLikeRepetition(labels, metaTitle) {
  const cleanLabels = (labels || [])
    .map((l) => String(l || "").trim())
    .filter(Boolean);
  if (cleanLabels.length < 5) return { hit: false, ratio: 0 };

  const bases = cleanLabels.map((l) => stripTrailingNumber(l));
  const uniqBases = new Set(bases);

  // If almost everything shares the same base, we consider it "title-like repetition"
  const mostCommonBase = (() => {
    const m = new Map();
    for (const b of bases) m.set(b, (m.get(b) || 0) + 1);
    let best = { base: null, n: 0 };
    for (const [base, n] of m.entries()) if (n > best.n) best = { base, n };
    return best;
  })();

  const ratio = cleanLabels.length ? mostCommonBase.n / cleanLabels.length : 0;

  // Optionally align with metadata title (if provided)
  const titleBase = stripTrailingNumber(metaTitle || "");
  const matchesTitle =
    titleBase && mostCommonBase.base && mostCommonBase.base === titleBase;

  // We trigger if:
  // - a single base dominates (>= 0.75), OR
  // - it matches metadata title base with decent dominance (>= 0.6)
  const hit = ratio >= 0.75 || (matchesTitle && ratio >= 0.6);

  return { hit, ratio };
}

/**
 * Detect page-like / broken TOC structures and decide whether to fallback.
 * Returns { mode, score, reasons, metrics }
 */
export function computeEpubStructureScore(book, tocFlat, opts = {}) {
  const spineLen = book?.spine?.spineItems?.length || 0;
  const tocLen = tocFlat?.length || 0;

  const reasons = [];
  let score = 0;

  if (tocLen <= 1) {
    reasons.push("small-toc");
    score += 60;
  }

  // mapping stats (how many TOC hrefs map to spine)
  const mappedIdx = [];
  let invalidHref = 0;

  for (const it of tocFlat || []) {
    const hit = normalizeToSpineHref(book, it?.href);
    if (!hit) {
      invalidHref++;
      continue;
    }
    const r = spineIndexOfDebug(book, hit);
    if (typeof r.idx === "number") mappedIdx.push(r.idx);
    else invalidHref++;
  }

  const mapped = mappedIdx.length;
  const uniq = new Set(mappedIdx);
  const mappedUnique = uniq.size;

  const invalidHrefRatio = tocLen ? invalidHref / tocLen : 1;
  const dupSpineRatio = mapped ? (mapped - mappedUnique) / mapped : 0;

  const tocSpineRatio = spineLen ? mappedUnique / spineLen : 0;

  // label metrics
  const labels = (tocFlat || [])
    .map((x) => String(x?.label || "").trim())
    .filter(Boolean);

  const weakLabelRatio = labels.length
    ? labels.filter(
        (l) => isBadLabel(l) || /^index(\d+)?$/i.test(l) || /^id\d+$/i.test(l)
      ).length / labels.length
    : 1;

  const chapterRe = /^(kapitel|chapter)\s+\d+\b/i;
  const chapterRatio = labels.length
    ? labels.filter((l) => chapterRe.test(l)).length / labels.length
    : 0;

  const normalized = labels.map((l) =>
    l.toLowerCase().replace(/\d+/g, "#").replace(/\s+/g, " ").trim()
  );
  const uniqRatio = normalized.length
    ? new Set(normalized).size / normalized.length
    : 0;

  // scoring / reasons
  if (spineLen > 0 && tocLen > 0 && Math.abs(tocLen - spineLen) <= 2) {
    reasons.push("toc-close-to-spine-size");
    score += 20;
  }

  if (invalidHrefRatio >= 0.6) {
    reasons.push("many-toc-hrefs-not-in-spine");
    score += 35;
  }

  if (weakLabelRatio >= 0.6) {
    reasons.push("weak-or-index-like-labels");
    score += 25;
  }

  if (uniqRatio <= 0.35 && labels.length >= 10) {
    reasons.push("low-label-uniqueness");
    score += 20;
  }

  // NOTE: chapter-like labels can indicate "page-like chapters" for some ebooks.
  if (chapterRatio >= 0.75 && labels.length >= 10) {
    reasons.push("chapter-like-labels");
    score += 10;
  }

  // ✅ Solution A: repetitive title-like labels (Blå Stjerne / BlaaStjerne 1/2/3/4)
  const metaTitle = opts?.metaTitle || null;
  const rep = detectTitleLikeRepetition(labels, metaTitle);
  if (rep.hit) {
    reasons.push("repeated-title-like-labels");
    score += 35;
  }

  // Cap
  score = Math.max(0, Math.min(100, score));

  // We keep the existing threshold
  const mode = score >= 55 ? "fallback" : "chapter";

  return {
    mode,
    score,
    reasons,
    metrics: {
      spineLen,
      tocLen,
      mapped,
      mappedUnique,
      tocSpineRatio: Number.isFinite(tocSpineRatio)
        ? Number(tocSpineRatio.toFixed(3))
        : 0,
      invalidHrefRatio: Number.isFinite(invalidHrefRatio)
        ? Number(invalidHrefRatio.toFixed(3))
        : 0,
      dupSpineRatio: Number.isFinite(dupSpineRatio)
        ? Number(dupSpineRatio.toFixed(3))
        : 0,
      weakLabelRatio: Number.isFinite(weakLabelRatio)
        ? Number(weakLabelRatio.toFixed(3))
        : 0,
      chapterRatio: Number.isFinite(chapterRatio)
        ? Number(chapterRatio.toFixed(3))
        : 0,
      uniqRatio: Number.isFinite(uniqRatio) ? Number(uniqRatio.toFixed(3)) : 0,
      titleRepeatRatio: Number.isFinite(rep.ratio)
        ? Number(rep.ratio.toFixed(3))
        : 0,
    },
  };
}

/**
 * Decide whether UI should collapse into "frontmatter + Indhold".
 * This is intentionally separate from score.mode, so we can force collapse
 * for known-bad patterns (Solution A), without having to move thresholds too much.
 */
export function shouldCollapseToSingleSection(book, tocFlat, opts = {}) {
  const score = computeEpubStructureScore(book, tocFlat, opts);

  if (score.mode === "fallback") return true;

  // If the score didn't cross threshold, but we still hit the title-repeat pattern,
  // we can collapse anyway (this is what you wanted for Blå Stjerne style).
  if (score.reasons.includes("repeated-title-like-labels")) return true;

  return false;
}

/**
 * Collapse logic: keep frontmatter (Forside/Titel/Kolofon/etc.) + a single "Indhold" section.
 * Used when fallback/collapse is true.
 *
 * IMPORTANT: This function MUST NEVER return [] (otherwise progressbar disappears).
 */
export function collapseToSingleSectionPreserveFrontmatter(
  book,
  tocFlat,
  opts = {}
) {
  const spineItems = book?.spine?.spineItems || [];
  if (!spineItems.length) {
    // Absolute safety: if no spine, keep at least 1 item from toc, else synthesize.
    const first = tocFlat?.[0]?.href || null;
    return first
      ? [{ href: first, label: "Indhold" }]
      : [{ href: null, label: "Indhold" }];
  }

  const frontRe =
    /^(forside|cover|titel|titelblad|title\s?page|title|kolofon|copyright)\b/i;

  // Keep existing front entries from toc labels if present
  const frontEntries = (tocFlat || []).filter((it) =>
    frontRe.test(String(it?.label || "").trim())
  );

  const firstHref =
    spineItems.find((it) => it?.href)?.href || tocFlat?.[0]?.href || null;

  // If no detectable front entries, keep cover if we can, then Indhold
  if (!frontEntries.length) {
    const coverHref = guessCoverHref(book);
    const contentHref = findFirstContentHrefAfter(book, coverHref);
    const out = [];

    if (coverHref) out.push({ href: coverHref, label: "Forside" });
    out.push({ href: contentHref || firstHref, label: "Indhold" });

    return ensureNonEmptyToc(out, book);
  }

  // Find the last frontmatter spine index
  const frontIdx = [];
  for (const it of frontEntries) {
    const hit = normalizeToSpineHref(book, it.href);
    if (!hit) continue;
    const r = spineIndexOfDebug(book, hit);
    if (typeof r.idx === "number") frontIdx.push(r.idx);
  }

  const lastFrontSpineIdx = frontIdx.length ? Math.max(...frontIdx) : 0;

  // Keep unique front spine hrefs (stable)
  const kept = [];
  const keptKeys = new Set();

  for (const it of tocFlat || []) {
    const hit = normalizeToSpineHref(book, it.href);
    if (!hit) continue;
    const idx = spineIndexOfDebug(book, hit).idx;
    if (typeof idx === "number" && idx <= lastFrontSpineIdx) {
      const key = stripHashQuery(hit);
      if (!keptKeys.has(key)) {
        keptKeys.add(key);
        kept.push({ ...it, href: hit });
      }
    }
  }

  // Ensure cover explicitly if possible
  const coverHref = guessCoverHref(book);
  if (coverHref) {
    const coverKey = stripHashQuery(coverHref);
    const hasCover = kept.some((x) => stripHashQuery(x.href) === coverKey);
    if (!hasCover) kept.unshift({ href: coverHref, label: "Forside" });
  }

  // Pick a content href right after frontmatter
  let contentHref = null;
  for (let i = lastFrontSpineIdx + 1; i < spineItems.length; i++) {
    const href = spineItems[i]?.href;
    if (href) {
      contentHref = href;
      break;
    }
  }
  if (!contentHref)
    contentHref = findFirstContentHrefAfter(book, coverHref) || firstHref;

  // Add Indhold section if not already present
  const contentKey = contentHref ? stripHashQuery(contentHref) : null;
  const hasAlready = contentKey
    ? kept.some((x) => stripHashQuery(x.href) === contentKey)
    : false;

  const out = hasAlready
    ? kept
    : [...kept, { href: contentHref, label: "Indhold" }];

  return ensureNonEmptyToc(out, book);
}

function findFirstContentHrefAfter(book, coverHref) {
  const spineItems = book?.spine?.spineItems || [];
  if (!spineItems.length) return null;

  let start = 0;
  if (coverHref) {
    const r = spineIndexOfDebug(book, coverHref);
    if (typeof r.idx === "number") start = Math.max(0, r.idx);
  }

  // Skip obvious cover/title/colophon-ish
  const skipRe = /(cover|title|titel|kolofon|colophon|copyright)/i;

  for (let i = start; i < spineItems.length; i++) {
    const href = spineItems[i]?.href;
    if (!href) continue;
    if (skipRe.test(href)) continue;
    return href;
  }

  return spineItems[0]?.href || null;
}

function ensureNonEmptyToc(arr, book) {
  const cleaned = (arr || []).filter(
    (x) => x && (x.href || x.href === null) && String(x.label || "").trim()
  );
  if (cleaned.length) return cleaned;

  const firstHref = book?.spine?.spineItems?.[0]?.href || null;
  return [{ href: firstHref, label: "Indhold" }];
}
