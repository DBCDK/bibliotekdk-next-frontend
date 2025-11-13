// components/sample/epub/hooks/useEpubReader.js
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEBUG,
  dlog,
  describeTarget,
  spineIndexOfDebug,
  dumpBookOverview,
} from "./utils/epubDebug";
import {
  getCoverHref,
  getFirstLinearHref,
  waitForBookAndLayout,
  isHttp,
  splitHash,
  buildSyntheticTocFromSpine,
} from "./utils/epubHelpers";

export function useEpubReader({ src, title, isFullscreen, containerRef }) {
  // -------- State
  const [location, setLocation] = useState(undefined);
  const [storageKey, setStorageKey] = useState(null);
  const [bookVersion, setBookVersion] = useState(0);

  const [tocFlat, setTocFlat] = useState([]);
  const [activeHref, setActiveHref] = useState("");

  const [segIndex, setSegIndex] = useState(0);
  const [chapterIntra, setChapterIntra] = useState(0);
  const [atBookEnd, setAtBookEnd] = useState(false);

  const [progressEnabled, setProgressEnabled] = useState(true);

  // -------- Refs
  const renditionRef = useRef(null);
  const bookRef = useRef(null);
  const tocSpineIdxRef = useRef([]);

  const displayInflightRef = useRef(false);
  const isFullscreenRef = useRef(isFullscreen);
  useEffect(() => {
    isFullscreenRef.current = isFullscreen;
  }, [isFullscreen]);

  const firstRenderDoneRef = useRef(false);

  // Anti-flicker / cover
  const coverHrefRef = useRef(null);
  const coverIdxRef = useRef(null);
  const pendingSpreadRestoreRef = useRef(false);
  const coverShownOnceRef = useRef(false);

  // Initial override (kun hvis IKKE gendannet position)
  const initialOverrideDoneRef = useRef(false);
  const hasLoadedLocationRef = useRef(false);

  const lastDisplayTargetRef = useRef(null);

  // ------ Helpers
  const stripHashQuery = (s = "") => s.split("#")[0].split("?")[0];

  const spineIndexOf = (book, href) => {
    const r = spineIndexOfDebug(book, href);
    if (DEBUG) {
      dlog.group("[EPUB DBG] spineIndexOf");
      dlog.info("href =", href);
      console.table(r.tried);
      dlog.info("→ idx:", r.idx);
      dlog.end();
    }
    return r.idx;
  };

  const sameSpineFile = (book, a = "", b = "") => {
    const ai = spineIndexOf(book, a);
    const bi = spineIndexOf(book, b);
    return typeof ai === "number" && ai === bi;
  };

  const firstValidSpineHref = (book) => {
    try {
      const items = book?.spine?.spineItems || [];
      for (const it of items) {
        const href = it?.href;
        if (!href) continue;
        const idx = spineIndexOf(book, href);
        if (typeof idx === "number") return href;
      }
    } catch {
      // ignore
    }
    return null;
  };

  async function displayThenScrollHash(hrefWithoutHash, hash) {
    const r = renditionRef.current;
    if (!r) return;
    await r.__origDisplay(hrefWithoutHash);
    if (!hash) return;

    const tryScroll = () => {
      try {
        const c = r.getContents?.()[0];
        const el = c?.document?.getElementById(hash);
        if (el) {
          el.scrollIntoView({ block: "start" });
          return true;
        }
      } catch {
        // ignore
      }
      return false;
    };

    if (tryScroll()) return;
    setTimeout(tryScroll, 50);
    setTimeout(tryScroll, 250);
  }

  // -------- Safe display
  const safeDisplay = async (target) => {
    const r = renditionRef.current;
    const book = r?.book || bookRef.current;
    const desc = describeTarget(target);
    lastDisplayTargetRef.current = target;

    await waitForBookAndLayout(r, containerRef.current);

    if (displayInflightRef.current) {
      dlog.warn("[EPUB DBG] safeDisplay: dropper pga inflight");
      return;
    }
    displayInflightRef.current = true;

    dlog.group("[EPUB DBG] safeDisplay →", desc);
    try {
      if (!r || !book) {
        dlog.warn("rendition/book missing");
        return;
      }

      // Overstyr KUN første display hvis vi IKKE gendanner saved location
      if (!initialOverrideDoneRef.current && !hasLoadedLocationRef.current) {
        initialOverrideDoneRef.current = true;

        const coverHref = coverHrefRef.current || getCoverHref(book);
        const coverIdx = coverHref ? spineIndexOf(book, coverHref) : null;

        if (coverHref && typeof coverIdx === "number") {
          const isTargetCover =
            (desc.kind === "href" &&
              typeof spineIndexOf(book, desc.raw) === "number" &&
              spineIndexOf(book, desc.raw) === coverIdx) ||
            (desc.kind === "cfi" && /\bcover\b/i.test(String(desc.raw)));

          if (!isTargetCover) {
            r.spread?.("none");
            if (r.settings) {
              r.settings.minSpreadWidth = Number.POSITIVE_INFINITY;
            }
            pendingSpreadRestoreRef.current = true;
            dlog.info("[COVER DBG] initial override → display cover");
            await r.__origDisplay(coverHref);
            return;
          }
        }
      }

      if (desc.kind === "number") {
        desc.kind = "none";
      }

      if (desc.kind === "none") {
        const coverHref = coverHrefRef.current || getCoverHref(book);
        const linearHref = getFirstLinearHref(book);
        const fb = coverHref || linearHref || firstValidSpineHref(book);
        if (coverHref && !firstRenderDoneRef.current) {
          r.spread?.("none");
          if (r.settings) {
            r.settings.minSpreadWidth = Number.POSITIVE_INFINITY;
          }
          pendingSpreadRestoreRef.current = true;
          dlog.info(
            "[COVER DBG] temp single-page spread for first display (cover)"
          );
        }
        if (fb) await r.__origDisplay(fb);
        return;
      }

      if (desc.kind === "href") {
        const raw = desc.raw;
        const hashIdx = raw.indexOf("#");
        const rawPath = hashIdx === -1 ? raw : raw.slice(0, hashIdx);
        const rawHash = hashIdx === -1 ? "" : raw.slice(hashIdx + 1);

        const test = spineIndexOfDebug(book, rawPath);
        if (test.idx == null) {
          const coverHref = coverHrefRef.current || getCoverHref(book);
          const linearHref = getFirstLinearHref(book);
          const fb = coverHref || linearHref || firstValidSpineHref(book);
          if (fb) await r.__origDisplay(fb);
          return;
        }

        const toShow = test.hit;
        if (rawHash) {
          await displayThenScrollHash(toShow, rawHash);
          return;
        }
        await r.__origDisplay(toShow);
        return;
      }

      await r.__origDisplay(desc.raw);
    } catch (e) {
      dlog.warn("display() THREW:", e);
      const coverHref = coverHrefRef.current || getCoverHref(book);
      const linearHref = getFirstLinearHref(book);
      const fb = coverHref || linearHref || firstValidSpineHref(book);
      if (fb) {
        try {
          await r.__origDisplay(fb);
        } catch (ee) {
          dlog.error("fallback display() failed:", ee);
        }
      }
    } finally {
      dlog.end();
      displayInflightRef.current = false;
    }
  };

  // -------- Valid location?
  const isValidLocation = (book, loc) => {
    if (!loc) return true;
    if (!book) return true;
    if (typeof loc !== "string") return false;
    const s = loc.trim();
    if (!s) return true;
    if (s.startsWith("epubcfi(")) {
      try {
        if (typeof book.getRange === "function") return !!book.getRange(s);
      } catch {
        return false;
      }
      return true;
    }
    const href = stripHashQuery(s);
    return typeof spineIndexOf(book, href) === "number";
  };

  const getRenditionLocationSafe = useCallback(() => {
    const r = renditionRef.current;
    if (!r) return null;
    try {
      if (typeof r.currentLocation === "function") {
        const loc = r.currentLocation();
        if (loc) return loc;
      }
    } catch {
      // ignore
    }
    try {
      if (r.location) return r.location;
    } catch {
      // ignore
    }
    return null;
  }, []);

  const calcChapterIntra = (loc) => {
    const s = loc?.start?.displayed?.page ?? 0;
    const e = loc?.end?.displayed?.page ?? s;
    const total = loc?.start?.displayed?.total ?? 0;
    if (!s || !total) return 0;
    const visible = Math.max(1, e - s + 1);
    const completed = Math.min(total, s + visible - 1);
    let intra = completed / total;
    if (loc?.atEnd || intra >= 0.995) intra = 1;
    return Math.max(0, Math.min(1, intra));
  };

  const rebuildTocSpineIndex = useCallback(() => {
    const book = renditionRef.current?.book || bookRef.current;
    if (!book || !tocFlat.length) return;
    tocSpineIdxRef.current = tocFlat.map((entry) => {
      const idx = spineIndexOf(book, entry.href);
      return typeof idx === "number" ? idx : null;
    });
  }, [tocFlat]);

  useEffect(() => {
    rebuildTocSpineIndex();
    const loc = getRenditionLocationSafe();
    if (loc) handleRelocated(loc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rebuildTocSpineIndex]);

  const currentSpineIndex = useCallback(
    (loc) => {
      const book = renditionRef.current?.book || bookRef.current;
      if (!book || !loc?.start?.href) return null;
      const idx = spineIndexOf(book, loc.start.href);
      if (typeof idx === "number") return idx;
      if (typeof loc?.start?.index === "number") return loc.start.index;
      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const segmentFromSpine = useCallback((spineIdx) => {
    const map = tocSpineIdxRef.current;
    if (!map.length || typeof spineIdx !== "number") return null;
    let seg = 0;
    for (let j = 0; j < map.length; j++) {
      const m = map[j];
      if (typeof m === "number" && m <= spineIdx) seg = j;
    }
    return seg;
  }, []);

  const handleRelocated = useCallback(
    (loc) => {
      if (DEBUG) {
        dlog.group("[EPUB DBG] relocated");
        dlog.info(
          "loc.start.href:",
          loc?.start?.href,
          "loc.start.cfi:",
          loc?.start?.cfi
        );
        dlog.info("loc.start.index:", loc?.start?.index, "atEnd:", loc?.atEnd);
        dlog.end();
      }
      const href = loc?.start?.href ? stripHashQuery(loc.start.href) : "";
      if (href) setActiveHref(href);
      setAtBookEnd(!!loc?.atEnd);
      setChapterIntra(calcChapterIntra(loc));

      try {
        const spineIdx = currentSpineIndex(loc);
        const coverIdx = coverIdxRef.current;

        if (
          firstRenderDoneRef.current &&
          pendingSpreadRestoreRef.current &&
          typeof spineIdx === "number"
        ) {
          if (typeof coverIdx === "number" && spineIdx !== coverIdx) {
            const r = renditionRef.current;
            if (r) {
              if (isFullscreenRef.current) {
                r.spread?.("both");
                r.settings.minSpreadWidth = 0;
              } else {
                r.spread?.("none");
                r.settings.minSpreadWidth = Number.POSITIVE_INFINITY;
              }
            }
            pendingSpreadRestoreRef.current = false;
            dlog.info("[COVER DBG] spread restored after leaving cover");
          }
        }

        if (
          typeof coverIdx === "number" &&
          typeof spineIdx === "number" &&
          spineIdx === coverIdx
        ) {
          coverShownOnceRef.current = true;
        }

        const seg = segmentFromSpine(spineIdx);
        if (typeof seg === "number") {
          setSegIndex((prev) => (seg !== prev ? seg : prev));
        }
      } catch {
        // ignore
      }
    },
    [currentSpineIndex, segmentFromSpine]
  );

  const updateIfReady = useCallback(() => {
    const loc = getRenditionLocationSafe();
    if (loc) handleRelocated(loc);
  }, [getRenditionLocationSafe, handleRelocated]);

  const handleLocationChanged = useCallback(
    (loc) => {
      setLocation(loc);
      try {
        const key = storageKey || "epub:location:default";
        if (loc) {
          localStorage.setItem(
            key,
            typeof loc === "string" ? loc : String(loc)
          );
        } else {
          localStorage.removeItem(key);
        }
      } catch {
        // ignore
      }
    },
    [storageKey]
  );

  const [BaseReaderStyle, setBaseReaderStyle] = useState(null);
  useEffect(() => {
    import("react-reader").then((m) => setBaseReaderStyle(m.ReactReaderStyle));
  }, []);

  const readerStyles = useMemo(() => {
    if (!BaseReaderStyle) return undefined;
    return {
      ...BaseReaderStyle,
      container: {
        ...BaseReaderStyle.container,
        backgroundColor: "var(--epub-container-bg)",
        color: "var(--epub-container-fg)",
      },
      readerArea: {
        ...BaseReaderStyle.readerArea,
        backgroundColor: "var(--epub-reader-bg)",
        transition: undefined,
      },
      titleArea: {
        ...BaseReaderStyle.titleArea,
        color: "var(--epub-title-fg)",
        background: "var(--epub-title-bg)",
      },
      arrow: { ...BaseReaderStyle.arrow, color: "var(--epub-arrow-fg)" },
      arrowHover: {
        ...BaseReaderStyle.arrowHover,
        color: "var(--epub-arrow-hover-fg)",
        background: "var(--epub-arrow-hover-bg)",
      },
      tocArea: {
        ...BaseReaderStyle.tocArea,
        background: "var(--epub-toc-bg)",
        color: "var(--epub-toc-fg)",
      },
      tocButton: {
        ...BaseReaderStyle.tocButton,
        color: "var(--epub-toc-button-fg)",
        background: "var(--epub-toc-button-bg)",
      },
      tocButtonExpanded: {
        ...BaseReaderStyle.tocButtonExpanded,
        background: "var(--epub-toc-button-expanded-bg)",
      },
      tocButtonBar: {
        ...BaseReaderStyle.tocButtonBar,
        background: "var(--epub-toc-button-bar-bg)",
      },
    };
  }, [BaseReaderStyle]);

  const pokeRendition = useCallback(async () => {
    const r = renditionRef.current;
    const host = containerRef.current;
    if (!r || !host) return;
    const rect = host.getBoundingClientRect();
    const W = Math.floor(rect.width);
    const H = Math.floor(rect.height);
    const loc = getRenditionLocationSafe();
    const target = loc?.start?.cfi || loc?.start?.href || null;

    try {
      r.reformat?.();
    } catch {}
    try {
      r.resize?.(W, H);
    } catch {}

    await safeDisplay(target);

    try {
      const contents = r.getContents?.() || [];
      contents.forEach((c) => {
        try {
          c.resize?.();
        } catch {}
        try {
          c.document?.defaultView?.dispatchEvent(new Event("resize"));
        } catch {}
      });
    } catch {}

    setTimeout(async () => {
      try {
        r.resize?.(W, H);
      } catch {}
      try {
        window.dispatchEvent(new Event("resize"));
      } catch {}
    }, 350);
  }, [getRenditionLocationSafe]);

  const handleGetRendition = useCallback(
    (rendition) => {
      renditionRef.current = rendition;
      if (rendition.book) bookRef.current = rendition.book;

      if (!rendition.__origDisplay) {
        rendition.__origDisplay = rendition.display.bind(rendition);
        rendition.display = (target) => safeDisplay(target ?? null);
        dlog.info("[EPUB DBG] rendition.display patched → safeDisplay()");
      }

      rendition.flow?.("paginated");

      if (isFullscreenRef.current) {
        rendition.spread?.("both");
        rendition.settings.minSpreadWidth = 0;
      } else {
        rendition.spread?.("none");
        rendition.settings.minSpreadWidth = Number.POSITIVE_INFINITY;
      }

      const book = rendition.book;

      book?.on?.("book:resourcerequested", (res) =>
        dlog.info("[RES] requested:", res?.href)
      );
      book?.on?.("book:resourceerror", (res) =>
        dlog.error("[RES] ERROR:", res?.href, res?.error)
      );
      book?.on?.("book:openFailed", (e) => dlog.error("[BOOK] openFailed:", e));
      book?.on?.("book:loadFailed", (e) => dlog.error("[BOOK] loadFailed:", e));

      rendition.on("displayed", (section) => {
        const href = section?.href;
        const loc = rendition.currentLocation?.();
        const total = loc?.start?.displayed?.total;

        dlog.info("[REND] displayed:", href);
        dlog.info("[COVER DBG] displayed:", href, "pagesInSection=", total);

        try {
          const book = rendition.book || bookRef.current;
          const contents = rendition.getContents?.()[0];
          const doc = contents?.document;
          const currentIdx =
            typeof loc?.start?.index === "number" ? loc.start.index : null;

          if (book && doc && typeof currentIdx === "number") {
            const bookTitle = (book?.package?.metadata?.title || "").trim();

            const rawDocTitle = (
              doc.querySelector("title")?.textContent || ""
            ).trim();
            const h1 = (
              doc.querySelector("h1,h2,.title,[role='heading']")?.textContent ||
              ""
            ).trim();

            // 1) Foretræk H1 frem for <title>
            // 2) Ignorer <title>, hvis det bare er bogens titel
            let best = "";
            if (h1 && h1.length > 2) {
              best = h1;
            } else if (
              rawDocTitle &&
              rawDocTitle.length > 2 &&
              rawDocTitle.toLowerCase() !== bookTitle.toLowerCase()
            ) {
              best = rawDocTitle;
            }

            if (best) {
              setTocFlat((prev) => {
                if (!prev || prev.length === 0) return prev;

                const idx = prev.findIndex((it) => {
                  const i = spineIndexOf(book, it.href);
                  return typeof i === "number" && i === currentIdx;
                });
                if (idx === -1) return prev;

                const old = prev[idx];
                if (!old) return prev;

                // Hvis label allerede ser fin ud, behold den
                const oldLabel = (old.label || "").trim();
                if (oldLabel && oldLabel.toLowerCase() === best.toLowerCase()) {
                  return prev;
                }

                // Hvis vi syntetisk har kaldt det “Sektion X” eller noget filnavne-agtigt,
                // så må vi gerne opgradere til `best`
                const looksSynthetic =
                  /^Sektion \d+$/i.test(oldLabel) ||
                  (/^[A-Za-z0-9 _-]+$/.test(oldLabel) &&
                    /\b(index|split|titlepage|kapitel|chapter|x?html?)\b/i.test(
                      oldLabel
                    ));

                if (!looksSynthetic) {
                  return prev;
                }

                const next = prev.slice();
                next[idx] = { ...old, label: best };
                return next;
              });
            }
          }
        } catch {
          // ignore
        }

        // Første display → restore spread hvis vi ikke er på cover
        if (!firstRenderDoneRef.current) {
          firstRenderDoneRef.current = true;

          const currentIdx =
            typeof loc?.start?.index === "number" ? loc.start.index : null;
          const coverIdx = coverIdxRef.current;

          if (typeof coverIdx === "number" && currentIdx === coverIdx) {
            pendingSpreadRestoreRef.current = true;
            dlog.info("[COVER DBG] defer spread restore (on cover)");
          } else {
            if (isFullscreenRef.current) {
              rendition.spread?.("both");
              rendition.settings.minSpreadWidth = 0;
            } else {
              rendition.spread?.("none");
              rendition.settings.minSpreadWidth = Number.POSITIVE_INFINITY;
            }
            dlog.info(
              "[COVER DBG] restored spread after first display (not cover)"
            );
          }
        }
      });

      rendition.on("displayError", (e) => {
        dlog.error("[REND] displayError:", e);
      });

      rendition.themes?.default({
        html: { height: "100% !important" },
        body: {
          height: "100% !important",
          margin: "0 !important",
          padding: "0 !important",
          background: "var(--epub-page-bg)",
          color: "var(--epub-page-fg)",
          "font-family":
            "var(--epub-page-font, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif)",
          "line-height": "var(--epub-page-line-height, 1.55)",
          "box-sizing": "border-box",
          border: "0 !important",
        },
        "header, footer, .watermark, .ad": { display: "none !important" },
        img: { "max-width": "100% !important", height: "auto" },
        "#cover-image": {
          display: "grid",
          "place-items": "center",
          height: "100%",
          margin: "0",
          padding: "0",
          "text-align": "center",
          overflow: "hidden",
          "break-after": "auto !important",
          "page-break-after": "auto !important",
          "break-before": "auto !important",
          "page-break-before": "auto !important",
          "break-inside": "auto !important",
          "page-break-inside": "auto !important",
        },
        "#cover-image img": {
          display: "block",
          margin: "0 auto",
          width: "auto",
          height: "auto",
          "max-width": "100%",
          "max-height": "100%",
          "object-fit": "contain",
          float: "none !important",
        },
        "#cover-image svg, #cover-image image": {
          display: "block",
          margin: "0 auto",
          "max-width": "100%",
          "max-height": "100%",
        },
      });

      rendition.hooks.content.register((contents) => {
        contents.addStylesheetRules([
          ["header, footer, .watermark, .ad", { display: "none !important" }],
          ["html", { height: "100% !important" }],
          [
            "body",
            {
              height: "100% !important",
              margin: "0 !important",
              padding: "0 !important",
              "box-sizing": "border-box",
              border: "0 !important",
            },
          ],
          ["img", { "max-width": "100% !important", height: "auto" }],
          [
            "a, a *",
            {
              "pointer-events": "auto !important",
              cursor: "pointer !important",
            },
          ],
          [
            "a",
            {
              color: "var(--epub-link-fg) !important",
              "text-decoration":
                "var(--epub-link-decoration, underline) !important",
            },
          ],
          [
            "#cover-image",
            {
              display: "grid",
              "place-items": "center",
              height: "100%",
              margin: "0",
              padding: "0",
              "text-align": "center",
              overflow: "hidden",
              "break-after": "auto !important",
              "page-break-after": "auto !important",
              "break-before": "auto !important",
              "page-break-before": "auto !important",
              "break-inside": "auto !important",
              "page-break-inside": "auto !important",
            },
          ],
          [
            "#cover-image img",
            {
              display: "block",
              margin: "0 auto",
              width: "auto",
              height: "auto",
              "max-width": "100%",
              "max-height": "100%",
              "object-fit": "contain",
              float: "none !important",
            },
          ],
          [
            "#cover-image svg, #cover-image image",
            {
              display: "block",
              margin: "0 auto",
              "max-width": "100%",
              "max-height": "100%",
            },
          ],
        ]);

        try {
          contents.document.documentElement.classList.add("dbc-epub");
        } catch {
          // ignore
        }

        // Link-navigation (interne/eksterne)
        try {
          contents.on?.("link", async (rawHref) => {
            const r = renditionRef.current;
            const book = r?.book || bookRef.current;
            if (!rawHref) return;
            if (isHttp(rawHref)) {
              return window.open(rawHref, "_blank", "noopener,noreferrer");
            }
            const [path, hash] = splitHash(rawHref);
            const currentHref = contents?.section?.href || "";
            if (!path || sameSpineFile(book, path, currentHref)) {
              if (hash) {
                const el = contents.document?.getElementById(hash);
                if (el) {
                  el.scrollIntoView({ block: "start" });
                }
              }
              return;
            }
            await r.display(path + (hash ? `#${hash}` : ""));
          });
        } catch {
          // ignore
        }

        try {
          contents.document.addEventListener(
            "click",
            async (ev) => {
              const a = ev.target?.closest?.("a[href]");
              if (!a) return;
              const rawHref = a.getAttribute("href");
              if (!rawHref) return;
              const r = renditionRef.current;
              const book = r?.book || bookRef.current;
              if (isHttp(rawHref)) return;
              ev.preventDefault();
              const [path, hash] = splitHash(rawHref);
              const currentHref = contents?.section?.href || "";
              if (!path || sameSpineFile(book, path, currentHref)) {
                if (hash) {
                  const el = contents.document?.getElementById(hash);
                  if (el) {
                    el.scrollIntoView({ block: "start" });
                  }
                }
                return;
              }
              await r.display(path + (hash ? `#${hash}` : ""));
            },
            true
          );
        } catch {
          // ignore
        }
      });

      rendition.on("relocated", handleRelocated);
      const tryInit = () => updateIfReady();
      rendition.on("rendered", tryInit);
      setTimeout(tryInit, 250);
    },
    [handleRelocated, updateIfReady]
  );

  useEffect(() => {
    const r = renditionRef.current;
    if (!r) return;
    if (isFullscreen) {
      r.spread?.("both");
      r.settings.minSpreadWidth = 0;
    } else {
      r.spread?.("none");
      r.settings.minSpreadWidth = Number.POSITIVE_INFINITY;
    }
    pokeRendition();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen]);

  const handleBookReady = useCallback(
    async (book) => {
      bookRef.current = book;
      if (DEBUG) {
        dlog.group("[EPUB DBG] onBookReady");
        dlog.info("metadata:", book?.package?.metadata);
        dlog.info("src:", src);
        dlog.end();
      }

      const ch = getCoverHref(book);
      coverHrefRef.current = ch;
      coverIdxRef.current = ch ? spineIndexOf(book, ch) : null;

      const bookId =
        book?.package?.metadata?.identifier ||
        book?.package?.metadata?.title ||
        (typeof src === "string" ? src : "unknown");
      const key = `epub:location:${bookId}`;
      setStorageKey(key);

      let loaded = undefined;
      try {
        const v = localStorage.getItem(key);
        loaded = v || undefined;
      } catch {
        // ignore
      }
      if (loaded && !isValidLocation(book, loaded)) {
        dlog.warn("[EPUB] Ugyldig gemt location → rydder");
        try {
          localStorage.removeItem(key);
        } catch {}
        loaded = undefined;
      }
      hasLoadedLocationRef.current = !!loaded;

      const coverHref = ch;
      const firstLinear = getFirstLinearHref(book);
      const firstSpine = book.spine?.spineItems?.[0]?.href || null;
      const initialTarget =
        loaded || coverHref || firstLinear || firstSpine || null;

      setLocation(loaded || null);
      dlog.info("[COVER DBG] initial pick:", {
        loaded,
        coverHref,
        firstLinear,
        firstSpine,
        initialTarget,
      });

      const r = renditionRef.current;
      await waitForBookAndLayout(r, containerRef.current);

      if (
        !firstRenderDoneRef.current &&
        !loaded &&
        initialTarget &&
        initialTarget === coverHref
      ) {
        r?.spread?.("none");
        if (r?.settings) {
          r.settings.minSpreadWidth = Number.POSITIVE_INFINITY;
        }
        pendingSpreadRestoreRef.current = true;
        dlog.info(
          "[COVER DBG] temp single-page spread for initial cover (defer restore)"
        );
      }

      Promise.resolve().then(() => {
        r && r.display(initialTarget);
      });

      rebuildTocSpineIndex();
      setTimeout(updateIfReady, 0);
    },
    [rebuildTocSpineIndex, updateIfReady, src]
  );

  const handleJump = useCallback(async (href) => {
    const r = renditionRef.current;
    if (!r || !href) return;
    await r.display(href);
  }, []);

  // ------ Derivater til UI
  const segments = Math.max(1, tocFlat.length || 1);
  const labels = useMemo(() => {
    const activeNorm = stripHashQuery(activeHref);
    return tocFlat.map((it) => ({
      ...it,
      hrefNorm: stripHashQuery(it.href),
      active: stripHashQuery(it.href) === activeNorm,
    }));
  }, [tocFlat, activeHref]);

  const isLastSeg = segIndex >= segments - 1;
  const intraEff =
    isLastSeg && (atBookEnd || chapterIntra >= 0.995) ? 1 : chapterIntra;
  const overallPctDerived = ((segIndex + intraEff) / segments) * 100;

  // Diagnose: TOC vs spine + enable/disable progress
  useEffect(() => {
    const book = renditionRef.current?.book || bookRef.current;
    if (!book) return;

    try {
      const spineItems = book.spine?.spineItems || [];
      const spineLen = spineItems.length;

      if (!tocFlat.length && spineLen > 1) {
        // Ingen toc, flere spine-sektioner → progress giver ikke rigtig mening
        setProgressEnabled(false);
      } else if (spineLen > 1 && tocFlat.length <= 1) {
        // Kun én segment men mange spine-items → disable
        setProgressEnabled(false);
      } else {
        setProgressEnabled(true);
      }

      if (!tocFlat.length) return;

      const spineList = spineItems.map((it, i) => ({
        i,
        href: it?.href,
        idref: it?.idref,
      }));
      const notInSpine = tocFlat.filter(
        (it) => typeof spineIndexOf(book, it.href) !== "number"
      );

      if (notInSpine.length) {
        dlog.group(
          `[EPUB DBG] Diagnose: ${notInSpine.length} TOC entries ikke i spine`
        );
        console.log("Spine items:", spineList);
        console.table(
          notInSpine.map((m) => ({ href: m.href, label: m.label }))
        );
        dlog.end();
      } else {
        dlog.info(
          `[EPUB DBG] Diagnose: TOC matcher spine (${tocFlat.length} entries)`
        );
      }
    } catch {
      // ignore
    }
  }, [tocFlat]);

  const effectiveLocation = useMemo(() => {
    const book = bookRef.current;
    return isValidLocation(book, location) ? location : null;
  }, [location]);

  // Reset ved src-ændring
  useEffect(() => {
    setLocation(undefined);
    setStorageKey(null);
    setTocFlat([]);
    setActiveHref("");
    setSegIndex(0);
    setChapterIntra(0);
    setAtBookEnd(false);
    setProgressEnabled(true);

    try {
      renditionRef.current?.destroy?.();
    } catch {}
    renditionRef.current = null;
    bookRef.current = null;
    tocSpineIdxRef.current = [];
    firstRenderDoneRef.current = false;

    coverHrefRef.current = null;
    coverIdxRef.current = null;
    pendingSpreadRestoreRef.current = false;
    coverShownOnceRef.current = false;
    hasLoadedLocationRef.current = false;
    initialOverrideDoneRef.current = false;

    setBookVersion((v) => v + 1);
  }, [src]);

  // “No Section found” diag → slå progress fra som fallback
  useEffect(() => {
    if (!DEBUG) return;
    const onUR = (ev) => {
      const reason = ev?.reason;
      const msg = reason?.message || String(reason || "");
      if (/No Section found/i.test(msg)) {
        dlog.group("[EPUB DBG] unhandledrejection: No Section found");
        dlog.error(reason);
        dlog.info(
          "last display target:",
          describeTarget(lastDisplayTargetRef.current)
        );
        const book = renditionRef.current?.book || bookRef.current;
        if (book) dumpBookOverview(book, tocFlat);
        dlog.end();
        setProgressEnabled(false);
      }
    };
    window.addEventListener("unhandledrejection", onUR);
    return () => window.removeEventListener("unhandledrejection", onUR);
  }, [tocFlat]);

  // Props til ReactReader
  const readerKey = `${isFullscreen ? "fs" : "modal"}:${bookVersion}`;
  const reactReaderProps = {
    url: src,
    title,
    location: effectiveLocation,
    getRendition: handleGetRendition,
    tocChanged: (toc) => {
      const flatFromNav = (toc || []).flatMap((node) => {
        const out = [];
        const walk = (n) => {
          if (n?.href) out.push({ href: n.href, label: n.label });
          if (Array.isArray(n?.subitems)) n.subitems.forEach(walk);
        };
        walk(node);
        return out;
      });

      const book = renditionRef.current?.book || bookRef.current;

      let flat = flatFromNav;
      if ((!flat || flat.length === 0) && book) {
        // Fallback: syntetisk TOC fra spine
        flat = buildSyntheticTocFromSpine(book);
      }

      let filtered = flat;
      if (book) {
        filtered = flat.filter(
          (it) => typeof spineIndexOf(book, it.href) === "number"
        );
      }

      if (book?.spine?.spineItems?.length) {
        const coverHref = coverHrefRef.current || getCoverHref(book);
        if (coverHref) {
          const inUI = filtered.some(
            (it) =>
              spineIndexOf(book, it.href) === spineIndexOf(book, coverHref)
          );
          if (!inUI) {
            filtered = [{ href: coverHref, label: "Forside" }, ...filtered];
            dlog.info("[COVER DBG] Injected cover into UI labels");
          }
        }
      }

      if (DEBUG) dumpBookOverview(book, filtered);
      setTocFlat(filtered);

      setTimeout(() => {
        rebuildTocSpineIndex();
        updateIfReady();
      }, 0);
    },
    locationChanged: handleLocationChanged,
    onBookReady: handleBookReady,
  };

  return {
    readerKey,
    reactReaderProps,
    readerStyles,
    labels,
    segments,
    overallPctDerived,
    handleJump,
    progressEnabled,
  };
}
