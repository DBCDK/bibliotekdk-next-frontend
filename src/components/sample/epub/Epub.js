// components/sample/epub/ReaderSample.jsx
"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Text from "@/components/base/text";
import Link from "@/components/base/link";

import styles from "./Epub.module.css";

const ReactReader = dynamic(
  () => import("react-reader").then((m) => m.ReactReader),
  { ssr: false }
);

export default function ReaderSample({ src, title, isFullscreen = false }) {
  // Reader position (gemmes i localStorage)
  const [location, setLocation] = useState(0);

  // TOC & aktiv sektion
  const [tocFlat, setTocFlat] = useState([]); // [{ href, label }]
  const [activeHref, setActiveHref] = useState("");

  // Segment/intra (til samlet progress)
  const [segIndex, setSegIndex] = useState(0);
  const [chapterIntra, setChapterIntra] = useState(0);
  const [atBookEnd, setAtBookEnd] = useState(false);

  // Refs
  const containerRef = useRef(null); // måler faktisk render-areal
  const renditionRef = useRef(null);
  const bookRef = useRef(null);
  const tocSpineIdxRef = useRef([]); // mapping: TOC entry -> spineIndex
  const isFullscreenRef = useRef(isFullscreen);
  useEffect(() => {
    isFullscreenRef.current = isFullscreen;
  }, [isFullscreen]);

  // ---------- Helpers ----------
  const stripHashQuery = (s = "") => s.split("#")[0].split("?")[0];
  const dec = (s = "") => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };

  const getRenditionLocationSafe = useCallback(() => {
    const r = renditionRef.current;
    if (!r) return null;
    try {
      if (typeof r.currentLocation === "function") {
        const loc = r.currentLocation();
        if (loc) return loc;
      }
    } catch {}
    try {
      if (r.location) return r.location;
    } catch {}
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
      const clean = dec(stripHashQuery(entry.href));
      let idx = -1;
      try {
        const item =
          book.spine?.get?.(clean) || book.spine?.get?.(clean.split("/").pop());
        if (item && typeof item.index === "number") idx = item.index;
      } catch {}
      return idx >= 0 ? idx : 0;
    });
  }, [tocFlat]);

  // Gendan sidste position
  useEffect(() => {
    try {
      const saved = localStorage.getItem("epub:location");
      if (saved) setLocation(saved);
    } catch {}
  }, []);

  // Sync ved ændret TOC/spine
  useEffect(() => {
    rebuildTocSpineIndex();
    const loc = getRenditionLocationSafe();
    if (loc) handleRelocated(loc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rebuildTocSpineIndex]);

  const currentSpineIndex = useCallback((loc) => {
    const book = renditionRef.current?.book || bookRef.current;
    if (!book || !loc?.start?.href) return null;
    const clean = dec(stripHashQuery(loc.start.href));
    try {
      const item =
        book.spine?.get?.(clean) || book.spine?.get?.(clean.split("/").pop());
      if (item && typeof item.index === "number") return item.index;
    } catch {}
    if (typeof loc?.start?.index === "number") return loc.start.index;
    return null;
  }, []);

  const segmentFromSpine = useCallback((spineIdx) => {
    const map = tocSpineIdxRef.current;
    if (!map.length || typeof spineIdx !== "number") return null;
    let seg = 0;
    for (let j = 0; j < map.length; j++) {
      if (typeof map[j] === "number" && map[j] <= spineIdx) seg = j;
    }
    return seg;
  }, []);

  const handleRelocated = useCallback(
    (loc) => {
      const href = loc?.start?.href ? stripHashQuery(loc.start.href) : "";
      if (href) setActiveHref(href);
      setAtBookEnd(!!loc?.atEnd);
      setChapterIntra(calcChapterIntra(loc));

      const spineIdx = currentSpineIndex(loc);
      const seg = segmentFromSpine(spineIdx);
      if (typeof seg === "number") {
        setSegIndex((prev) => (seg !== prev ? seg : prev));
      }
    },
    [currentSpineIndex, segmentFromSpine]
  );

  const updateIfReady = useCallback(() => {
    const loc = getRenditionLocationSafe();
    if (loc) handleRelocated(loc);
  }, [getRenditionLocationSafe, handleRelocated]);

  const handleLocationChanged = useCallback((loc) => {
    setLocation(loc);
    try {
      localStorage.setItem("epub:location", loc);
    } catch {}
  }, []);

  // ----- Reader styles via CSS variables -----
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

  // ---------- “Poke” der tvinger layout-recalc ----------
  const pokeRendition = useCallback(
    (reason = "poke") => {
      const r = renditionRef.current;
      const host = containerRef.current;
      if (!r || !host) return;

      const rect = host.getBoundingClientRect();
      const W = Math.floor(rect.width);
      const H = Math.floor(rect.height);

      const loc = getRenditionLocationSafe();
      const target = loc?.start?.cfi || loc?.start?.href || undefined;

      try {
        r.reformat?.();
      } catch {}
      try {
        r.resize?.(W, H);
      } catch {}
      Promise.resolve()
        .then(() => (target ? r.display(target) : r.display()))
        .catch(() => {});

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

      setTimeout(() => {
        try {
          r.resize?.(W, H);
        } catch {}
        try {
          window.dispatchEvent(new Event("resize"));
        } catch {}
      }, 350); // match Offcanvas transition
    },
    [getRenditionLocationSafe]
  );

  // ----------- Init af rendition + temaer -----------
  const handleGetRendition = useCallback(
    (rendition) => {
      renditionRef.current = rendition;
      if (rendition.book) bookRef.current = rendition.book;

      rendition.flow?.("paginated");

      // INITIAL spread afhængigt af aktuel fullscreen (via ref)
      if (isFullscreenRef.current) {
        rendition.spread?.("both"); // tving 2 sider i fullscreen
        rendition.settings.minSpreadWidth = 0; // ingen tærskel
      } else {
        rendition.spread?.("none"); // modal: 1 side
        rendition.settings.minSpreadWidth = Number.POSITIVE_INFINITY;
      }

      // — Globalt tema (inkl. cover-centrering uden 100vh) —
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

      // Per-kapitel hook
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
        } catch {}
      });

      rendition.on("relocated", handleRelocated);

      const tryInit = () => updateIfReady();
      rendition.on("rendered", tryInit);
      setTimeout(tryInit, 250);
    },
    [handleRelocated, updateIfReady]
  );

  // ----------- Reagér på fullscreen-toggle -----------
  useEffect(() => {
    const r = renditionRef.current;
    if (!r) return;

    if (isFullscreen) {
      r.spread?.("both"); // sikre 2 sider i fullscreen
      r.settings.minSpreadWidth = 0;
    } else {
      r.spread?.("none");
      r.settings.minSpreadWidth = Number.POSITIVE_INFINITY;
    }
    pokeRendition("toggle-fullscreen");
  }, [isFullscreen, pokeRendition]);

  const handleBookReady = useCallback(
    (book) => {
      bookRef.current = book;
      rebuildTocSpineIndex();
      setTimeout(updateIfReady, 0);
    },
    [rebuildTocSpineIndex, updateIfReady]
  );

  // Klik på label → hop
  const handleJump = useCallback((href) => {
    const r = renditionRef.current;
    if (!r || !href) return;
    r.display(href).catch(() => {});
  }, []);

  // Labels (lige brede)
  const segments = Math.max(1, tocFlat.length || 1);
  const labels = useMemo(() => {
    const activeNorm = stripHashQuery(activeHref);
    return tocFlat.map((it) => ({
      ...it,
      hrefNorm: stripHashQuery(it.href),
      active: stripHashQuery(it.href) === activeNorm,
    }));
  }, [tocFlat, activeHref]);

  // ——— AFLEDT, KUMULATIV PROGRESS ———
  const isLastSeg = segIndex >= segments - 1;
  const intraEff =
    isLastSeg && (atBookEnd || chapterIntra >= 0.995) ? 1 : chapterIntra;
  const overallPctDerived = ((segIndex + intraEff) / segments) * 100;

  return (
    <div className={`${styles.wrapper} readerWrapper`} ref={containerRef}>
      {/* Reader */}
      <ReactReader
        key={isFullscreen ? "reader-fs" : "reader-modal"} // remount som failsafe
        url={src}
        title={title}
        location={location}
        getRendition={handleGetRendition}
        readerStyles={readerStyles}
        tocChanged={(toc) => {
          const flat = (toc || []).flatMap((node) => {
            const out = [];
            const walk = (n) => {
              if (n?.href) out.push({ href: n.href, label: n.label });
              if (Array.isArray(n?.subitems)) n.subitems.forEach(walk);
            };
            walk(node);
            return out;
          });
          setTocFlat(flat);
          setTimeout(() => {
            rebuildTocSpineIndex();
            updateIfReady();
          }, 0);
        }}
        locationChanged={handleLocationChanged}
        onBookReady={handleBookReady}
      />

      {/* Progress UI */}
      <div className={styles.progress}>
        {labels.length > 0 && (
          <div
            className={styles.labels}
            role="navigation"
            aria-label="Bogsektioner"
            style={{ ["--segments"]: segments }}
          >
            {labels.map((it, i) => (
              <div
                className={`${styles.labelBtn} ${
                  it.active ? styles.active : ""
                }`}
                key={`${it.href}-${i}`}
                style={{ width: `calc(100% / ${segments})` }}
              >
                <Link
                  title={it.label}
                  onClick={() => handleJump(it.href)}
                  className={styles.labelText}
                  aria-current={it.active ? "true" : undefined}
                >
                  <Text type="text5">{it.label}</Text>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div
          className={styles.progressTrack}
          style={{ ["--segments"]: segments }}
          aria-label="Bogprogress"
        >
          <div
            className={styles.progressFill}
            style={{ width: `${overallPctDerived}%` }}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(overallPctDerived)}
          />
        </div>
      </div>
    </div>
  );
}
