#!/usr/bin/env node
/**
 * Find unused translation keys in Translate.json
 *
 * Scans the codebase for Translate({ context: "x", label: "y" }),
 * translate(), hasTranslation(), and object literals with context/label.
 * Reports keys that exist in Translate.json but are never referenced.
 *
 * Usage: node scripts/find-unused-translations.js [--dry-run] [--remove]
 *   --dry-run  (default) Only print unused keys
 *   --remove   Write back Translate.json with unused keys removed (creates backup)
 */

const fs = require("fs");
const path = require("path");

const TRANSLATE_JSON = path.join(
  __dirname,
  "../src/components/base/translate/Translate.json"
);
const SRC_DIR = path.join(__dirname, "../src");

// Regex to find static context/label pairs (double or single quotes)
// Matches: context: "foo", label: "bar" OR label: "bar", context: "foo"
const CONTEXT_LABEL_RE = /(?:context|label)\s*:\s*["']([^"']+)["']\s*,\s*(?:context|label)\s*:\s*["']([^"']+)["']/g;

// JSX: <Translate context="x" label="y" /> or label then context
const JSX_CONTEXT_LABEL_RE = /(?:context|label)\s*=\s*["']([^"']+)["'][^>]*(?:context|label)\s*=\s*["']([^"']+)["']/g;

// Same but for multiline / spread - match context and label on same or adjacent lines
// We use a simpler approach: find all context: "x" and label: "y" where y is not a variable (no + or `)
function extractUsedKeysFromContent(content, filePath) {
  const used = new Set(); // "context|label"

  // Match context: "x", label: "y" or label: "y", context: "x" on same line
  let m;
  CONTEXT_LABEL_RE.lastIndex = 0;
  while ((m = CONTEXT_LABEL_RE.exec(content)) !== null) {
    const first = m[1];
    const second = m[2];
    const [context, label] =
      m[0].trimStart().startsWith("context") ? [first, second] : [second, first];
    // Skip if label looks dynamic (contains template or concat - we only see static strings in regex)
    used.add(`${context}|${label}`);
  }

  // Match Translate({ context: "x", label: "y" }) - single line
  const translateCallRe =
    /(?:Translate|translate|hasTranslation)\s*\(\s*\{[^}]*context\s*:\s*["']([^"']+)["'][^}]*label\s*:\s*["']([^"']+)["']/g;
  while ((m = translateCallRe.exec(content)) !== null) {
    used.add(`${m[1]}|${m[2]}`);
  }

  const translateCallRe2 =
    /(?:Translate|translate|hasTranslation)\s*\(\s*\{[^}]*label\s*:\s*["']([^"']+)["'][^}]*context\s*:\s*["']([^"']+)["']/g;
  while ((m = translateCallRe2.exec(content)) !== null) {
    used.add(`${m[2]}|${m[1]}`);
  }

  // JSX: <Translate context="x" label="y" />
  JSX_CONTEXT_LABEL_RE.lastIndex = 0;
  while ((m = JSX_CONTEXT_LABEL_RE.exec(content)) !== null) {
    const first = m[1];
    const second = m[2];
    const [context, label] =
      m[0].trimStart().startsWith("context") ? [first, second] : [second, first];
    used.add(`${context}|${label}`);
  }

  // Multiline: find Translate( { ... } ) blocks and extract context/label from each block
  const blockStartRe = /(?:Translate|translate|hasTranslation)\s*\(\s*\{/g;
  while ((m = blockStartRe.exec(content)) !== null) {
    const start = m.index + m[0].length;
    let depth = 1;
    let pos = start;
    while (pos < content.length && depth > 0) {
      const c = content[pos];
      if (c === "{") depth++;
      else if (c === "}") depth--;
      pos++;
    }
    const block = content.slice(start, pos - 1);

    // Same-line or adjacent context/label (existing)
    CONTEXT_LABEL_RE.lastIndex = 0;
    while ((m = CONTEXT_LABEL_RE.exec(block)) !== null) {
      const first = m[1];
      const second = m[2];
      const [context, label] =
        m[0].trimStart().startsWith("context") ? [first, second] : [second, first];
      used.add(`${context}|${label}`);
    }

    // Static context in this block: context: "x"
    const staticContextRe = /context\s*:\s*["']([^"']+)["']/;
    const staticContextMatch = block.match(staticContextRe);
    const blockContext = staticContextMatch ? staticContextMatch[1] : null;

    // Context from spread: ...context – resolve from same file (e.g. const context = { context: "form" })
    let spreadContext = null;
    if (block.includes("...context") || block.includes("... context")) {
      const fileContextRe = /(?:const|let|var)\s+context\s*=\s*\{\s*context\s*:\s*["']([^"']+)["']/;
      const fileMatch = content.match(fileContextRe);
      if (fileMatch) spreadContext = fileMatch[1];
    }

    const contextForBlock = blockContext || spreadContext;

    // Label from ternary: label: expr ? "literal1" : "literal2" (allows newlines)
    const ternaryLabelRe = /label\s*:\s*[\s\S]*?\?\s*["']([^"']+)["']\s*:\s*["']([^"']+)["']/g;
    let ternaryMatch;
    while ((ternaryMatch = ternaryLabelRe.exec(block)) !== null) {
      const label1 = ternaryMatch[1];
      const label2 = ternaryMatch[2];
      if (contextForBlock) {
        used.add(`${contextForBlock}|${label1}`);
        used.add(`${contextForBlock}|${label2}`);
      }
    }
  }

  return used;
}

function getAllSourceFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== "node_modules" && e.name !== ".next" && e.name !== "dist")
        getAllSourceFiles(full, files);
    } else if (/\.(js|jsx|ts|tsx)$/.test(e.name) && !e.name.includes("Translate.json")) {
      files.push(full);
    }
  }
  return files;
}

function loadTranslateJson() {
  const raw = fs.readFileSync(TRANSLATE_JSON, "utf8");
  return JSON.parse(raw);
}

function getAllKeysFromTranslate(translations) {
  const keys = new Set();
  const contexts = translations.contexts || {};
  for (const [context, labels] of Object.entries(contexts)) {
    if (labels && typeof labels === "object" && !Array.isArray(labels)) {
      for (const label of Object.keys(labels)) {
        // Only consider leaf keys that have da/en (translation objects)
        const val = labels[label];
        if (val && typeof val === "object" && (val.da !== undefined || val.en !== undefined)) {
          keys.add(`${context}|${label}`);
        }
      }
    }
  }
  return keys;
}

function main() {
  const args = process.argv.slice(2);
  const remove = args.includes("--remove");
  const dryRun = !remove || args.includes("--dry-run");

  console.log("Loading Translate.json...");
  const translations = loadTranslateJson();
  const allKeys = getAllKeysFromTranslate(translations);
  console.log(`Total keys in Translate.json: ${allKeys.size}`);

  console.log("Scanning source files for usages...");
  const usedKeys = new Set();
  const files = getAllSourceFiles(SRC_DIR);
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const used = extractUsedKeysFromContent(content, file);
    used.forEach((k) => usedKeys.add(k));
  }

  // Extra check: if the label name appears as a quoted string anywhere in source, consider that context/label used
  const fileContents = files.map((f) => fs.readFileSync(f, "utf8"));
  let labelNameMatchCount = 0;
  for (const key of allKeys) {
    if (usedKeys.has(key)) continue;
    const [, label] = key.split("|");
    const doubleQuoted = `"${label}"`;
    const singleQuoted = `'${label}'`;
    const found = fileContents.some(
      (content) => content.includes(doubleQuoted) || content.includes(singleQuoted)
    );
    if (found) {
      usedKeys.add(key);
      labelNameMatchCount++;
    }
  }
  if (labelNameMatchCount > 0) {
    console.log(`(Label-name check: ${labelNameMatchCount} additional key(s) considered used.)`);
  }

  // Contexts that use dynamic labels (e.g. "label-" + filter, or label from variable) – we report them as unused but won't remove on --remove
  const dynamicLabelContexts = new Set(["facets", "profile", "helpmenu", "details"]);

  const unused = [...allKeys].filter((k) => !usedKeys.has(k)).sort();
  const unusedByContext = {};
  const unusedSafeToRemove = [];
  const unusedDynamicContext = [];
  for (const k of unused) {
    const [ctx, label] = k.split("|");
    if (!unusedByContext[ctx]) unusedByContext[ctx] = [];
    unusedByContext[ctx].push(label);
    if (dynamicLabelContexts.has(ctx)) {
      unusedDynamicContext.push(k);
    } else {
      unusedSafeToRemove.push(k);
    }
  }

  console.log(`\nUsed keys (from code): ${usedKeys.size}`);
  console.log(`Unused keys: ${unused.length}\n`);

  if (unused.length === 0) {
    console.log("No unused translations found.");
    console.log(`Total unused labels found in the project: 0`);
    return;
  }

  console.log("Unused translations by context:");
  console.log("-------------------------------");
  for (const [ctx, labels] of Object.entries(unusedByContext).sort()) {
    console.log(`\n${ctx}:`);
    labels.forEach((l) => console.log(`  - ${l}`));
  }

  if (unusedDynamicContext.length > 0) {
    console.log(
      `\nNote: ${unusedDynamicContext.length} unused key(s) are in contexts with dynamic labels (facets, profile, helpmenu, details). They are listed above but will NOT be removed with --remove to avoid breaking runtime.`
    );
  }

  if (remove && !dryRun) {
    const toRemove = unusedSafeToRemove;
    if (toRemove.length === 0) {
      console.log("\nNo keys safe to remove (all unused are in dynamic contexts).");
      console.log(`Total unused labels found in the project: ${unused.length}`);
      return;
    }
    const backupPath = TRANSLATE_JSON + ".backup." + Date.now();
    fs.copyFileSync(TRANSLATE_JSON, backupPath);
    console.log(`\nBackup written to ${path.basename(backupPath)}`);

    const contexts = translations.contexts || {};
    for (const k of toRemove) {
      const [ctx, label] = k.split("|");
      if (contexts[ctx] && contexts[ctx][label]) {
        delete contexts[ctx][label];
      }
      if (contexts[ctx] && Object.keys(contexts[ctx]).length === 0) {
        delete contexts[ctx];
      }
    }
    fs.writeFileSync(
      TRANSLATE_JSON,
      JSON.stringify(translations, null, 2) + "\n",
      "utf8"
    );
    console.log(`Removed ${toRemove.length} unused key(s) from Translate.json.`);
  } else if (remove && dryRun) {
    console.log("\nRun with --remove (without --dry-run) to remove safe keys from Translate.json.");
  }

  console.log(`Total unused labels found in the project: ${unused.length}`);
}

main();
