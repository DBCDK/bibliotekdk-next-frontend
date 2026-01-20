"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const CANDIDATE_PREFIXES = [
  "",
  "OPS/",
  "OEBPS/",
  "EPUB/",
  "Text/",
  "XHTML/",
  "xhtml/",
];

function clearViewerEl(el) {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}

function isZipArrayBuffer(ab) {
  try {
    const u8 = new Uint8Array(ab);
    return u8.length >= 2 && u8[0] === 0x50 && u8[1] === 0x4b;
  } catch {
    return false;
  }
}

function normalizeHrefForMatch(s = "") {
  const raw = String(s);
  const noFrag = raw.split("#")[0].split("?")[0];
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

function spineIndexOfDebug(book, href) {
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

function normalizeToSpineHref(book, href) {
  const r = spineIndexOfDebug(book, href);
  return typeof r.idx === "number" ? r.hit || href : null;
}

function stripHashQuery(s = "") {
  return String(s).split("#")[0].split("?")[0];
}

function calcFileIntra(loc) {
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

function prettyLabelFromHref(href, fallback = "Indhold") {
  const base = (href.split("/").pop() || fallback).replace(/\.(x?html?)$/i, "");
  const b = base.toLowerCase();

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

function guessCoverHref(book) {
  const items = book?.spine?.spineItems || [];
  const byProp = items.find((it) => /\bcover\b/i.test(it?.properties || ""));
  if (byProp?.href) return byProp.href;

  const byName = items.find(
    (it) => /cover/i.test(it?.idref || "") || /cover/i.test(it?.href || "")
  );
  if (byName?.href) return byName.href;

  return items[0]?.href || null;
}

function injectStyle(doc) {
  if (!doc) return;
  if (doc.getElementById("dbc-epub-style")) return;

  const style = doc.createElement("style");
  style.id = "dbc-epub-style";
  style.textContent = `
    html, body { height: 100% !important; margin:0 !important; padding:0 !important; }
    body {
      background: var(--epub-page-bg);
      color: var(--epub-page-fg);
      font-family: var(--epub-page-font, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif);
      line-height: var(--epub-page-line-height, 1.55);
      box-sizing: border-box;
    }
    img { max-width: 100% !important; height: auto !important; }
    header, footer, .watermark, .ad { display: none !important; }
    a, a * { pointer-events: auto !important; cursor: pointer !important; }
    a { color: var(--epub-link-fg) !important; text-decoration: var(--epub-link-decoration, underline) !important; }

    /* Cover centering */
    section.cover, section[epub\\:type~="cover"], [epub\\:type~="cover"] {
      height: 100% !important;
      display: grid !important;
      place-items: center !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
    }
    section.cover svg, section[epub\\:type~="cover"] svg {
      max-width: 100% !important;
      max-height: 100% !important;
      width: auto !important;
      height: auto !important;
    }
    section.cover img, section[epub\\:type~="cover"] img {
      max-width: 100% !important;
      max-height: 100% !important;
      object-fit: contain !important;
    }
  `;
  doc.head?.appendChild(style);
}

function buildFlatTocFromNav(book) {
  const navToc = book?.navigation?.toc || [];
  const out = [];
  const walk = (n) => {
    if (n?.href) out.push({ href: n.href, label: n.label || "" });
    (n?.subitems || []).forEach(walk);
  };
  navToc.forEach(walk);
  return out;
}

function prependMissingSpineSections(book, filteredToc) {
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

  const existing = new Set(filteredToc.map((x) => stripHashQuery(x.href)));
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

function waitForLayout(el, timeoutMs = 1400) {
  if (!el) return Promise.resolve();
  const start = Date.now();

  const hasSize = () => {
    const r = el.getBoundingClientRect();
    return r.width > 16 && r.height > 16;
  };

  if (hasSize()) return Promise.resolve();

  return new Promise((resolve) => {
    const ro = new ResizeObserver(() => {
      if (hasSize()) {
        try {
          ro.disconnect();
        } catch {}
        resolve();
      }
    });
    ro.observe(el);

    const t = setInterval(() => {
      if (hasSize() || Date.now() - start > timeoutMs) {
        clearInterval(t);
        try {
          ro.disconnect();
        } catch {}
        resolve();
      }
    }, 60);
  });
}

function shouldCollapseToSingleSection(book, tocFlat) {
  try {
    const spineLen = book?.spine?.spineItems?.length || 0;
    if (spineLen < 2) return false;

    if (!tocFlat?.length || tocFlat.length < 10) return false;

    const labels = tocFlat
      .map((x) => String(x?.label || "").trim())
      .filter(Boolean);

    if (labels.length < 10) return false;

    const chapterRe = /^(kapitel|chapter)\s+\d+\b/i;
    const chapterHits = labels.filter((l) => chapterRe.test(l)).length;
    const chapterRatio = chapterHits / labels.length;

    const normalized = labels.map((l) =>
      l.toLowerCase().replace(/\d+/g, "#").replace(/\s+/g, " ").trim()
    );
    const uniq = new Set(normalized);
    const uniqRatio = uniq.size / normalized.length;

    if (chapterRatio >= 0.75) return true;
    if (uniqRatio <= 0.35) return true;

    return false;
  } catch {
    return false;
  }
}

function collapseToSingleSectionPreserveFrontmatter(book, tocFlat) {
  const spineItems = book?.spine?.spineItems || [];
  if (!spineItems.length) return tocFlat;

  const frontRe =
    /^(forside|cover|titel|titelblad|title\s?page|title|kolofon|copyright)\b/i;

  const frontEntries = (tocFlat || []).filter((it) =>
    frontRe.test(String(it?.label || "").trim())
  );

  const firstHref =
    spineItems.find((it) => it?.href)?.href || tocFlat?.[0]?.href || null;
  if (!frontEntries.length)
    return firstHref ? [{ href: firstHref, label: "Indhold" }] : tocFlat;

  const frontIdx = [];
  for (const it of frontEntries) {
    const r = spineIndexOfDebug(book, it.href);
    if (typeof r.idx === "number") frontIdx.push(r.idx);
  }
  if (!frontIdx.length)
    return firstHref ? [{ href: firstHref, label: "Indhold" }] : tocFlat;

  const lastFrontSpineIdx = Math.max(...frontIdx);

  // Keep all TOC entries that map to spine <= lastFrontSpineIdx
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

  // Find first spine href AFTER frontmatter
  let contentHref = null;
  for (let i = lastFrontSpineIdx + 1; i < spineItems.length; i++) {
    const href = spineItems[i]?.href;
    if (href) {
      contentHref = href;
      break;
    }
  }
  if (!contentHref) contentHref = firstHref;

  if (!contentHref) return kept.length ? kept : tocFlat;

  const contentKey = stripHashQuery(contentHref);
  const hasAlready = kept.some((x) => stripHashQuery(x.href) === contentKey);
  return hasAlready ? kept : [...kept, { href: contentHref, label: "Indhold" }];
}

export function useEpubReader({
  src,
  isFullscreen,
  containerRef, // kept for compatibility
  viewerRef,
  debugEnabled = false,
  bookId,
  title,
}) {
  void containerRef;
  const [status, setStatus] = useState("idle");
  const [initError, setInitError] = useState(null);

  const [tocFlat, setTocFlat] = useState([]);
  const [segIndex, setSegIndex] = useState(0);
  const [chapterIntra, setChapterIntra] = useState(0);

  const [atBookStart, setAtBookStart] = useState(false);
  const [atBookEnd, setAtBookEnd] = useState(false);
  const [progressEnabled, setProgressEnabled] = useState(true);

  const [retryCount, setRetryCount] = useState(0);

  const bookRef = useRef(null);
  const renditionRef = useRef(null);

  const tocSpineIdxRef = useRef([]);
  const spineLenRef = useRef(0);

  const lastCfiRef = useRef(null);
  const lastHrefRef = useRef(null);

  const genRef = useRef(0);
  const failedKeyRef = useRef(null);

  // resize guard
  const lastRectRef = useRef({ w: 0, h: 0 });

  const log = (...a) => debugEnabled && console.log("[EPUB]", ...a);

  const destroyEpub = useCallback(() => {
    try {
      renditionRef.current?.destroy?.();
    } catch {}
    try {
      bookRef.current?.destroy?.();
    } catch {}
    renditionRef.current = null;
    bookRef.current = null;
  }, []);

  const retry = useCallback(() => {
    failedKeyRef.current = null;
    setInitError(null);
    setStatus("idle");
    setRetryCount((c) => c + 1);
  }, []);

  const rebuildTocSpineIndex = useCallback((book, flat) => {
    if (!book || !flat?.length) {
      tocSpineIdxRef.current = [];
      return;
    }
    tocSpineIdxRef.current = flat.map((entry) => {
      const r = spineIndexOfDebug(book, entry.href);
      return typeof r.idx === "number" ? r.idx : null;
    });
  }, []);

  const segmentFromSpine = useCallback((spineIdx) => {
    const map = tocSpineIdxRef.current;
    if (!map.length || typeof spineIdx !== "number") return 0;
    let seg = 0;
    for (let j = 0; j < map.length; j++) {
      const m = map[j];
      if (typeof m === "number" && m <= spineIdx) seg = j;
    }
    return seg;
  }, []);

  const segmentBounds = useCallback((seg) => {
    const map = tocSpineIdxRef.current;
    const spineLen = spineLenRef.current || 0;

    const start = typeof map?.[seg] === "number" ? map[seg] : 0;

    let next = null;
    for (let i = seg + 1; i < map.length; i++) {
      if (typeof map[i] === "number") {
        next = map[i];
        break;
      }
    }

    const end =
      typeof next === "number"
        ? Math.max(start, next - 1)
        : Math.max(start, spineLen - 1);

    const count = Math.max(1, end - start + 1);
    return { start, end, count };
  }, []);

  const onRelocatedRef = useRef(null);
  onRelocatedRef.current = (loc) => {
    setAtBookEnd(!!loc?.atEnd);
    setAtBookStart(!!loc?.atStart);

    if (loc?.start?.cfi) lastCfiRef.current = loc.start.cfi;
    if (loc?.start?.href) lastHrefRef.current = loc.start.href;

    const book = bookRef.current;
    if (!book) return;

    const currentSpineIdx =
      typeof loc?.start?.index === "number"
        ? loc.start.index
        : typeof loc?.start?.href === "string"
        ? spineIndexOfDebug(book, loc.start.href).idx
        : null;

    if (typeof currentSpineIdx !== "number") return;

    const seg = segmentFromSpine(currentSpineIdx);
    setSegIndex((prev) => (seg !== prev ? seg : prev));

    const fileIntra = calcFileIntra(loc);
    const { start, count } = segmentBounds(seg);

    const offset = Math.max(0, Math.min(count - 1, currentSpineIdx - start));
    const segIntra = Math.max(0, Math.min(1, (offset + fileIntra) / count));
    setChapterIntra(segIntra);

    if (debugEnabled) {
      log("relocated", {
        seg,
        currentSpineIdx,
        fileIntra,
        segStart: start,
        segCount: count,
        segIntra,
        href: loc?.start?.href,
        cfi: loc?.start?.cfi,
      });
    }
  };

  // ✅ INIT: only when src changes (or retryCount), NOT isFullscreen
  useEffect(() => {
    if (!(src instanceof ArrayBuffer)) return;
    if (!viewerRef?.current) return;

    const initKey = `${bookId || ""}:${src.byteLength}`;
    if (failedKeyRef.current === initKey) return;

    const gen = ++genRef.current;

    setStatus("loading");
    setInitError(null);

    setTocFlat([]);
    setSegIndex(0);
    setChapterIntra(0);
    setAtBookStart(false);
    setAtBookEnd(false);
    setProgressEnabled(true);

    lastCfiRef.current = null;
    lastHrefRef.current = null;

    let cancelled = false;

    (async () => {
      destroyEpub();
      clearViewerEl(viewerRef.current);

      await waitForLayout(viewerRef.current);

      if (!isZipArrayBuffer(src))
        throw new Error("EPUB buffer er ikke ZIP (mangler 'PK' header)");

      const mod = await import("epubjs");
      const ePub = mod?.default || mod?.ePub || mod;
      if (typeof ePub !== "function")
        throw new Error("epubjs import gav ikke en funktion");

      if (cancelled || genRef.current !== gen) return;

      const book = ePub({
        replacements: "blobUrl",
        encoding: "binary",
        openAs: "binary",
      });
      bookRef.current = book;

      await book.open(src, "binary");
      await book.ready;
      await Promise.resolve(book.loaded?.spine);
      try {
        await Promise.resolve(book.loaded?.navigation);
      } catch {}

      spineLenRef.current = book?.spine?.spineItems?.length || 0;

      if (cancelled || genRef.current !== gen) return;

      const rendition = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
        flow: "paginated",
        spread: isFullscreen ? "both" : "none",
        minSpreadWidth: isFullscreen ? 0 : Number.POSITIVE_INFINITY,
      });
      renditionRef.current = rendition;

      try {
        rendition.hooks?.content?.register?.((contents) =>
          injectStyle(contents?.document)
        );
      } catch {}

      const relocatedHandler = (loc) => onRelocatedRef.current?.(loc);
      rendition.on("relocated", relocatedHandler);

      // TOC
      let flat = buildFlatTocFromNav(book);
      if (!flat.length) {
        const spineItems = book?.spine?.spineItems || [];
        flat = spineItems
          .filter((it) => it?.href)
          .map((it, i) => ({
            href: it.href,
            label: prettyLabelFromHref(it.href, `Indhold ${i + 1}`),
          }));
      }

      const filtered = [];
      for (const it of flat) {
        const hit = normalizeToSpineHref(book, it.href);
        if (!hit) continue;
        filtered.push({ ...it, href: hit });
      }

      let withFrontmatter = prependMissingSpineSections(book, filtered);

      if (shouldCollapseToSingleSection(book, withFrontmatter)) {
        log(
          "TOC looks page-like → collapsing (preserve frontmatter) + Indhold"
        );
        withFrontmatter = collapseToSingleSectionPreserveFrontmatter(
          book,
          withFrontmatter
        );
      }

      rebuildTocSpineIndex(book, withFrontmatter);
      setTocFlat(withFrontmatter);

      const spineLen = book?.spine?.spineItems?.length || 0;
      setProgressEnabled(!(spineLen > 1 && withFrontmatter.length <= 1));

      await rendition.display();

      if (cancelled || genRef.current !== gen) return;

      failedKeyRef.current = null;
      setStatus("ready");
      log("READY", { title, initKey, retryCount });
    })().catch((e) => {
      if (cancelled || genRef.current !== gen) return;
      failedKeyRef.current = `${bookId || ""}:${src.byteLength}`;
      setStatus("error");
      setInitError(e);
      log("INIT ERROR", e);
    });

    return () => {
      cancelled = true;
      genRef.current++;
      destroyEpub();
      clearViewerEl(viewerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    src,
    viewerRef,
    destroyEpub,
    rebuildTocSpineIndex,
    debugEnabled,
    bookId,
    title,
    retryCount,
  ]);

  // ✅ Apply fullscreen layout WITHOUT resetting location (guarded)
  useEffect(() => {
    const host = viewerRef?.current;
    if (!host) return;

    let cancelled = false;

    (async () => {
      // read live ref as late as possible
      const r = renditionRef.current;
      if (!r) return;

      let loc = null;
      try {
        loc =
          typeof r.currentLocation === "function" ? r.currentLocation() : null;
      } catch {
        loc = null;
      }

      const target =
        loc?.start?.cfi ||
        lastCfiRef.current ||
        loc?.start?.href ||
        lastHrefRef.current ||
        null;

      if (debugEnabled) log("fullscreen toggle", { isFullscreen, target });

      try {
        r.spread?.(isFullscreen ? "both" : "none");
      } catch {}
      try {
        if (r.settings)
          r.settings.minSpreadWidth = isFullscreen
            ? 0
            : Number.POSITIVE_INFINITY;
      } catch {}

      await waitForLayout(host, 1600);
      if (cancelled) return;

      // read live ref again after await
      const r2 = renditionRef.current;
      if (!r2) return;

      try {
        const rect = host.getBoundingClientRect();
        r2.resize?.(Math.floor(rect.width), Math.floor(rect.height));
      } catch {}

      try {
        r2.reflow?.();
      } catch {}
      try {
        r2.reformat?.();
      } catch {}

      if (target) {
        try {
          await r2.display(target);
        } catch (e) {
          if (debugEnabled) log("display(target) failed on toggle", e);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isFullscreen, viewerRef, debugEnabled]);

  /**
   * ✅ ResizeObserver for viewer (debounced + safe)
   * Key changes vs earlier:
   * - hard guards against teardown races (destroyed flag + live ref reads)
   * - avoids calling currentLocation on undefined
   * - avoids calling display() on resize (huge spam + races)
   * - avoids loops by only resizing when width/height changed
   */
  useEffect(() => {
    const host = viewerRef?.current;
    if (!host) return;

    let raf = null;
    let t = null;
    let destroyed = false;

    const run = () => {
      if (destroyed) return;

      const r = renditionRef.current;
      if (!r) return;

      // Only act if host has real size
      let rect;
      try {
        rect = host.getBoundingClientRect();
      } catch {
        return;
      }

      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w <= 16 || h <= 16) return;

      // Avoid feedback loops / spam when size didn't change
      if (lastRectRef.current.w === w && lastRectRef.current.h === h) return;
      lastRectRef.current = { w, h };

      try {
        r.resize?.(w, h);
      } catch {}

      try {
        r.reflow?.();
      } catch {}
      try {
        r.reformat?.();
      } catch {}

      // NOTE: intentionally no r.display(...) here.
      // Relocation is handled by epubjs and your fullscreen toggle logic.
    };

    const onResize = () => {
      if (destroyed) return;

      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (destroyed) return;
        if (t) clearTimeout(t);
        t = setTimeout(run, 120);
      });
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(host);

    return () => {
      destroyed = true;
      if (raf) cancelAnimationFrame(raf);
      if (t) clearTimeout(t);
      try {
        ro.disconnect();
      } catch {}
    };
  }, [viewerRef]);

  const segments = Math.max(1, tocFlat.length || 1);

  const labels = useMemo(() => {
    return (tocFlat || []).map((it, idx) => ({
      ...it,
      hrefNorm: stripHashQuery(it.href),
      active: idx === segIndex,
    }));
  }, [tocFlat, segIndex]);

  const handlePrev = useCallback(async () => {
    try {
      await renditionRef.current?.prev?.();
    } catch {}
  }, []);

  const handleNext = useCallback(async () => {
    try {
      await renditionRef.current?.next?.();
    } catch {}
  }, []);

  const handleJump = useCallback(async (href) => {
    const r = renditionRef.current;
    const book = bookRef.current;
    if (!r || !book || !href) return;

    const hit = normalizeToSpineHref(book, href) || href;
    try {
      await r.display(hit);
    } catch {}
  }, []);

  return {
    status,
    initError,

    labels,
    segments,

    segIndex,
    chapterIntra,

    atBookStart,
    atBookEnd,

    handlePrev,
    handleNext,
    handleJump,

    progressEnabled,

    retry,
  };
}
