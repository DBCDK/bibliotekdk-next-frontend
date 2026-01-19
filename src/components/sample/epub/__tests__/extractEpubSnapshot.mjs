// src/components/sample/epub/__tests__/extractEpubSnapshot.mjs
// Usage:
//   node src/components/sample/epub/__tests__/extractEpubSnapshot.mjs
//   node src/components/sample/epub/__tests__/extractEpubSnapshot.mjs --debug
//
// It scans fixtures/epubs/*.zip and writes fixtures/snapshots/<isbn>.json

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildEpubLogicSnapshot } from "./epubLogicSnapshot.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function argHas(flag) {
  return process.argv.includes(flag);
}

function baseNameNoExt(file) {
  return path.basename(file).replace(/\.(zip|epub)$/i, "");
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function listZipFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((n) => /\.zip$/i.test(n))
    .sort()
    .map((n) => path.join(dir, n));
}

async function writeJson(filePath, obj) {
  const json = JSON.stringify(obj, null, 2) + "\n";
  await fs.writeFile(filePath, json, "utf8");
}

async function main() {
  const debug = argHas("--debug");

  const epubsDir = path.join(__dirname, "fixtures", "epubs");
  const snapDir = path.join(__dirname, "fixtures", "snapshots");

  await ensureDir(snapDir);

  const zipFiles = await listZipFiles(epubsDir);

  console.log(`Found ${zipFiles.length} EPUB(s).`);
  console.log(`EPUB dir: ${epubsDir}`);
  console.log(`Snap dir: ${snapDir}`);
  console.log("");

  let ok = 0;
  let fail = 0;
  const failures = [];

  for (const filePath of zipFiles) {
    const id = baseNameNoExt(filePath);
    console.log(`\u2192 ${id}`);

    try {
      const bytes = await fs.readFile(filePath);

      const snap = await buildEpubLogicSnapshot(bytes, {
        fileName: path.basename(filePath),
        debug,
      });

      const outFile = path.join(snapDir, `${id}.json`);
      await writeJson(outFile, snap);

      const c = snap?.counts || {};
      console.log(
        `  ✓ snapshot: fixtures/snapshots/${id}.json (spine=${c.spineLen}, toc=${c.tocLen}, dupSpine=${c.duplicateSpineIndexCount})`
      );

      const struct = snap?.heuristics?.structure;
      if (struct) {
        const reasons = Array.isArray(struct.reasons)
          ? struct.reasons.join(",")
          : "";
        console.log(
          `  [STRUCT] mode=${struct.mode} score=${struct.score} reasons=${reasons}`
        );
      }

      if (typeof snap?.heuristics?.collapse === "boolean") {
        console.log(`  [COLLAPSE] ${snap.heuristics.collapse ? "yes" : "no"}`);
      }

      console.log("");
      ok++;
    } catch (e) {
      const msg = String(e?.message || e);
      console.log(`  ✗ FAILED ${id}`);
      console.log(`    ${msg}`);
      if (debug && e?.stack) {
        console.log("");
        console.log(String(e.stack));
      }
      console.log("");

      fail++;
      failures.push({ id, message: msg });
    }
  }

  console.log("Done.");
  console.log(`Success: ${ok}`);
  console.log(`Failed : ${fail}`);

  if (failures.length) {
    console.log("");
    console.log("Failures:");
    for (const f of failures) {
      console.log(`- ${f.id}: ${f.message}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
