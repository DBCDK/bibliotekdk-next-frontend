// components/sample/epub/utils/sanitizeEpubZip.js
"use client";

import JSZip from "jszip";

/**
 * Sanitizer der prøver at gøre EPUB “mere parsebar”.
 *
 * Fixer typiske problemer:
 * - OPF/NCX deklarerer encoding="utf-8" men bytes er ikke valid UTF-8
 * - OPF/NCX har mange U+FFFD replacement chars ved UTF-8 decode
 * - XML declaration encoding justeres til utf-8
 *
 * Returnerer:
 * { buffer, sanitized, report }
 */
export async function sanitizeEpubZip(arrayBuffer, { debug } = {}) {
  const report = {
    containerPath: null,
    opfPath: null,
    patchedFiles: [],
    reasons: [],
  };

  debug?.add?.("sanitize:start", { bytes: arrayBuffer?.byteLength });

  // quick zip magic check
  try {
    const u8 = new Uint8Array(arrayBuffer);
    const isZip = u8[0] === 0x50 && u8[1] === 0x4b;
    if (!isZip) {
      debug?.add?.("sanitize:skip:not-zip");
      return { buffer: arrayBuffer, sanitized: false, report };
    }
  } catch {}

  const zip = await JSZip.loadAsync(arrayBuffer); // NOSONAR

  // Find container.xml
  const containerFile = zip.file("META-INF/container.xml");
  if (!containerFile) {
    debug?.add?.("sanitize:no-container-xml");
    // Vi kan stadig patch'e alle .opf/.ncx hvis de findes
  } else {
    report.containerPath = "META-INF/container.xml";
    const containerXmlBytes = await containerFile.async("uint8array");
    const containerXml = decodeBestEffortXml(
      containerXmlBytes,
      debug,
      "META-INF/container.xml"
    );
    const opfPath = extractOpfPathFromContainerXml(containerXml);

    if (opfPath) {
      report.opfPath = opfPath;
      debug?.add?.("sanitize:opfPath", { opfPath });
    } else {
      debug?.add?.("sanitize:opfPath:not-found");
    }
  }

  // Kandidatfiler vi vil patch'e:
  // 1) OPF fra container.xml (hvis fundet)
  // 2) Alle .opf/.ncx (fallback)
  const targetNames = new Set();

  if (report.opfPath && zip.file(report.opfPath))
    targetNames.add(report.opfPath);

  Object.keys(zip.files || {}).forEach((name) => {
    if (!name) return;
    if (name.endsWith("/")) return;
    if (/\.opf$/i.test(name) || /\.ncx$/i.test(name)) targetNames.add(name);
  });

  if (targetNames.size === 0) {
    debug?.add?.("sanitize:no-opf-ncx-found");
    return { buffer: arrayBuffer, sanitized: false, report };
  }

  let changed = false;

  for (const name of targetNames) {
    const f = zip.file(name);
    if (!f) continue;

    const bytes = await f.async("uint8array");

    // Heuristik: Hvis filen er “sund”, lad den være
    const result = maybeFixXmlEncoding(bytes, name, debug);

    if (result.changed) {
      zip.file(name, result.bytes);
      changed = true;
      report.patchedFiles.push({
        name,
        reason: result.reason,
        before: result.beforeSummary,
        after: result.afterSummary,
      });
    }
  }

  if (!changed) {
    debug?.add?.("sanitize:done:no-changes");
    return { buffer: arrayBuffer, sanitized: false, report };
  }

  debug?.add?.("sanitize:patched", {
    patchedCount: report.patchedFiles.length,
    files: report.patchedFiles.map((x) => x.name),
  });

  const out = await zip.generateAsync({
    type: "arraybuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  debug?.add?.("sanitize:done:changed", { outBytes: out.byteLength });

  return { buffer: out, sanitized: true, report };
}

/**
 * Udtrækker OPF-path fra META-INF/container.xml
 */
function extractOpfPathFromContainerXml(containerXml) {
  // typisk: <rootfile full-path="OEBPS/content.opf" ... />
  const m = containerXml.match(/full-path\s*=\s*["']([^"']+\.opf)["']/i);
  return m?.[1] || null;
}

/**
 * Decoder XML med best effort (UTF-8 først, fallback).
 */
function decodeBestEffortXml(uint8, debug, name) {
  // Prøv strict utf-8 først
  try {
    const t = new TextDecoder("utf-8", { fatal: true }).decode(uint8);
    return t;
  } catch {
    // fallback windows-1252 hvis browser understøtter det
  }

  const alt = decodeWindows1252OrLatin1(uint8);
  debug?.add?.("sanitize:decode:fallback", { name, encoding: alt.encoding });
  return alt.text;
}

/**
 * Hvis en XML fil er “mistænkelig” (ikke valid UTF-8 eller mange replacement chars),
 * så re-encoder vi den til UTF-8 og retter xml-declaration encoding til utf-8.
 */
function maybeFixXmlEncoding(bytes, name, debug) {
  // 1) Forsøg fatal UTF-8
  let utf8Text = null;
  let utf8FatalOk = true;
  try {
    utf8Text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    utf8FatalOk = false;
  }

  // 2) Forsøg non-fatal UTF-8 og tæl replacement chars
  let utf8NonFatal = "";
  try {
    utf8NonFatal = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch {
    utf8NonFatal = "";
  }
  const utf8Repl = countReplacementChars(utf8NonFatal);

  // 3) Fallback decode (windows-1252/latin1) og tæl replacement chars
  const alt = decodeWindows1252OrLatin1(bytes);
  const altRepl = countReplacementChars(alt.text);

  // 4) Beslut om vi skal ændre
  // - hvis fatal UTF-8 fejler -> SKAL ændres
  // - hvis non-fatal har mange replacements og alt har færre -> ændres
  const tooManyRepl = utf8Repl >= 3 && altRepl < utf8Repl; // konservativ
  const shouldChange = !utf8FatalOk || tooManyRepl;

  // 5) Men hvis utf8Text findes og ikke ser mistænkelig ud -> behold
  if (!shouldChange) {
    // Dog: hvis xml decl siger noget andet end utf-8, kan vi normalisere
    const normalized = normalizeXmlDeclarationEncoding(
      utf8Text || utf8NonFatal
    );
    if (normalized.changed) {
      const outBytes = new TextEncoder().encode(normalized.text);
      debug?.add?.("sanitize:xml-decl-normalized", { name });
      return {
        changed: true,
        bytes: outBytes,
        reason: "xml-declaration-normalized",
        beforeSummary: summarizeTextForDebug(utf8Text || utf8NonFatal),
        afterSummary: summarizeTextForDebug(normalized.text),
      };
    }
    return { changed: false };
  }

  const chosenText =
    !utf8FatalOk || tooManyRepl ? alt.text : utf8Text || utf8NonFatal;

  // Hvis filen selv siger encoding="utf-8" men er broken, fix:
  const normalized = normalizeXmlDeclarationEncoding(chosenText);

  const outBytes = new TextEncoder().encode(normalized.text);

  const reason = !utf8FatalOk
    ? `invalid-utf8->${alt.encoding}`
    : `many-replacements-utf8(${utf8Repl})->${alt.encoding}`;

  debug?.add?.("sanitize:patched-file", { name, reason, utf8Repl, altRepl });

  return {
    changed: true,
    bytes: outBytes,
    reason,
    beforeSummary: summarizeBytesForDebug(
      bytes,
      utf8NonFatal,
      utf8Repl,
      utf8FatalOk
    ),
    afterSummary: summarizeTextForDebug(normalized.text),
  };
}

function normalizeXmlDeclarationEncoding(text) {
  // Ret xml declaration til utf-8 (eller tilføj en hvis der ikke er)
  // Vi gør det “blidt”: kun i starten af dokumentet.
  const head = text.slice(0, 300);
  const hasDecl = /^\s*<\?xml\b/i.test(head);

  let out = text;
  let changed = false;

  if (hasDecl) {
    // udskift encoding="..." til encoding="utf-8"
    const replaced = out.replace(
      /^\s*<\?xml\b([^?>]*?)encoding\s*=\s*["'][^"']+["']([^?>]*?)\?>/i,
      (m, a, b) => {
        changed = true;
        return `<?xml${a}encoding="utf-8"${b}?>`;
      }
    );
    out = replaced;
  } else {
    // Tilføj XML decl hvis dokumentet ligner XML/XHTML/NCX/OPF
    if (/^\s*</.test(out)) {
      out = `<?xml version="1.0" encoding="utf-8"?>\n` + out;
      changed = true;
    }
  }

  return { text: out, changed };
}

function decodeWindows1252OrLatin1(uint8) {
  // Mange browsers understøtter "windows-1252". Hvis ikke, brug latin1-lignende mapping.
  try {
    const t = new TextDecoder("windows-1252", { fatal: false }).decode(uint8);
    return { text: t, encoding: "windows-1252" };
  } catch {
    // latin1-ish fallback
    let s = "";
    for (let i = 0; i < uint8.length; i++) s += String.fromCharCode(uint8[i]);
    return { text: s, encoding: "latin1" };
  }
}

function countReplacementChars(text) {
  if (!text) return 0;
  let n = 0;
  for (let i = 0; i < text.length; i++) {
    if (text.charCodeAt(i) === 0xfffd) n++;
  }
  return n;
}

function summarizeBytesForDebug(bytes, utf8NonFatal, replCount, utf8FatalOk) {
  return {
    bytes: bytes?.length ?? null,
    utf8FatalOk,
    utf8ReplacementChars: replCount,
    head: utf8NonFatal?.slice?.(0, 140),
  };
}

function summarizeTextForDebug(text) {
  return {
    chars: text?.length ?? null,
    head: text?.slice?.(0, 180),
  };
}
