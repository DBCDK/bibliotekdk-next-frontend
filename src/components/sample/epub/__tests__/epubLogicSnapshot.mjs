// src/components/sample/epub/__tests__/epubLogicSnapshot.mjs
// Node-side snapshot builder for epub fixtures.
//
// Goals:
// - Run epubjs in Node using jsdom + minimal polyfills
// - If epubjs fails with "No Metadata Found", fall back to manual ZIP parsing (JSZip)
// - NEVER fail because metadata is missing
// - Return deterministic JSON-friendly snapshot
// - IMPORTANT: compute heuristics + pipeline BEFORE destroying the book
//
// NOTE: Comments in English per request.

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const CANDIDATE_PREFIXES = [
  "",
  "OPS/",
  "OEBPS/",
  "EPUB/",
  "Text/",
  "XHTML/",
  "xhtml/",
];

function defineGlobalIfPossible(key, value) {
  try {
    const desc = Object.getOwnPropertyDescriptor(globalThis, key);

    if (!desc) {
      Object.defineProperty(globalThis, key, {
        value,
        configurable: true,
        writable: true,
        enumerable: true,
      });
      return true;
    }

    if (desc.writable) {
      globalThis[key] = value;
      return true;
    }

    if (desc.configurable) {
      Object.defineProperty(globalThis, key, {
        value,
        configurable: true,
        writable: true,
        enumerable: true,
      });
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

function ensureUrlObjectUrl(win) {
  const blobStore = new Map();
  let blobSeq = 0;

  const createObjectURL = (blob) => {
    const id = ++blobSeq;
    const url = `blob:node-epubjs://${id}`;
    blobStore.set(url, blob);
    return url;
  };

  const revokeObjectURL = (url) => {
    blobStore.delete(url);
  };

  const patch = (URLobj) => {
    if (!URLobj) return;
    if (typeof URLobj.createObjectURL === "function") return;

    try {
      Object.defineProperty(URLobj, "createObjectURL", {
        configurable: true,
        writable: true,
        enumerable: false,
        value: createObjectURL,
      });
    } catch {}

    try {
      Object.defineProperty(URLobj, "revokeObjectURL", {
        configurable: true,
        writable: true,
        enumerable: false,
        value: revokeObjectURL,
      });
    } catch {}
  };

  patch(globalThis.URL);
  patch(win?.URL);
  patch(win?.document?.defaultView?.URL);
}

function ensureDomGlobals() {
  if (globalThis.window && globalThis.document && globalThis.DOMParser) {
    ensureUrlObjectUrl(globalThis.window);
    return;
  }

  let JSDOM;
  try {
    ({ JSDOM } = require("jsdom"));
  } catch (e) {
    throw new Error(
      "jsdom is required for snapshot extraction. Add it to devDependencies. " +
        `Original error: ${String(e?.message || e)}`
    );
  }

  const dom = new JSDOM(
    "<!doctype html><html><head></head><body></body></html>",
    { url: "http://localhost/" }
  );

  defineGlobalIfPossible("window", dom.window);
  defineGlobalIfPossible("document", dom.window.document);
  defineGlobalIfPossible("DOMParser", dom.window.DOMParser);
  defineGlobalIfPossible("XMLSerializer", dom.window.XMLSerializer);
  defineGlobalIfPossible("HTMLElement", dom.window.HTMLElement);
  defineGlobalIfPossible("Node", dom.window.Node);

  // navigator may be read-only in Node/undici; set only if possible.
  defineGlobalIfPossible("navigator", dom.window.navigator);

  if (!globalThis.Blob && dom.window.Blob)
    defineGlobalIfPossible("Blob", dom.window.Blob);
  if (!globalThis.URL && dom.window.URL)
    defineGlobalIfPossible("URL", dom.window.URL);

  ensureUrlObjectUrl(dom.window);

  if (!globalThis.atob) {
    defineGlobalIfPossible("atob", (s) =>
      Buffer.from(String(s), "base64").toString("binary")
    );
  }
  if (!globalThis.btoa) {
    defineGlobalIfPossible("btoa", (s) =>
      Buffer.from(String(s), "binary").toString("base64")
    );
  }
}

function toArrayBuffer(buf) {
  if (buf instanceof ArrayBuffer) return buf;

  if (
    buf &&
    typeof buf === "object" &&
    typeof buf.byteLength === "number" &&
    buf.buffer instanceof ArrayBuffer
  ) {
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  }

  throw new Error(
    "toArrayBuffer: invalid input (expected Buffer/Uint8Array/ArrayBuffer)"
  );
}

function isZipArrayBuffer(ab) {
  try {
    const u8 = new Uint8Array(ab);
    return u8.length >= 2 && u8[0] === 0x50 && u8[1] === 0x4b; // PK
  } catch {
    return false;
  }
}

function stripHashQuery(s = "") {
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

function spineIndexOf(book, href) {
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

function flattenNavTocFromEpubjs(book) {
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
 * IMPORTANT: metadata is optional. NEVER throw here.
 */
function safePickMetadata(book) {
  try {
    const md = book?.packaging?.metadata || book?.package?.metadata || null;

    const title = md?.title || md?.["dc:title"] || md?.["title"] || null;
    const creator =
      md?.creator || md?.["dc:creator"] || md?.["creator"] || null;
    const language =
      md?.language || md?.["dc:language"] || md?.["language"] || null;

    return {
      title: title || null,
      creator: creator || null,
      language: language || null,
    };
  } catch {
    return { title: null, creator: null, language: null };
  }
}

function resolveEpubFactory(mod) {
  if (typeof mod === "function") return mod;

  if (mod && typeof mod === "object") {
    if (typeof mod.default === "function") return mod.default;
    if (typeof mod.ePub === "function") return mod.ePub;

    if (mod.default && typeof mod.default === "object") {
      if (typeof mod.default.ePub === "function") return mod.default.ePub;
      if (typeof mod.default.default === "function") return mod.default.default;
    }
  }

  return null;
}

async function importEpubJsFactory() {
  // Try ESM first
  try {
    const mod = await import("epubjs");
    const fn = resolveEpubFactory(mod);
    if (fn) return fn;
  } catch {}

  // Fallback to require (CJS)
  try {
    const cjs = require("epubjs");
    const fn = resolveEpubFactory(cjs);
    if (fn) return fn;
  } catch (e) {
    throw new Error(
      `Failed to load epubjs. Original error: ${String(e?.message || e)}`
    );
  }

  throw new Error(
    "epubjs was loaded but no ePub() factory function was found (unexpected export shape)."
  );
}

async function importLogicModule() {
  const mod = await import("../epubLogic.js");
  const fromDefault =
    mod?.default && typeof mod.default === "object" ? mod.default : null;
  return { ...(fromDefault || {}), ...(mod || {}) };
}

function suppressNoisyConsoleErrors({ debug }) {
  const orig = console.error;

  const isNoisyReplaceCss = (args) => {
    const msg = args.map((a) => String(a)).join(" ");
    return (
      msg.includes("replaceCss") ||
      msg.includes("Cannot read properties of undefined (reading 'replaceCss')")
    );
  };

  console.error = (...args) => {
    if (!debug && isNoisyReplaceCss(args)) return;
    orig(...args);
  };

  return () => {
    console.error = orig;
  };
}

async function openBookWithFallback(ePub, ab, { debug }) {
  const attempts = [
    { replacements: "blobUrl", name: "blobUrl" },
    { replacements: "base64", name: "base64" },
  ];

  let lastErr = null;

  for (const a of attempts) {
    const book = ePub({
      replacements: a.replacements,
      encoding: "binary",
      openAs: "binary",
    });

    const restoreConsole = suppressNoisyConsoleErrors({ debug });

    try {
      await book.open(ab, "binary");
      await book.ready;

      try {
        await Promise.resolve(book.loaded?.spine);
      } catch {}
      try {
        await Promise.resolve(book.loaded?.navigation);
      } catch {}

      restoreConsole();

      if (debug) {
        // eslint-disable-next-line no-console
        console.log(`[SNAPSHOT] epubjs open ok via replacements="${a.name}"`);
      }

      return book;
    } catch (e) {
      restoreConsole();

      lastErr = e;
      try {
        book.destroy?.();
      } catch {}

      const msg = String(e?.message || e);

      // If metadata is missing, epubjs throws from Packaging.parse and there is nothing we can do here.
      if (msg.includes("No Metadata Found")) throw e;

      // Retry on other known fragile issues
      const retryable =
        msg.includes("replaceCss") ||
        msg.includes("createObjectURL") ||
        msg.includes("Archive") ||
        msg.includes("replacements");

      if (!retryable) throw e;

      if (debug) {
        // eslint-disable-next-line no-console
        console.log(
          `[SNAPSHOT] open failed via "${a.name}" (${msg}) -> retrying...`
        );
      }
    }
  }

  throw lastErr || new Error("Failed to open book with all attempts");
}

// -----------------------------
// Manual ZIP fallback (JSZip)
// -----------------------------

function parseXml(xmlString) {
  const parser = new globalThis.DOMParser();
  const doc = parser.parseFromString(String(xmlString), "application/xml");
  return doc;
}

function firstText(el) {
  if (!el) return null;
  const t = el.textContent;
  return t ? String(t).trim() : null;
}

function getAttr(el, name) {
  if (!el) return null;
  const v = el.getAttribute?.(name);
  return v == null ? null : String(v);
}

function joinPosix(base, rel) {
  const b = String(base || "").replace(/\\/g, "/");
  const r = String(rel || "").replace(/\\/g, "/");

  if (!b) return r;
  if (!r) return b;

  if (r.startsWith("/")) return r.slice(1);
  let baseTrimmed = b;
  while (baseTrimmed.endsWith("/")) {
    baseTrimmed = baseTrimmed.slice(0, -1);
  }
  const parts = (baseTrimmed + "/" + r).split("/");
  const out = [];
  for (const p of parts) {
    if (!p || p === ".") continue;
    if (p === "..") out.pop();
    else out.push(p);
  }
  return out.join("/");
}

function dirnamePosix(p) {
  const s = String(p || "").replace(/\\/g, "/");
  const i = s.lastIndexOf("/");
  return i >= 0 ? s.slice(0, i + 1) : "";
}

async function readZipText(zip, filePath) {
  const file = zip.file(filePath);
  if (!file) return null;
  return await file.async("text");
}

function buildMiniBookFromSpine(spineHrefs) {
  const spineItems = spineHrefs.map((href, idx) => ({
    href,
    index: idx,
    idref: null,
    properties: null,
    linear: null,
  }));

  const map = new Map();
  for (const it of spineItems) {
    map.set(it.href, it);
    map.set(stripHashQuery(it.href), it);
    map.set(it.href.split("/").pop(), it);
  }

  return {
    spine: {
      spineItems,
      get: (href) => {
        if (!href) return null;
        const candidates = normalizeHrefForMatch(href);
        for (const c of candidates) {
          const hit = map.get(c) || map.get(stripHashQuery(c));
          if (hit) return hit;
        }
        return null;
      },
    },
  };
}

function flattenNavXhtmlToToc(doc) {
  // EPUB3 nav.xhtml: <nav epub:type="toc"> ... <a href="...">Label</a>
  const out = [];

  const navs = Array.from(doc.querySelectorAll("nav"));
  const tocNav =
    navs.find((n) => {
      const epubType =
        n.getAttribute("epub:type") || n.getAttribute("type") || "";
      return /\btoc\b/i.test(epubType);
    }) || navs[0];

  if (!tocNav) return out;

  const links = Array.from(tocNav.querySelectorAll("a[href]"));
  for (const a of links) {
    const href = a.getAttribute("href");
    const label = (a.textContent || "").trim();
    if (href) out.push({ href, label });
  }

  return out;
}

function flattenNcxToToc(doc) {
  // EPUB2 toc.ncx: <navMap><navPoint><navLabel><text>..</text></navLabel><content src="..."/></navPoint>
  const out = [];
  const navPoints = Array.from(doc.getElementsByTagName("navPoint"));

  for (const np of navPoints) {
    const labelText = firstText(np.getElementsByTagName("text")?.[0]) || "";
    const contentEl = np.getElementsByTagName("content")?.[0] || null;
    const src = getAttr(contentEl, "src");
    if (src) out.push({ href: src, label: labelText });
  }

  return out;
}

async function manualZipExtractSnapshot(ab, { debug }) {
  let JSZip;
  try {
    JSZip = require("jszip");
  } catch (e) {
    throw new Error(
      "JSZip is required for manual EPUB parsing fallback. Add it to devDependencies. " +
        `Original error: ${String(e?.message || e)}`
    );
  }

  const zip = await JSZip.loadAsync(ab); // NOSONAR

  const containerXml = await readZipText(zip, "META-INF/container.xml");
  if (!containerXml) {
    throw new Error("Manual parse: META-INF/container.xml not found");
  }

  const containerDoc = parseXml(containerXml);
  const rootfileEl = containerDoc.getElementsByTagName("rootfile")?.[0] || null;

  const opfPath = getAttr(rootfileEl, "full-path");
  if (!opfPath)
    throw new Error("Manual parse: OPF full-path not found in container.xml");

  const opfXml = await readZipText(zip, opfPath);
  if (!opfXml) throw new Error(`Manual parse: OPF not found at ${opfPath}`);

  const opfDoc = parseXml(opfXml);
  const opfDir = dirnamePosix(opfPath);

  // metadata (optional)
  const mdEl = opfDoc.getElementsByTagName("metadata")?.[0] || null;
  const title =
    firstText(mdEl?.getElementsByTagName("dc:title")?.[0]) ||
    firstText(mdEl?.getElementsByTagName("title")?.[0]) ||
    null;

  const creator =
    firstText(mdEl?.getElementsByTagName("dc:creator")?.[0]) ||
    firstText(mdEl?.getElementsByTagName("creator")?.[0]) ||
    null;

  const language =
    firstText(mdEl?.getElementsByTagName("dc:language")?.[0]) ||
    firstText(mdEl?.getElementsByTagName("language")?.[0]) ||
    null;

  // manifest map id -> href + props + media-type
  const manifestEl = opfDoc.getElementsByTagName("manifest")?.[0] || null;
  const itemEls = manifestEl
    ? Array.from(manifestEl.getElementsByTagName("item"))
    : [];
  const manifest = new Map();
  for (const it of itemEls) {
    const id = getAttr(it, "id");
    const href = getAttr(it, "href");
    if (!id || !href) continue;
    manifest.set(id, {
      id,
      href: joinPosix(opfDir, href),
      properties: getAttr(it, "properties") || "",
      mediaType: getAttr(it, "media-type") || "",
    });
  }

  // spine idrefs -> href
  const spineEl = opfDoc.getElementsByTagName("spine")?.[0] || null;
  const itemrefEls = spineEl
    ? Array.from(spineEl.getElementsByTagName("itemref"))
    : [];
  const spineHrefs = [];
  for (const ir of itemrefEls) {
    const idref = getAttr(ir, "idref");
    if (!idref) continue;
    const m = manifest.get(idref);
    if (m?.href) spineHrefs.push(m.href);
  }

  // TOC: EPUB3 nav or EPUB2 ncx
  let tocFlat = [];

  const navItem = Array.from(manifest.values()).find((m) =>
    /\bnav\b/i.test(m.properties)
  );
  if (navItem?.href) {
    const navXhtml = await readZipText(zip, navItem.href);
    if (navXhtml) {
      const navDoc = new globalThis.DOMParser().parseFromString(
        navXhtml,
        "text/html"
      );
      tocFlat = flattenNavXhtmlToToc(navDoc).map((t) => ({
        href: joinPosix(dirnamePosix(navItem.href), t.href),
        label: t.label,
      }));
      if (debug) {
        // eslint-disable-next-line no-console
        console.log(
          `[SNAPSHOT] manual toc via nav: ${navItem.href} (items=${tocFlat.length})`
        );
      }
    }
  }

  if (!tocFlat.length) {
    const ncxItem =
      Array.from(manifest.values()).find(
        (m) => m.mediaType === "application/x-dtbncx+xml"
      ) || null;

    if (ncxItem?.href) {
      const ncxXml = await readZipText(zip, ncxItem.href);
      if (ncxXml) {
        const ncxDoc = parseXml(ncxXml);
        tocFlat = flattenNcxToToc(ncxDoc).map((t) => ({
          href: joinPosix(dirnamePosix(ncxItem.href), t.href),
          label: t.label,
        }));
        if (debug) {
          // eslint-disable-next-line no-console
          console.log(
            `[SNAPSHOT] manual toc via ncx: ${ncxItem.href} (items=${tocFlat.length})`
          );
        }
      }
    }
  }

  const miniBook = buildMiniBookFromSpine(spineHrefs);

  const spine = spineHrefs.map((href, idx) => ({
    index: idx,
    href,
    idref: null,
    properties: null,
    linear: null,
  }));

  const tocFlatMapped = tocFlat.map((it) => {
    const r = spineIndexOf(miniBook, it.href);
    return {
      href: it.href,
      hrefNoFrag: stripHashQuery(it.href),
      label: it.label || "",
      spineIndex: typeof r.idx === "number" ? r.idx : null,
      spineHit: r.hit || null,
    };
  });

  const countsBySpine = {};
  for (const t of tocFlatMapped) {
    const k = typeof t.spineIndex === "number" ? String(t.spineIndex) : "null";
    countsBySpine[k] = (countsBySpine[k] || 0) + 1;
  }
  const duplicateSpineIndexCount = Object.entries(countsBySpine).filter(
    ([k, v]) => k !== "null" && v > 1
  ).length;

  return {
    book: miniBook,
    spine,
    tocFlat: tocFlatMapped,
    metadata: {
      title: title || null,
      creator: creator || null,
      language: language || null,
    },
    duplicateSpineIndexCount,
  };
}

// -----------------------------
// Snapshot (public)
// -----------------------------

export async function buildEpubLogicSnapshot(
  zipBytes,
  { fileName = null, debug = false } = {}
) {
  ensureDomGlobals();

  const ab = toArrayBuffer(zipBytes);
  if (!isZipArrayBuffer(ab)) {
    throw new Error(
      "Input does not look like a ZIP (missing PK header). Is the file a .zip?"
    );
  }

  const ePub = await importEpubJsFactory();
  const logic = await importLogicModule();

  let book = null;
  let spine = [];
  let tocFlat = [];
  let duplicateSpineIndexCount = 0;
  let meta = { title: null, creator: null, language: null };
  let usedManual = false;

  // Pipeline artifacts (raw -> dedupe -> prepend -> score -> maybe collapse)
  let pipeline = {
    tocRaw: [],
    tocDeduped: [],
    tocWithFront: [],
    tocFinal: [],
    score: null,
    collapse: false,
  };

  try {
    // Try epubjs first
    try {
      book = await openBookWithFallback(ePub, ab, { debug });

      const spineItems = book?.spine?.spineItems || [];
      spine = spineItems.map((it, i) => ({
        index: typeof it?.index === "number" ? it.index : i,
        href: it?.href || null,
        idref: it?.idref || null,
        properties: it?.properties || null,
        linear: it?.linear ?? null,
      }));

      const tocFlatRaw = flattenNavTocFromEpubjs(book);
      tocFlat = tocFlatRaw.map((it) => {
        const r = spineIndexOf(book, it.href);
        return {
          href: it.href,
          hrefNoFrag: stripHashQuery(it.href),
          label: it.label || "",
          spineIndex: typeof r.idx === "number" ? r.idx : null,
          spineHit: r.hit || null,
        };
      });

      const countsBySpine = {};
      for (const t of tocFlat) {
        const k =
          typeof t.spineIndex === "number" ? String(t.spineIndex) : "null";
        countsBySpine[k] = (countsBySpine[k] || 0) + 1;
      }
      duplicateSpineIndexCount = Object.entries(countsBySpine).filter(
        ([k, v]) => k !== "null" && v > 1
      ).length;

      meta = safePickMetadata(book);
    } catch (e) {
      const msg = String(e?.message || e);

      if (msg.includes("No Metadata Found")) {
        usedManual = true;
        if (debug) {
          // eslint-disable-next-line no-console
          console.log(
            "[SNAPSHOT] epubjs failed with 'No Metadata Found' -> using manual ZIP parser fallback"
          );
        }

        const manual = await manualZipExtractSnapshot(ab, { debug });
        book = manual.book;
        spine = manual.spine;
        tocFlat = manual.tocFlat;
        meta = manual.metadata;
        duplicateSpineIndexCount = manual.duplicateSpineIndexCount;
      } else {
        throw e;
      }
    }

    // -----------------------------
    // IMPORTANT: run pipeline + heuristics BEFORE destroying book
    // -----------------------------
    const tocRaw = (tocFlat || []).map((x) => ({
      href: x.href,
      label: x.label,
    }));

    const tocDeduped =
      typeof logic.dedupeTocBySpineHref === "function"
        ? logic.dedupeTocBySpineHref(book, tocRaw)
        : tocRaw;

    const tocWithFront =
      typeof logic.prependMissingSpineSections === "function"
        ? logic.prependMissingSpineSections(book, tocDeduped)
        : tocDeduped;

    const score =
      typeof logic.computeEpubStructureScore === "function"
        ? logic.computeEpubStructureScore(book, tocWithFront)
        : null;

    const collapse =
      typeof logic.shouldCollapseToSingleSection === "function"
        ? logic.shouldCollapseToSingleSection(book, tocWithFront)
        : score?.mode === "fallback";

    const tocFinal =
      collapse &&
      typeof logic.collapseToSingleSectionPreserveFrontmatter === "function"
        ? logic.collapseToSingleSectionPreserveFrontmatter(book, tocWithFront)
        : tocWithFront;

    pipeline = {
      tocRaw,
      tocDeduped,
      tocWithFront,
      tocFinal,
      score,
      collapse,
    };

    const snapshot = {
      version: 3,
      generatedAt: new Date().toISOString(),
      fileName: fileName || null,
      parser: usedManual ? "manual-zip" : "epubjs",
      metadata: meta, // allowed to be nulls
      counts: {
        spineLen: spine.length,
        tocLen: tocFlat.length,
        duplicateSpineIndexCount,
      },
      spine,
      tocFlat,
      pipeline,
      heuristics: {
        // Keep old location for compatibility, but make it UI-truthful:
        structure: score,
        collapse,
      },
    };

    if (debug) {
      // eslint-disable-next-line no-console
      console.log("[SNAPSHOT]", {
        fileName: snapshot.fileName,
        parser: snapshot.parser,
        spineLen: snapshot.counts.spineLen,
        tocLen: snapshot.counts.tocLen,
        dupSpine: snapshot.counts.duplicateSpineIndexCount,
        meta: snapshot.metadata,
        struct: snapshot.heuristics?.structure || null,
        collapse: snapshot.heuristics?.collapse || false,
        tocRaw: snapshot.pipeline?.tocRaw?.length || 0,
        tocFinal: snapshot.pipeline?.tocFinal?.length || 0,
      });
    }

    return snapshot;
  } finally {
    try {
      book?.destroy?.();
    } catch {}
  }
}
