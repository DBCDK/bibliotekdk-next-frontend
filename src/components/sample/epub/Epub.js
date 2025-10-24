"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Epub.module.css";

const ReactReader = dynamic(
  () => import("react-reader").then((m) => m.ReactReader),
  { ssr: false }
);

export default function Epub({ url, title, height = 560 }) {
  const [location, setLocation] = useState(0);
  const [pageLabel, setPageLabel] = useState("");

  const renditionRef = useRef(null);
  const tocRef = useRef([]);

  // Indlæs sidste position
  useEffect(() => {
    try {
      const saved = localStorage.getItem("epub:location");
      if (saved) setLocation(saved);
    } catch {}
  }, []);

  // Helpers
  const normalizeHref = (h) => (h || "").split("#")[0];

  const findChapterLabel = useCallback((href) => {
    if (!href || !tocRef.current?.length) return null;
    const clean = normalizeHref(href);

    // 1) eksakt
    let item = tocRef.current.find((i) => normalizeHref(i.href) === clean);
    if (item?.label) return item.label;

    // 2) endsWith
    item = tocRef.current.find((i) => clean.endsWith(normalizeHref(i.href)));
    if (item?.label) return item.label;

    // 3) contains
    item = tocRef.current.find((i) => clean.includes(normalizeHref(i.href)));
    return item?.label || null;
  }, []);

  const formatLabel = (raw) => {
    if (!raw) return null;
    const lbl = String(raw).replace(/\s+/g, " ").trim();
    // Fjern evt. “Kapitel ”-prefix hvis udgiveren har skrevet det i label
    return lbl.replace(/^kapitel\s+/i, "") || null;
  };

  const makePageText = (loc) => {
    const start = loc?.start;
    const end = loc?.end;
    const s = start?.displayed?.page ?? 0;
    const e = end?.displayed?.page ?? s;
    const total = start?.displayed?.total ?? 0;
    if (!s || !total) return null;
    return e && e !== s
      ? `Side ${s}–${e} af ${total}`
      : `Side ${s} af ${total}`;
  };

  // Robust hent af "current location" uden at antage API-form
  const getCurrentLocationSafe = useCallback(() => {
    const r = renditionRef.current;
    if (!r) return null;

    try {
      if (typeof r.currentLocation === "function") {
        const loc = r.currentLocation();
        if (loc) return loc;
      }
    } catch {}

    // Nogle builds lægger den også på r.location
    try {
      if (r.location) return r.location;
    } catch {}

    return null;
  }, []);

  const updateLabelFromLoc = useCallback(
    (loc) => {
      const txt = makePageText(loc);
      const href = loc?.start?.href;
      const chap = formatLabel(findChapterLabel(href));

      if (txt && chap) setPageLabel(`${txt} i ${chap}`);
      else if (txt) setPageLabel(txt);
      else if (chap) setPageLabel(chap);
      else setPageLabel("");
    },
    [findChapterLabel]
  );

  // Kør kun når rendition er klar; kald aldrig metoder direkte uden tjek
  const updateLabelIfReady = useCallback(() => {
    const loc = getCurrentLocationSafe();
    if (loc) updateLabelFromLoc(loc);
  }, [getCurrentLocationSafe, updateLabelFromLoc]);

  const handleLocationChanged = useCallback((loc) => {
    setLocation(loc);
    try {
      localStorage.setItem("epub:location", loc);
    } catch {}
    // Detaljer (displayed.page/total) opdateres via 'relocated'
  }, []);

  const handleGetRendition = useCallback(
    (rendition) => {
      renditionRef.current = rendition;

      // Layout
      rendition.flow?.("paginated");
      rendition.spread?.("auto");
      rendition.settings.minSpreadWidth = 700;

      rendition.themes?.default({
        body: {
          background: "#fff",
          color: "#111",
          "font-family":
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          "line-height": "1.5",
        },
      });

      // Pålidelig opdatering ved hver relocation
      rendition.on("relocated", (loc) => updateLabelFromLoc(loc));

      // Prøv at sætte første label, når der er renderet noget
      const tryInit = () => updateLabelIfReady();
      rendition.on("rendered", tryInit);
      setTimeout(tryInit, 250);
    },
    [updateLabelFromLoc, updateLabelIfReady]
  );

  return (
    <div className={styles.wrapper}>
      <ReactReader
        url={url}
        title={title}
        location={location}
        getRendition={handleGetRendition}
        tocChanged={(toc) => {
          tocRef.current = toc || [];
          // Opdater kun hvis rendition er klar
          setTimeout(updateLabelIfReady, 0);
        }}
        locationChanged={handleLocationChanged}
      />

      <div className={styles.metaBar}>
        <span className={styles.pageLabel}>{pageLabel}</span>
      </div>
    </div>
  );
}
