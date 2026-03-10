#!/usr/bin/env node
/**
 * Find unused translation keys in Translate.json (v2)
 *
 * Loads all (context, label) keys from Translate.json, then for each label
 * searches the project for that label string (as "label" or 'label').
 * Excludes Translate.json from the search. Reports keys that are never found.
 *
 * Usage: node scripts/find-unused-translation_v2.js [--dry-run] [--remove]
 *   --dry-run  (default) Only print unused keys
 *   --remove   Write back Translate.json with unused keys removed (creates backup)
 */

const fs = require("fs");
const path = require("path");

const TRANSLATE_JSON = path.join(
  __dirname,
  "../src/components/base/translate/Translate.json"
);
// Use same scope as find-unused-translations.js: src/ only, .js|.jsx|.ts|.tsx only
const SRC_DIR = path.join(__dirname, "../src");

function getAllSearchableFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);

    if (e.isDirectory()) {
      if (
        e.name !== "node_modules" &&
        e.name !== ".next" &&
        e.name !== "dist"
      ) {
        getAllSearchableFiles(full, files);
      }
    } else if (
      /\.(js|jsx|ts|tsx)$/.test(e.name) &&
      !e.name.includes("Translate.json")
    ) {
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
  const keys = [];
  const contexts = translations.contexts || {};
  for (const [context, labels] of Object.entries(contexts)) {
    if (labels && typeof labels === "object" && !Array.isArray(labels)) {
      for (const label of Object.keys(labels)) {
        const val = labels[label];
        if (
          val &&
          typeof val === "object" &&
          (val.da !== undefined || val.en !== undefined)
        ) {
          keys.push({ context, label, key: `${context}|${label}` });
        }
      }
    }
  }
  return keys;
}

function isLabelFoundInContent(content, label) {
  const doubleQuoted = `"${label}"`;
  const singleQuoted = `'${label}'`;
  return content.includes(doubleQuoted) || content.includes(singleQuoted);
}

function main() {
  const args = process.argv.slice(2);
  const remove = args.includes("--remove");
  const dryRun = !remove || args.includes("--dry-run");

  console.log("Loading Translate.json...");
  const translations = loadTranslateJson();
  const allKeys = getAllKeysFromTranslate(translations);
  console.log(`Total keys in Translate.json: ${allKeys.length}`);

  console.log("Collecting files to search (excluding Translate.json)...");
  const files = getAllSearchableFiles(SRC_DIR);
  console.log(`Searching ${files.length} files for each label...\n`);

  // Read all file contents once
  const fileContents = new Map();
  for (const file of files) {
    try {
      fileContents.set(file, fs.readFileSync(file, "utf8"));
    } catch (err) {
      console.warn(`Warning: could not read ${file}: ${err.message}`);
    }
  }

  const usedKeys = new Set();
  const unusedKeys = [];

  for (const { context, label, key } of allKeys) {
    let found = false;
    for (const [, content] of fileContents) {
      if (isLabelFoundInContent(content, label)) {
        found = true;
        break;
      }
    }
    if (found) {
      usedKeys.add(key);
    } else {
      unusedKeys.push({ context, label, key });
    }
  }

  // Sort unused by context then label
  unusedKeys.sort((a, b) => {
    if (a.context !== b.context) return a.context.localeCompare(b.context);
    return a.label.localeCompare(b.label);
  });

  console.log(`Used keys (label found in project): ${usedKeys.size}`);
  console.log(`Unused keys (label never found): ${unusedKeys.length}\n`);

  if (unusedKeys.length === 0) {
    console.log("No unused translations found.");
    console.log(`Total unused labels found in the project: 0`);
    return;
  }

  console.log("Unused translations by context:");
  console.log("-------------------------------");
  let currentContext = null;
  for (const { context, label } of unusedKeys) {
    if (context !== currentContext) {
      currentContext = context;
      console.log(`\n${context}:`);
    }
    console.log(`  - ${label}`);
  }

  if (remove && !dryRun) {
    const backupPath = TRANSLATE_JSON + ".backup." + Date.now();
    fs.copyFileSync(TRANSLATE_JSON, backupPath);
    console.log(`\nBackup written to ${path.basename(backupPath)}`);

    const contexts = translations.contexts || {};
    for (const { context, label } of unusedKeys) {
      if (contexts[context] && contexts[context][label]) {
        delete contexts[context][label];
      }
      if (contexts[context] && Object.keys(contexts[context]).length === 0) {
        delete contexts[context];
      }
    }
    fs.writeFileSync(
      TRANSLATE_JSON,
      JSON.stringify(translations, null, 2) + "\n",
      "utf8"
    );
    console.log(
      `Removed ${unusedKeys.length} unused key(s) from Translate.json.`
    );
  } else if (remove && dryRun) {
    console.log(
      "\nRun with --remove (without --dry-run) to remove unused keys from Translate.json."
    );
  }

  console.log(`Total unused labels found in the project: ${unusedKeys.length}`);
}

main();
