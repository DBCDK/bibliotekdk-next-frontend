// components/sample/epub/utils/epubDebug.js

// Debug flag: kun i development, eller hvis du eksplicit slår det til
export const DEBUG =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_EPUB_DEBUG === "1";

export const dlog = DEBUG
  ? {
      group: (label, ...args) => {
        try {
          console.groupCollapsed(label, ...args);
        } catch {
          console.log(label, ...args);
        }
      },
      end: () => {
        try {
          console.groupEnd();
        } catch {}
      },
      info: (...args) => console.log(...args),
      warn: (...args) => console.warn(...args),
      error: (...args) => console.error(...args),
    }
  : {
      group: () => {},
      end: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    };

const CANDIDATE_PREFIXES = [
  "",
  "OPS/",
  "OEBPS/",
  "EPUB/",
  "Text/",
  "XHTML/",
  "xhtml/",
];

export function normalizeHrefForMatch(s = "") {
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
    for (const pref of CANDIDATE_PREFIXES) {
      unique.add(pref + b);
    }
  }

  return Array.from(new Set(Array.from(unique).filter(Boolean)));
}

export function describeTarget(target) {
  if (!target && target !== 0) return { kind: "none", raw: target };
  if (typeof target === "number") return { kind: "number", raw: target };
  const t = String(target);
  if (t.startsWith("epubcfi(")) return { kind: "cfi", raw: t };
  return { kind: "href", raw: t, norms: normalizeHrefForMatch(t) };
}

export function spineIndexOfDebug(book, href) {
  if (!book || !href) return { idx: null, hit: null, tried: [] };
  const tried = [];
  let hit = null;
  let idx = null;

  for (const candidate of normalizeHrefForMatch(href)) {
    try {
      const item = book.spine?.get?.(candidate);
      tried.push({ candidate, ok: !!item, idx: item?.index });
      if (item && typeof item.index === "number") {
        hit = candidate;
        idx = item.index;
        break;
      }
    } catch (e) {
      tried.push({ candidate, ok: false, error: String(e) });
    }
  }
  return { idx, hit, tried };
}

export function dumpBookOverview(book, tocFlat) {
  try {
    const spineItems = book?.spine?.spineItems || [];
    const navToc = book?.navigation?.toc || [];
    dlog.group("[EPUB DBG] OVERVIEW");
    dlog.info("Spine length:", spineItems.length);
    console.table(
      spineItems.map((it, i) => ({
        i,
        href: it?.href,
        idref: it?.idref,
        linear: it?.linear,
        properties: it?.properties,
      }))
    );
    dlog.info("Navigation TOC length:", navToc.length);
    if (navToc.length) {
      const flatten = (nodes) =>
        nodes.flatMap((n) => [
          { href: n?.href, label: n?.label },
          ...(Array.isArray(n?.subitems) ? flatten(n.subitems) : []),
        ]);
      console.table(flatten(navToc));
    }

    dlog.info("UI tocFlat length:", tocFlat?.length);
    if (tocFlat?.length) {
      console.table(tocFlat.map((x) => ({ href: x.href, label: x.label })));
    }
    dlog.end();
  } catch {
    // ignore
  }
}
