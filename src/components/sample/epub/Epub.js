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

export default function Epub({ url, title }) {
  // Reader position (gemmes i localStorage)
  const [location, setLocation] = useState(0);

  // TOC og aktiv sektion
  const [tocFlat, setTocFlat] = useState([]); // [{ href, label }]
  const [activeHref, setActiveHref] = useState("");

  // Segment/intra (bruges i render til samlet progress)
  const [segIndex, setSegIndex] = useState(0); // 0-baseret kapitel-indeks
  const [chapterIntra, setChapterIntra] = useState(0); // 0..1 inden for aktivt kapitel
  const [atBookEnd, setAtBookEnd] = useState(false); // true når bogen er helt slut

  // Refs
  const renditionRef = useRef(null);
  const bookRef = useRef(null);
  const tocSpineIdxRef = useRef([]); // mapping: TOC entry -> spineIndex

  // ---------- Helpers ----------
  const stripHashQuery = (s = "") => s.split("#")[0].split("?")[0];
  const dec = (s = "") => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };

  // SIKKER læsning af current location fra rendition
  const getRenditionLocationSafe = () => {
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
  };

  // Spread-aware intra-progress 0..1 (klamp ved slut)
  const calcChapterIntra = (loc) => {
    const s = loc?.start?.displayed?.page ?? 0;
    const e = loc?.end?.displayed?.page ?? s;
    const total = loc?.start?.displayed?.total ?? 0;
    if (!s || !total) return 0;
    const visible = Math.max(1, e - s + 1); // 1 (single) eller 2 (spread)
    const completed = Math.min(total, s + visible - 1);
    let intra = completed / total;
    if (loc?.atEnd || intra >= 0.995) intra = 1; // clamp
    return Math.max(0, Math.min(1, intra));
  };

  // Byg TOC → spineIndex (når både book & toc er klar)
  const rebuildTocSpineIndex = useCallback(() => {
    const book = renditionRef.current?.book || bookRef.current;
    if (!book || !tocFlat.length) return;

    tocSpineIdxRef.current = tocFlat.map((entry) => {
      const clean = dec(stripHashQuery(entry.href));
      let idx = -1;
      try {
        const item =
          book.spine?.get?.(clean) || book.spine?.get?.(clean.split("/").pop()); // fallback på filnavn
        if (item && typeof item.index === "number") idx = item.index;
      } catch {}
      return idx >= 0 ? idx : 0; // konservativ fallback
    });
  }, [tocFlat]);

  // Gendan sidste position
  useEffect(() => {
    try {
      const saved = localStorage.getItem("epub:location");
      if (saved) setLocation(saved);
    } catch {}
  }, []);

  // Genbyg mapping når inputs ændrer sig, og sync progress til aktuel loc
  useEffect(() => {
    rebuildTocSpineIndex();
    const loc = getRenditionLocationSafe();
    if (loc) handleRelocated(loc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rebuildTocSpineIndex]);

  // SpineIndex for current location via spine.get(href)
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

  // Segment (TOC) ud fra spineIndex: største j hvor map[j] <= spineIdx
  const segmentFromSpine = useCallback((spineIdx) => {
    const map = tocSpineIdxRef.current;
    if (!map.length || typeof spineIdx !== "number") return null;
    let seg = 0;
    for (let j = 0; j < map.length; j++) {
      if (typeof map[j] === "number" && map[j] <= spineIdx) seg = j;
    }
    return seg;
  }, []);

  // Hovedhandler for relocated
  const handleRelocated = useCallback(
    (loc) => {
      // aktiv label
      const href = loc?.start?.href ? stripHashQuery(loc.start.href) : "";
      if (href) setActiveHref(href);

      // state til progress
      setAtBookEnd(!!loc?.atEnd);
      setChapterIntra(calcChapterIntra(loc));

      // segment ud fra spine
      const spineIdx = currentSpineIndex(loc);
      const seg = segmentFromSpine(spineIdx);
      if (typeof seg === "number") {
        setSegIndex((prev) => (seg !== prev ? seg : prev));
      }
    },
    [currentSpineIndex, segmentFromSpine]
  );

  // Init/sync når klar
  const updateIfReady = useCallback(() => {
    const loc = getRenditionLocationSafe();
    if (loc) handleRelocated(loc);
  }, [handleRelocated]);

  // Reader callbacks
  const handleLocationChanged = useCallback((loc) => {
    setLocation(loc);
    try {
      localStorage.setItem("epub:location", loc);
    } catch {}
    // progress opdateres i relocated for at undgå “nulstilling”
  }, []);

  // ----- Reader styles via CSS variables -----
  const [BaseReaderStyle, setBaseReaderStyle] = useState(null);
  useEffect(() => {
    // hent standard stilarter fra react-reader dynamisk
    import("react-reader").then((m) => {
      setBaseReaderStyle(m.ReactReaderStyle);
    });
  }, []);

  const readerStyles = useMemo(() => {
    if (!BaseReaderStyle) return undefined; // brug defaults indtil de er loadet
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
        borderBottom: "var(--epub-title-border, 1px solid rgba(0,0,0,0.06))",
      },
      arrow: {
        ...BaseReaderStyle.arrow,
        color: "var(--epub-arrow-fg)",
      },
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

  const handleGetRendition = useCallback(
    (rendition) => {
      renditionRef.current = rendition;
      if (rendition.book) bookRef.current = rendition.book;

      rendition.flow?.("paginated");
      rendition.spread?.("auto");
      rendition.settings.minSpreadWidth = 700;

      // 1) Globalt theme (hele bogen)
      rendition.themes?.default({
        body: {
          background: "var(--epub-page-bg)",
          color: "var(--epub-page-fg)",
          "font-family":
            "var(--epub-page-font, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif)",
          "line-height": "var(--epub-page-line-height, 1.55)",
        },
        // Skjul/tilpas
        "header, footer, .watermark, .ad": { display: "none !important" },
        img: { "max-width": "100% !important", height: "auto" },
      });

      // 2) Per-kapitel hook
      rendition.hooks.content.register((contents) => {
        contents.addStylesheetRules([
          ["header, footer, .watermark, .ad", { display: "none !important" }],
          ["img", { "max-width": "100% !important", height: "auto" }],
        ]);
        // valgfrit:
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
    <div className={styles.wrapper}>
      {/* Labels (lige brede, 50% bredde & centreret via CSS) */}
      {labels.length > 0 && (
        <div
          className={styles.labels}
          role="navigation"
          aria-label="Bogsektioner"
          style={{ ["--segments"]: segments }}
        >
          {labels.map((it, i) => (
            <div
              className={`${styles.labelBtn} ${it.active ? styles.active : ""}`}
              key={`${it.href}-${i}`}
              style={{ width: `calc(100% / ${segments})` }}
            >
              <Link
                title={it.label}
                onClick={() => handleJump(it.href)}
                className={styles.labelText}
                aria-current={it.active ? "true" : undefined}
                // border={{ top: false, bottom: { keepVisible: it.active } }}
              >
                <Text type="text3">{it.label}</Text>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Én kumulativ progress-fill (50% bredde i CSS) */}
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

      {/* Reader */}
      <ReactReader
        url={url}
        title={title}
        location={location}
        getRendition={handleGetRendition}
        readerStyles={readerStyles} // <— CSS-variabler styrer farver mv.
        tocChanged={(toc) => {
          // Flad TOC: kun entries med href
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

          // mapping + sync hvis muligt
          setTimeout(() => {
            rebuildTocSpineIndex();
            updateIfReady();
          }, 0);
        }}
        locationChanged={(loc) => {
          setLocation(loc);
          try {
            localStorage.setItem("epub:location", loc);
          } catch {}
        }}
        onBookReady={handleBookReady}
      />
    </div>
  );
}
