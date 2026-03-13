#!/usr/bin/env node
/**
 * Fetch latest translations from remote backend and write to local Translate.json.
 * Uses NEXT_BACKEND_API_URL and NEXT_BACKEND_CACHE_KEY from env, or defaults (staging).
 *
 * Usage:
 *   node scripts/fetch-translations.js [options]
 *   npm run translations:fetch
 *
 * Options:
 *   --url <baseUrl>     Backend base URL (overrides env)
 *   --cache-key <key>   Cache key (default: alfa)
 *   --file <path>       Path to Translate.json (default: src/components/base/translate/Translate.json)
 *   --backup            Create backup before overwriting (default: true)
 *   --no-backup         Skip backup
 *   --dry-run           Only print what would be done, do not write
 *   --help, -h          Show help
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const DEFAULT_JSON = path.join(ROOT, "src/components/base/translate/Translate.json");
const DEFAULT_URL =
  process.env.NEXT_BACKEND_API_URL ||
  "http://bibdk-backend-www-master.febib-staging.svc.cloud.dbc.dk";
const DEFAULT_CACHE_KEY = process.env.NEXT_BACKEND_CACHE_KEY || "alfa";

function parseArgs(argv) {
  const options = {
    url: DEFAULT_URL,
    cacheKey: DEFAULT_CACHE_KEY,
    file: DEFAULT_JSON,
    backup: true,
    dryRun: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--no-backup") options.backup = false;
    else if (arg === "--backup") options.backup = true;
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--help" || arg === "-h") {
      console.log(`
Fetch translations from remote and save to local Translate.json.

Usage: node scripts/fetch-translations.js [options]

Options:
  --url <baseUrl>     Backend base URL (default: NEXT_BACKEND_API_URL or staging)
  --cache-key <key>   Cache key (default: NEXT_BACKEND_CACHE_KEY or "alfa")
  --file <path>       Path to Translate.json
  --backup            Create backup before overwriting (default)
  --no-backup         Do not create backup
  --dry-run           Do not write file, only fetch and print summary
  --help, -h          Show this help

Env:
  NEXT_BACKEND_API_URL    Backend base URL
  NEXT_BACKEND_CACHE_KEY  Cache key
`);
      process.exit(0);
    } else if (arg === "--url" && argv[i + 1]) {
      options.url = argv[i + 1].replace(/\/$/, "");
      i++;
    } else if (arg === "--cache-key" && argv[i + 1]) {
      options.cacheKey = argv[i + 1];
      i++;
    } else if (arg === "--file" && argv[i + 1]) {
      options.file = path.resolve(ROOT, argv[i + 1]);
      i++;
    }
  }
  return options;
}

function createBackup(filePath) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = `${filePath}.bak.${timestamp}`;
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

async function main() {
  const opts = parseArgs(process.argv);

  if (!fs.existsSync(opts.file)) {
    console.error("Translate.json not found:", opts.file);
    process.exit(1);
  }

  const localJson = JSON.parse(fs.readFileSync(opts.file, "utf8"));
  const payload = {
    translations: localJson,
    cachekey: opts.cacheKey,
  };

  const url = `${opts.url}/get_translations`;
  console.log("Fetching from:", url);
  console.log("Cache key:", opts.cacheKey);

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("Request failed:", e.message);
    process.exit(1);
  }

  if (!response.ok) {
    console.error("HTTP", response.status, response.statusText);
    process.exit(1);
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    console.error("Invalid JSON response:", e.message);
    process.exit(1);
  }

  if (!data || data.ok === false) {
    console.error("Backend returned error:", data ? JSON.stringify(data) : "empty");
    process.exit(1);
  }

  const contexts = data?.contexts;
  console.log('contexts',contexts)
  if (!contexts || typeof contexts !== "object") {
    console.error("Response missing result.contexts:", data.result ? "result present" : "no result");
    process.exit(1);
  }

  const out = { contexts };
  const outPath = path.resolve(opts.file);

  if (opts.dryRun) {
    const contextCount = Object.keys(contexts).length;
    let labelCount = 0;
    for (const ctx of Object.values(contexts)) {
      if (ctx && typeof ctx === "object") labelCount += Object.keys(ctx).length;
    }
    console.log("Dry run: would write", contextCount, "contexts,", labelCount, "labels to", outPath);
    return;
  }

  if (opts.backup) {
    const backupPath = createBackup(outPath);
    console.log("Backup:", path.relative(ROOT, backupPath));
  }

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n", "utf8");
  console.log("Written:", path.relative(ROOT, outPath));
}

main();
