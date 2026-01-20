// src/components/sample/epub/epub/useEpubReader.js
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  stripHashQuery,
  spineIndexOfDebug,
  normalizeToSpineHref,
  calcFileIntra,
  prettyLabelFromHref,
  buildFlatTocFromNav,
  prependMissingSpineSections,
  dedupeTocBySpineHref,
  computeEpubStructureScore,
  collapseToSingleSectionPreserveFrontmatter,
} from "./epubLogic";

import { deriveBookEdgesFromLoc } from "./epubNavUtils";

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
    const book = bookRef.current;
    if (!book) return;

    if (loc?.start?.cfi) lastCfiRef.current = loc.start.cfi;
    if (loc?.start?.href) lastHrefRef.current = loc.start.href;

    const currentSpineIdx =
      typeof loc?.start?.index === "number"
        ? loc.start.index
        : typeof loc?.start?.href === "string"
        ? spineIndexOfDebug(book, loc.start.href).idx
        : null;

    if (typeof currentSpineIdx !== "number") return;

    const edges = deriveBookEdgesFromLoc(
      { ...loc, start: { ...(loc?.start || {}), index: currentSpineIdx } },
      spineLenRef.current || 0
    );
    setAtBookStart(!!edges.derivedAtStart);
    setAtBookEnd(!!edges.derivedAtEnd);

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
        derivedAtStart: edges.derivedAtStart,
        derivedAtEnd: edges.derivedAtEnd,
        locAtStart: !!loc?.atStart,
        locAtEnd: !!loc?.atEnd,
      });
    }
  };

  // INIT (only when src changes / retryCount)
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

      if (!isZipArrayBuffer(src)) {
        throw new Error("EPUB buffer er ikke ZIP (mangler 'PK' header)");
      }

      const mod = await import("epubjs");
      const ePub = mod?.default || mod?.ePub || mod;
      if (typeof ePub !== "function") {
        throw new Error("epubjs import gav ikke en funktion");
      }

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

      // ---- TOC build ----
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

      // normalize to spine
      const filtered = [];
      for (const it of flat) {
        const hit = normalizeToSpineHref(book, it.href);
        if (!hit) continue;
        filtered.push({ ...it, href: hit });
      }

      // one section per spine href
      const deduped = dedupeTocBySpineHref(book, filtered);

      // add missing spine items before first toc (cover/title/etc.)
      let withFrontmatter = prependMissingSpineSections(book, deduped);

      // Decide structure mode (chapter vs fallback)
      const struct = computeEpubStructureScore(book, withFrontmatter);
      if (debugEnabled) log("STRUCT", struct);

      if (struct.mode === "fallback") {
        log("TOC looks messy → collapsing (preserve frontmatter) + Indhold");
        withFrontmatter = collapseToSingleSectionPreserveFrontmatter(
          book,
          withFrontmatter
        );
      }

      rebuildTocSpineIndex(book, withFrontmatter);
      setTocFlat(withFrontmatter);

      const spineLen = book?.spine?.spineItems?.length || 0;
      setProgressEnabled(!(spineLen > 1 && withFrontmatter.length <= 1));

      // Start at first spine item (cover) when possible
      let startTarget = null;
      try {
        const items = book?.spine?.spineItems || [];
        startTarget = items?.[0]?.href || null;
      } catch {}
      await rendition.display(startTarget || undefined);

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
    isFullscreen, // ok in init since you already had it, but it can also be removed
  ]);

  // Fullscreen toggle (kept)
  useEffect(() => {
    const host = viewerRef?.current;
    if (!host) return;

    let cancelled = false;

    (async () => {
      const r = renditionRef.current;
      if (!r) return;

      let loc = null;
      try {
        loc = r?.currentLocation?.();
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
        if (r.settings) {
          r.settings.minSpreadWidth = isFullscreen
            ? 0
            : Number.POSITIVE_INFINITY;
        }
      } catch {}

      await waitForLayout(host, 1600);
      if (cancelled) return;

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

  // ResizeObserver (kept)
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

      let rect;
      try {
        rect = host.getBoundingClientRect();
      } catch {
        return;
      }

      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w <= 16 || h <= 16) return;

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

  const safeLoc = (r) => {
    try {
      return r?.currentLocation?.() || null;
    } catch {
      return null;
    }
  };

  const getSpineIdxFromLoc = useCallback((loc) => {
    const book = bookRef.current;
    if (!loc || !book) return null;

    if (typeof loc?.start?.index === "number") return loc.start.index;
    if (typeof loc?.start?.href === "string") {
      const r = spineIndexOfDebug(book, loc.start.href);
      return typeof r.idx === "number" ? r.idx : null;
    }
    return null;
  }, []);

  const forceDisplaySpine = useCallback(async (delta) => {
    const r = renditionRef.current;
    const book = bookRef.current;
    if (!r || !book) return false;

    const loc = safeLoc(r);
    const href = loc?.start?.href || lastHrefRef.current || null;
    if (!href) return false;

    const cur = spineIndexOfDebug(book, href).idx;
    if (typeof cur !== "number") return false;

    const items = book?.spine?.spineItems || [];
    const nextIdx = cur + delta;
    if (nextIdx < 0 || nextIdx >= items.length) return false;

    const nextHref = items?.[nextIdx]?.href;
    if (!nextHref) return false;

    try {
      await r.display(nextHref);
      return true;
    } catch {
      return false;
    }
  }, []);

  /**
   * FIX: prev/next can "move" internally (change CFI/reflow) but still stay on same spine item.
   * We detect stuck by comparing spineIndex before/after.
   */
  const handlePrev = useCallback(async () => {
    const r = renditionRef.current;
    if (!r) return;

    const before = safeLoc(r);
    const beforeIdx = getSpineIdxFromLoc(before);
    const beforeIntra = calcFileIntra(before);

    try {
      await r.prev?.();
    } catch {}

    const after = safeLoc(r);
    const afterIdx = getSpineIdxFromLoc(after);

    // If we didn't change spine, and we're at file-start, force to previous spine item.
    const epsStart = 0.02;
    const atFileStart = !!before?.atStart || (beforeIntra ?? 0) <= epsStart;

    if (
      typeof beforeIdx === "number" &&
      typeof afterIdx === "number" &&
      beforeIdx === afterIdx &&
      beforeIdx > 0 &&
      atFileStart
    ) {
      if (debugEnabled)
        log("prev() stuck on same spine → force spine -1", {
          beforeIdx,
          afterIdx,
          beforeIntra,
          locAtStart: !!before?.atStart,
        });
      await forceDisplaySpine(-1);
    }
  }, [debugEnabled, forceDisplaySpine, getSpineIdxFromLoc]);

  const handleNext = useCallback(async () => {
    const r = renditionRef.current;
    if (!r) return;

    const before = safeLoc(r);
    const beforeIdx = getSpineIdxFromLoc(before);
    const beforeIntra = calcFileIntra(before);

    try {
      await r.next?.();
    } catch {}

    const after = safeLoc(r);
    const afterIdx = getSpineIdxFromLoc(after);

    const spineLen = spineLenRef.current || 0;
    const lastIdx = Math.max(0, spineLen - 1);

    // If we didn't change spine, and we're at file-end, force to next spine item.
    const epsEnd = 0.98;
    const atFileEnd = !!before?.atEnd || (beforeIntra ?? 1) >= epsEnd;

    if (
      typeof beforeIdx === "number" &&
      typeof afterIdx === "number" &&
      beforeIdx === afterIdx &&
      beforeIdx < lastIdx &&
      atFileEnd
    ) {
      if (debugEnabled)
        log("next() stuck on same spine → force spine +1", {
          beforeIdx,
          afterIdx,
          beforeIntra,
          locAtEnd: !!before?.atEnd,
        });
      await forceDisplaySpine(+1);
    }
  }, [debugEnabled, forceDisplaySpine, getSpineIdxFromLoc]);

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
