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
  hasRedundantLeadingCover,
} from "./epubLogic";

import { deriveBookEdgesFromLoc } from "./epubNavUtils";

const FULLSCREEN_MIN_SPREAD_WIDTH = 800;

function parseBoolLike(v) {
  const s = String(v ?? "")
    .trim()
    .toLowerCase();
  return s === "true" || s === "1" || s === "yes";
}

function detectFixedLayoutBook(book) {
  const md = book?.packaging?.metadata || book?.package?.metadata || {};
  const layout = String(md?.layout || "")
    .trim()
    .toLowerCase();
  if (layout === "pre-paginated") return true;

  const fixedLayoutOpt = book?.displayOptions?.fixedLayout;
  if (parseBoolLike(fixedLayoutOpt)) return true;

  const spineItems = book?.spine?.spineItems || [];
  return spineItems.some((it) =>
    /\bpage-spread-(left|right|center)\b/i.test(it?.properties || "")
  );
}

function ensureFixedSpreadProperties(book, log) {
  const items = book?.spine?.spineItems || [];
  if (!items.length) return { patched: false, count: 0, reason: "no-spine" };

  const hasAnyDeclared = items.some((it) =>
    /\bpage-spread-(left|right|center)\b/i.test(it?.properties || "")
  );
  if (hasAnyDeclared)
    return { patched: false, count: 0, reason: "already-declared" };

  let count = 0;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const existing = String(it?.properties || "").trim();

    // Common fixed-layout convention:
    // cover (index 0) stands alone as right page, then alternating left/right.
    const spread =
      i === 0
        ? "page-spread-right"
        : i % 2 === 1
        ? "page-spread-left"
        : "page-spread-right";

    const next = existing ? `${existing} ${spread}` : spread;
    if (it && it.properties !== next) {
      it.properties = next;
      count++;
    }
  }

  if (typeof log === "function") {
    const preview = items.slice(0, 6).map((it, idx) => ({
      idx,
      href: it?.href || null,
      properties: it?.properties || "",
    }));
    log("fixed spread props synthesized", { count, preview });
  }

  return { patched: count > 0, count, reason: "synthesized" };
}

function getSpreadPolicy({ fullscreen, isFixedLayout }) {
  if (isFixedLayout) {
    if (fullscreen) {
      return {
        spread: "auto",
        minSpreadWidth: FULLSCREEN_MIN_SPREAD_WIDTH,
        reason: "fixed-layout-fullscreen",
      };
    }
    return {
      spread: "none",
      minSpreadWidth: Number.POSITIVE_INFINITY,
      reason: "fixed-layout-nonfullscreen",
    };
  }

  return {
    spread: fullscreen ? "auto" : "none",
    minSpreadWidth: FULLSCREEN_MIN_SPREAD_WIDTH,
    reason: fullscreen ? "fullscreen" : "default",
  };
}

function applySpreadForWidth(rendition, opts) {
  if (!rendition) return;
  const policy = getSpreadPolicy(opts || {});
  try {
    rendition.spread?.(policy.spread, policy.minSpreadWidth);
  } catch {}
  return policy;
}

function getFixedSpreadAnchorIndexForBook(book, idx) {
  const items = book?.spine?.spineItems || [];
  if (!items.length || typeof idx !== "number") return null;

  if (idx <= 0) return 0; // cover stays single

  const prop = (i) => String(items?.[i]?.properties || "");
  const isLeft = (i) => /\bpage-spread-left\b/i.test(prop(i));
  const isRight = (i) => /\bpage-spread-right\b/i.test(prop(i));

  if (isLeft(idx)) return idx;
  if (isRight(idx) && isLeft(idx - 1)) return idx - 1;

  // Fallback for fixed-layout books without reliable page-spread props
  return idx % 2 === 1 ? idx : Math.max(1, idx - 1);
}

function clearViewerEl(el) {
  if (!el) return;
  while (el.firstChild) el.removeChild(el.firstChild);
}

function parsePxValue(raw) {
  if (raw == null) return null;
  const n = Number.parseFloat(String(raw));
  return Number.isFinite(n) ? n : null;
}

function parseScaleFromTransform(raw) {
  const s = String(raw || "");
  const mScale = s.match(/scale\(\s*([0-9.]+)\s*\)/i);
  if (mScale) {
    const n = Number.parseFloat(mScale[1]);
    return Number.isFinite(n) ? n : null;
  }
  const mMatrix = s.match(/matrix\(\s*([0-9.+-eE]+)\s*,/i);
  if (mMatrix) {
    const n = Number.parseFloat(mMatrix[1]);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function centerFixedBodyInSinglePage(contents, log) {
  const doc = contents?.document;
  const win = contents?.window;
  const body = doc?.body;
  if (!doc || !win || !body) return;

  const frameW = Math.floor(
    win.innerWidth || doc.documentElement?.clientWidth || 0
  );
  const hasTouchPoints =
    typeof win.navigator !== "undefined" &&
    Number(win.navigator.maxTouchPoints) > 0;
  const coarsePointer =
    typeof win.matchMedia === "function" &&
    win.matchMedia("(pointer: coarse)").matches;
  const isMobileLike = (hasTouchPoints || coarsePointer) && frameW < 576;
  const desiredMobileGutter = isMobileLike ? 16 : 0;

  const frameEl = win.frameElement;
  if (frameEl?.style) {
    try {
      frameEl.style.boxSizing = "border-box";
      frameEl.style.paddingLeft = desiredMobileGutter
        ? `${desiredMobileGutter}px`
        : "0px";
      frameEl.style.paddingRight = desiredMobileGutter
        ? `${desiredMobileGutter}px`
        : "0px";
    } catch {}
  }

  const bodyW =
    parsePxValue(body.style.width) ||
    parsePxValue(win.getComputedStyle(body).width) ||
    null;
  const scale =
    parseScaleFromTransform(body.style.transform) ||
    parseScaleFromTransform(win.getComputedStyle(body).transform) ||
    1;
  if (!frameW || !bodyW) return;

  const visualW = bodyW * (scale || 1);
  const usableFrameW = Math.max(0, frameW - desiredMobileGutter * 2);
  const marginLeft = Math.max(0, Math.floor((usableFrameW - visualW) / 2));

  try {
    body.style.setProperty("margin-left", `${marginLeft}px`, "important");
    body.style.setProperty("margin-right", "0px", "important");
  } catch {}

  if (typeof log === "function") {
    log("single-page centering", {
      href: contents?.section?.href || null,
      frameW,
      bodyW,
      scale,
      styleTransform: body.style.transform || "",
      computedTransform: win.getComputedStyle(body).transform || "",
      desiredMobileGutter,
      marginLeft,
    });
  }
}

function isZipArrayBuffer(ab) {
  try {
    const u8 = new Uint8Array(ab);
    return u8.length >= 2 && u8[0] === 0x50 && u8[1] === 0x4b;
  } catch {
    return false;
  }
}

function injectStyle(doc, { isFixedLayout = false } = {}) {
  if (!doc) return;
  if (doc.getElementById("dbc-epub-style")) return;

  const style = doc.createElement("style");
  style.id = "dbc-epub-style";
  if (isFixedLayout) {
    // Fixed-layout pages rely on author CSS (absolute positioning / clipping).
    style.textContent = `
      html {
        margin:0 !important;
        padding:0 !important;
        overflow:hidden !important;
        touch-action: pan-y pinch-zoom !important;
      }
      body {
        margin-top: 0 !important;
        margin-right: 0 !important;
        margin-bottom: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        box-sizing: border-box;
        touch-action: pan-y pinch-zoom !important;
      }
      a, a * { pointer-events: auto !important; cursor: pointer !important; }
    `;
  } else {
    style.textContent = `
      html, body { height: 100% !important; margin:0 !important; padding:0 !important; }
      body {
        background: var(--epub-page-bg);
        color: var(--epub-page-fg);
        font-family: var(--epub-page-font, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif);
        line-height: var(--epub-page-line-height, 1.55);
        box-sizing: border-box;
        touch-action: pan-y pinch-zoom !important;
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
  }
  doc.head?.appendChild(style);
}

function registerSwipeHandlers(doc, swipeEnabledRef, handlersRef) {
  if (!doc) return;

  let start = null;
  let pointerId = null;
  const boundFlag = "__dbcSwipeBound";

  const isInteractive = (el) =>
    !!el?.closest?.("a,button,input,select,textarea,label");

  if (doc[boundFlag]) return;
  doc[boundFlag] = true;

  const reset = () => {
    start = null;
    pointerId = null;
  };

  const begin = (x, y) => {
    start = {
      x,
      y,
      lastX: x,
      lastY: y,
      time: Date.now(),
      blocked: false,
      cancelledVertical: false,
    };
  };

  const onTouchStart = (e) => {
    if (!swipeEnabledRef.current) return;
    if (isInteractive(e.target)) return;
    const t = e.touches?.[0];
    if (!t) return;
    begin(t.clientX, t.clientY);
  };

  const onTouchMove = (e) => {
    if (!swipeEnabledRef.current || !start) return;
    const t = e.touches?.[0];
    if (!t) return;

    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    start.lastX = t.clientX;
    start.lastY = t.clientY;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (!start.blocked && absX > 10 && absX > absY * 1.1) {
      start.blocked = true;
      try {
        e.preventDefault();
      } catch {}
    }
    if (absY > 18 && absY > absX * 1.2) {
      start.cancelledVertical = true;
    }
  };

  const finish = (x, y) => {
    if (!swipeEnabledRef.current || !start) return;

    const dx = x - start.x;
    const dy = y - start.y;
    const startedAt = start.time;
    const cancelledVertical = !!start.cancelledVertical;
    reset();

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const elapsed = Date.now() - startedAt;

    if (cancelledVertical) return;
    if (absX < 28 || absX < absY * 1.05) return;
    if (elapsed > 900) return;

    const { next, prev } = handlersRef.current || {};
    if (dx < 0) next?.();
    else prev?.();
  };

  const onTouchEnd = (e) => {
    if (!start) return;
    const t = e.changedTouches?.[0];
    finish(t?.clientX ?? start.lastX, t?.clientY ?? start.lastY);
  };

  const onPointerDown = (e) => {
    if (!swipeEnabledRef.current) return;
    if (isInteractive(e.target)) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.isPrimary === false) return;
    pointerId = e.pointerId;
    begin(e.clientX, e.clientY);
  };

  const onPointerMove = (e) => {
    if (!start || pointerId !== e.pointerId) return;
    if (e.pointerType === "mouse" && e.buttons === 0) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start.lastX = e.clientX;
    start.lastY = e.clientY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absY > 18 && absY > absX * 1.2) {
      start.cancelledVertical = true;
    }
  };

  const onPointerUp = (e) => {
    if (pointerId !== e.pointerId || !start) return;
    finish(e.clientX, e.clientY);
  };

  const onMouseDown = (e) => {
    if (!swipeEnabledRef.current) return;
    if (isInteractive(e.target)) return;
    if (e.button !== 0) return;
    begin(e.clientX, e.clientY);
  };

  const onMouseMove = (e) => {
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start.lastX = e.clientX;
    start.lastY = e.clientY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    if (absY > 18 && absY > absX * 1.2) {
      start.cancelledVertical = true;
    }
  };

  const onMouseUp = (e) => {
    if (!start) return;
    finish(e.clientX, e.clientY);
  };

  const onCancel = () => {
    reset();
  };

  doc.addEventListener("touchstart", onTouchStart, { passive: true });
  doc.addEventListener("touchmove", onTouchMove, { passive: false });
  doc.addEventListener("touchend", onTouchEnd, { passive: true });
  doc.addEventListener("touchcancel", onCancel, { passive: true });
  doc.addEventListener("pointerdown", onPointerDown, { passive: true });
  doc.addEventListener("pointermove", onPointerMove, { passive: true });
  doc.addEventListener("pointerup", onPointerUp, { passive: true });
  doc.addEventListener("pointercancel", onCancel, { passive: true });
  doc.addEventListener("mousedown", onMouseDown, { passive: true });
  doc.addEventListener("mousemove", onMouseMove, { passive: true });
  doc.addEventListener("mouseup", onMouseUp, { passive: true });
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
  swipeable = false,
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
  const firstVisibleSpineIdxRef = useRef(0);
  const hiddenCoverHrefRef = useRef(null);

  const genRef = useRef(0);
  const failedKeyRef = useRef(null);
  const swipeEnabledRef = useRef(swipeable);
  const swipeHandlersRef = useRef({ prev: null, next: null });
  const isFixedLayoutRef = useRef(false);
  const isFullscreenRef = useRef(!!isFullscreen);

  // resize guard
  const lastRectRef = useRef({ w: 0, h: 0 });

  const log = (...a) => debugEnabled && console.log("[EPUB]", ...a);

  useEffect(() => {
    swipeEnabledRef.current = swipeable;
  }, [swipeable]);

  useEffect(() => {
    isFullscreenRef.current = !!isFullscreen;
  }, [isFullscreen]);

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

    const visibleEndSpineIdx =
      typeof loc?.end?.index === "number"
        ? loc.end.index
        : typeof loc?.end?.href === "string"
        ? spineIndexOfDebug(book, loc.end.href).idx
        : currentSpineIdx;

    const isFixedSpreadFullscreen = isFixedLayoutRef.current && isFullscreen;
    const effectiveSpineIdxForProgress =
      isFixedSpreadFullscreen && typeof visibleEndSpineIdx === "number"
        ? Math.max(currentSpineIdx, visibleEndSpineIdx)
        : currentSpineIdx;

    const edges = deriveBookEdgesFromLoc(
      { ...loc, start: { ...(loc?.start || {}), index: currentSpineIdx } },
      spineLenRef.current || 0
    );
    const fileIntra = calcFileIntra(loc);
    const firstVisibleSpineIdx = firstVisibleSpineIdxRef.current || 0;
    const atVisibleStart =
      (typeof currentSpineIdx === "number" &&
        currentSpineIdx <= firstVisibleSpineIdx &&
        fileIntra <= 0.02) ||
      (!!loc?.atStart &&
        (typeof currentSpineIdx !== "number" ||
          currentSpineIdx <= firstVisibleSpineIdx));
    const atEnd = isFixedSpreadFullscreen
      ? typeof visibleEndSpineIdx === "number"
        ? visibleEndSpineIdx >= edges.lastSpineIdx
        : !!edges.derivedAtEnd
      : !!edges.derivedAtEnd;

    setAtBookStart(atVisibleStart || !!edges.derivedAtStart);
    setAtBookEnd(atEnd);

    const seg = segmentFromSpine(effectiveSpineIdxForProgress);
    setSegIndex((prev) => (seg !== prev ? seg : prev));

    const progressIntra = atEnd ? 1 : fileIntra;
    const { start, count } = segmentBounds(seg);

    const offset = Math.max(
      0,
      Math.min(count - 1, effectiveSpineIdxForProgress - start)
    );
    const segIntra = Math.max(0, Math.min(1, (offset + progressIntra) / count));
    setChapterIntra(segIntra);

    if (debugEnabled) {
      log("relocated", {
        seg,
        currentSpineIdx,
        visibleEndSpineIdx,
        effectiveSpineIdxForProgress,
        isFixedSpreadFullscreen,
        fileIntra,
        progressIntra,
        segStart: start,
        segCount: count,
        segIntra,
        href: loc?.start?.href,
        cfi: loc?.start?.cfi,
        derivedAtStart: !!edges.derivedAtStart,
        atVisibleStart,
        derivedAtEnd: atEnd,
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
    isFixedLayoutRef.current = false;
    firstVisibleSpineIdxRef.current = 0;
    hiddenCoverHrefRef.current = null;

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
      isFixedLayoutRef.current = detectFixedLayoutBook(book);
      const redundantLeadingCover = await hasRedundantLeadingCover(book);
      firstVisibleSpineIdxRef.current = redundantLeadingCover ? 1 : 0;
      hiddenCoverHrefRef.current = redundantLeadingCover
        ? book?.spine?.spineItems?.[0]?.href || null
        : null;
      const spreadPatch = isFixedLayoutRef.current
        ? ensureFixedSpreadProperties(book, debugEnabled ? log : null)
        : { patched: false, count: 0, reason: "not-fixed-layout" };

      if (debugEnabled) {
        const md = book?.packaging?.metadata || book?.package?.metadata || {};
        const firstSpine = (book?.spine?.spineItems || [])
          .slice(0, 3)
          .map((it) => ({
            href: it?.href,
            properties: it?.properties || "",
            linear: it?.linear || "",
          }));
        log("book metadata", {
          layout: md?.layout || null,
          spread: md?.spread || null,
          orientation: md?.orientation || null,
          flow: md?.flow || null,
          displayOptionsFixedLayout: book?.displayOptions?.fixedLayout ?? null,
          isFixedLayout: isFixedLayoutRef.current,
          redundantLeadingCover,
          firstVisibleSpineIdx: firstVisibleSpineIdxRef.current,
          hiddenCoverHref: hiddenCoverHrefRef.current,
          spreadPatch,
          spineLen: spineLenRef.current,
          firstSpine,
        });
      }

      if (cancelled || genRef.current !== gen) return;

      const rendition = book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
        flow: "paginated",
        layout: isFixedLayoutRef.current ? "pre-paginated" : undefined,
        spread: "none",
        minSpreadWidth: Number.POSITIVE_INFINITY,
        gap: isFixedLayoutRef.current ? 0 : undefined,
      });
      renditionRef.current = rendition;

      try {
        rendition.hooks?.content?.register?.((contents) => {
          const doc = contents?.document;
          const isFixedLayout = isFixedLayoutRef.current;
          const fullscreenNow = isFullscreenRef.current;
          injectStyle(doc, { isFixedLayout, isFullscreen: fullscreenNow });
          if (isFixedLayout && !fullscreenNow) {
            centerFixedBodyInSinglePage(contents, debugEnabled ? log : null);
          }
          if (debugEnabled) {
            log("content hook", {
              href: contents?.section?.href || null,
              isFixedLayout,
              isFullscreen: fullscreenNow,
            });
          }
          registerSwipeHandlers(doc, swipeEnabledRef, swipeHandlersRef);
        });
      } catch {}

      const relocatedHandler = (loc) => onRelocatedRef.current?.(loc);
      rendition.on("relocated", relocatedHandler);
      rendition.on("rendered", (_section, view) => {
        const isFixedLayout = isFixedLayoutRef.current;
        if (!isFixedLayout) return;
        const fullscreenNow = isFullscreenRef.current;
        const contents = view?.contents;
        const doc = contents?.document;
        if (!contents || !doc) return;

        if (!fullscreenNow) {
          centerFixedBodyInSinglePage(contents, debugEnabled ? log : null);
        }
      });

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
      const withFrontmatter = prependMissingSpineSections(book, deduped);

      // Decide structure mode (chapter vs fallback)
      const struct = computeEpubStructureScore(book, withFrontmatter);
      if (debugEnabled) log("STRUCT", struct);

      let finalToc = withFrontmatter;
      if (struct.mode === "fallback") {
        log("TOC looks messy → collapsing (preserve frontmatter) + Indhold");
        finalToc = collapseToSingleSectionPreserveFrontmatter(
          book,
          withFrontmatter
        );
      }

      if (hiddenCoverHrefRef.current) {
        const hiddenKey = stripHashQuery(hiddenCoverHrefRef.current);
        finalToc = finalToc.filter(
          (entry) => stripHashQuery(entry?.href || "") !== hiddenKey
        );

        const visibleHref =
          book?.spine?.spineItems?.[firstVisibleSpineIdxRef.current]?.href ||
          null;
        const visibleKey = stripHashQuery(visibleHref || "");
        if (visibleKey) {
          let relabeled = false;
          finalToc = finalToc.map((entry) => {
            if (relabeled) return entry;
            if (stripHashQuery(entry?.href || "") !== visibleKey) return entry;
            relabeled = true;
            return { ...entry, label: "Forside" };
          });
        }
      }

      rebuildTocSpineIndex(book, finalToc);
      setTocFlat(finalToc);

      const spineLen = book?.spine?.spineItems?.length || 0;
      setProgressEnabled(!(spineLen > 1 && finalToc.length <= 1));

      // Start at first visible spine item, optionally skipping a redundant cover.
      let startTarget = null;
      try {
        const items = book?.spine?.spineItems || [];
        startTarget = items?.[firstVisibleSpineIdxRef.current]?.href || null;
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
  ]);

  // Fullscreen toggle (kept)
  useEffect(() => {
    const host = viewerRef?.current;
    if (!host) return;

    let cancelled = false;

    (async () => {
      const r = renditionRef.current;
      const book = bookRef.current;
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

      let displayTarget = target;
      if (isFixedLayoutRef.current && isFullscreen && book) {
        const currentIdx =
          typeof loc?.start?.index === "number"
            ? loc.start.index
            : typeof loc?.start?.href === "string"
            ? spineIndexOfDebug(book, loc.start.href).idx
            : null;

        const anchorIdx = getFixedSpreadAnchorIndexForBook(book, currentIdx);
        const anchorHref =
          typeof anchorIdx === "number"
            ? book?.spine?.spineItems?.[anchorIdx]?.href || null
            : null;

        if (anchorHref) displayTarget = anchorHref;
      }

      if (debugEnabled)
        log("fullscreen toggle", {
          isFullscreen,
          target,
          displayTarget,
        });

      await waitForLayout(host, 1600);
      await new Promise((resolve) => setTimeout(resolve, 350));
      if (cancelled) return;

      const r2 = renditionRef.current;
      if (!r2) return;

      try {
        const rect = host.getBoundingClientRect();
        const policy = applySpreadForWidth(r2, {
          fullscreen: isFullscreen,
          isFixedLayout: isFixedLayoutRef.current,
        });
        if (debugEnabled)
          log("spread policy (fullscreen toggle)", {
            isFullscreen,
            isFixedLayout: isFixedLayoutRef.current,
            appliedSpread: policy?.spread || null,
            minSpreadWidth: policy?.minSpreadWidth ?? null,
            reason: policy?.reason || null,
            viewport: {
              width: Math.floor(rect.width),
              height: Math.floor(rect.height),
            },
          });
        r2.resize?.(Math.floor(rect.width), Math.floor(rect.height));
      } catch {}

      try {
        r2.reflow?.();
      } catch {}
      try {
        r2.reformat?.();
      } catch {}

      if (displayTarget) {
        try {
          await r2.display(displayTarget);
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
        const policy = applySpreadForWidth(r, {
          fullscreen: isFullscreen,
          isFixedLayout: isFixedLayoutRef.current,
        });
        if (debugEnabled)
          log("spread policy (resize)", {
            isFullscreen,
            isFixedLayout: isFixedLayoutRef.current,
            appliedSpread: policy?.spread || null,
            minSpreadWidth: policy?.minSpreadWidth ?? null,
            reason: policy?.reason || null,
            viewport: { width: w, height: h },
          });
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
  }, [viewerRef, isFullscreen]);

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

  const displaySpineIndex = useCallback(async (idx) => {
    const r = renditionRef.current;
    const book = bookRef.current;
    if (!r || !book || typeof idx !== "number") return false;

    const items = book?.spine?.spineItems || [];
    if (idx < 0 || idx >= items.length) return false;
    const href = items[idx]?.href;
    if (!href) return false;

    try {
      await r.display(href);
      return true;
    } catch {
      return false;
    }
  }, []);

  const getFixedSpreadAnchorIndex = useCallback((idx) => {
    return getFixedSpreadAnchorIndexForBook(bookRef.current, idx);
  }, []);

  const navigateFixedSpread = useCallback(
    async (dir) => {
      const r = renditionRef.current;
      const book = bookRef.current;
      if (!r || !book) return false;

      const loc = safeLoc(r);
      const curIdx = getSpineIdxFromLoc(loc);
      if (typeof curIdx !== "number") return false;

      const anchor = getFixedSpreadAnchorIndex(curIdx);
      if (typeof anchor !== "number") return false;

      const lastIdx = Math.max(0, (book?.spine?.spineItems?.length || 1) - 1);

      let target = anchor;
      if (dir > 0) {
        target = anchor === 0 ? 1 : anchor + 2;
        if (target > lastIdx) {
          if (debugEnabled) {
            log("fixed spread nav boundary (end)", {
              curIdx,
              anchor,
              target,
              lastIdx,
            });
          }
          return true;
        }
      } else {
        target = anchor <= 1 ? 0 : anchor - 2;
        if (target < 0) {
          if (debugEnabled) {
            log("fixed spread nav boundary (start)", {
              curIdx,
              anchor,
              target,
            });
          }
          return true;
        }
      }

      const ok = await displaySpineIndex(target);
      if (debugEnabled) {
        log("fixed spread nav", {
          dir,
          curIdx,
          anchor,
          target,
          ok,
          isFullscreen,
        });
      }
      return ok;
    },
    [
      debugEnabled,
      displaySpineIndex,
      getFixedSpreadAnchorIndex,
      getSpineIdxFromLoc,
      isFullscreen,
    ]
  );

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
    const firstVisibleSpineIdx = firstVisibleSpineIdxRef.current || 0;
    if (
      nextIdx < firstVisibleSpineIdx ||
      nextIdx < 0 ||
      nextIdx >= items.length
    ) {
      return false;
    }

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

    // In fixed-layout fullscreen, navigate spread-by-spread (cover, then pairs).
    if (isFixedLayoutRef.current && isFullscreen) {
      const ok = await navigateFixedSpread(-1);
      if (ok) return;
    }

    const before = safeLoc(r);
    const beforeIdx = getSpineIdxFromLoc(before);
    const beforeIntra = calcFileIntra(before);
    const firstVisibleSpineIdx = firstVisibleSpineIdxRef.current || 0;
    const epsStart = 0.02;
    const atFileStart = !!before?.atStart || (beforeIntra ?? 0) <= epsStart;

    if (
      typeof beforeIdx === "number" &&
      beforeIdx <= firstVisibleSpineIdx &&
      atFileStart
    ) {
      return;
    }

    try {
      await r.prev?.();
    } catch {}

    const after = safeLoc(r);
    const afterIdx = getSpineIdxFromLoc(after);
    if (
      typeof afterIdx === "number" &&
      afterIdx < firstVisibleSpineIdx &&
      firstVisibleSpineIdx > 0
    ) {
      await displaySpineIndex(firstVisibleSpineIdx);
      return;
    }

    // If we didn't change spine, and we're at file-start, force to previous spine item.
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
  }, [
    displaySpineIndex,
    debugEnabled,
    forceDisplaySpine,
    getSpineIdxFromLoc,
    isFullscreen,
    navigateFixedSpread,
  ]);

  const handleNext = useCallback(async () => {
    const r = renditionRef.current;
    if (!r) return;

    // In fixed-layout fullscreen, navigate spread-by-spread (cover, then pairs).
    if (isFixedLayoutRef.current && isFullscreen) {
      const ok = await navigateFixedSpread(+1);
      if (ok) return;
    }

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
  }, [
    debugEnabled,
    forceDisplaySpine,
    getSpineIdxFromLoc,
    isFullscreen,
    navigateFixedSpread,
  ]);

  useEffect(() => {
    swipeHandlersRef.current = { prev: handlePrev, next: handleNext };
  }, [handlePrev, handleNext]);

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
