#!/usr/bin/env node
/**
 * Dumps the controlled vocabularies used by AI search v3 from FBI-API facets
 * into src/lib/aiCql/vocab.json.
 *
 * Usage:
 *   node scripts/ai-vocab-refresh.mjs            # uses .env.local / .env
 *   FBI_API_ACCESS_TOKEN=... node scripts/ai-vocab-refresh.mjs
 *
 * Needs either FBI_API_ACCESS_TOKEN or CLIENT_ID + CLIENT_SECRET (+ LOGIN_PATH)
 * to obtain an anonymous token the same way the app does. The GraphQL
 * endpoint is taken from FBI_API_BIBDK21_URL / NEXT_PUBLIC_FBI_API_BIBDK21_URL,
 * derived from NEXT_PUBLIC_FBI_API_URL, or defaults to production.
 *
 * Runs one complexFacets query per facet (a few seconds each on a cold
 * cache). Re-run weekly or when the catalogue vocabulary changes.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src/lib/aiCql/vocab.json");

/** facet enum name in GraphQL → vocab key, facet limit */
const FACETS = [
  ["SPECIFICMATERIALTYPE", "specificmaterialtype", 500],
  ["GENERALMATERIALTYPE", "generalmaterialtype", 100],
  ["GENREANDFORM", "genreandform", 4000],
  ["MAINLANGUAGE", "mainlanguage", 500],
  ["SPOKENLANGUAGE", "spokenlanguage", 200],
  ["SUBTITLELANGUAGE", "subtitlelanguage", 200],
  ["FILMNATIONALITY", "filmnationality", 200],
  ["GAMEPLATFORM", "gameplatform", 100],
  ["PLAYERS", "players", 200],
  ["MOOD", "mood", 500],
  ["SETTING", "setting", 1000],
  ["NARRATIVETECHNIQUE", "narrativetechnique", 200],
  ["GENERALAUDIENCE", "generalaudience", 4000],
  ["PRIMARYTARGET", "primarytarget", 50],
  ["LIBRARYRECOMMENDATION", "libraryrecommendation", 100],
  ["INSTRUMENT", "instrument", 300],
  ["ACCESSTYPE", "accesstype", 10],
];

function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) {
      continue;
    }
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m || process.env[m[1]] !== undefined) {
        continue;
      }
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

function graphqlUrl() {
  if (process.env.FBI_API_BIBDK21_URL) {
    return process.env.FBI_API_BIBDK21_URL;
  }
  if (process.env.NEXT_PUBLIC_FBI_API_BIBDK21_URL) {
    return process.env.NEXT_PUBLIC_FBI_API_BIBDK21_URL;
  }
  if (process.env.NEXT_PUBLIC_FBI_API_URL) {
    return process.env.NEXT_PUBLIC_FBI_API_URL.replace(
      /\/SimpleSearch\//i,
      "/bibdk21/"
    );
  }
  return "https://fbi-api.dbc.dk/bibdk21/graphql";
}

async function anonymousToken() {
  if (process.env.FBI_API_ACCESS_TOKEN) {
    return process.env.FBI_API_ACCESS_TOKEN;
  }
  const {
    CLIENT_ID,
    CLIENT_SECRET,
    LOGIN_PATH = "https://login.bib.dk",
  } = process.env;
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error(
      "Set FBI_API_ACCESS_TOKEN, or CLIENT_ID and CLIENT_SECRET in .env.local"
    );
  }
  const body = new URLSearchParams({
    grant_type: "password",
    username: "@",
    password: "@",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  const res = await fetch(`${LOGIN_PATH.replace(/\/$/, "")}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    throw new Error(`Token request failed: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  if (!json.access_token) {
    throw new Error(`No access_token in response: ${JSON.stringify(json)}`);
  }
  return json.access_token;
}

async function fetchFacet(url, token, facetEnum, limit) {
  const query = `query AiVocab($cql: String!, $facets: ComplexSearchFacetsInput) {
    complexFacets(cql: $cql, facets: $facets) {
      hitcount
      facets { name values { key score } }
    }
  }`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query,
      variables: {
        cql: "workId=*",
        facets: { facetLimit: limit, facets: [facetEnum] },
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`${facetEnum}: HTTP ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(
      `${facetEnum}: ${JSON.stringify(json.errors).slice(0, 300)}`
    );
  }
  const facet = json.data?.complexFacets?.facets?.[0];
  return (facet?.values || [])
    .filter((v) => v?.key)
    .map((v) => [v.key, v.score ?? null]);
}

async function main() {
  loadEnv();
  const url = graphqlUrl();
  console.log(`FBI-API: ${url}`);
  const token = await anonymousToken();

  const existing = fs.existsSync(OUT)
    ? JSON.parse(fs.readFileSync(OUT, "utf8"))
    : { facets: {} };
  const facets = {};
  let failures = 0;

  for (const [facetEnum, key, limit] of FACETS) {
    const started = Date.now();
    try {
      const values = await fetchFacet(url, token, facetEnum, limit);
      facets[key] = values;
      console.log(
        `  ${key.padEnd(24)} ${String(values.length).padStart(5)} values  ${
          Date.now() - started
        } ms`
      );
    } catch (err) {
      failures++;
      console.error(`  ${key.padEnd(24)} FAILED: ${err.message}`);
      if (existing.facets?.[key]) {
        facets[key] = existing.facets[key];
        console.error(`  ${"".padEnd(24)} kept previous values`);
      }
    }
  }

  // phrase.language spans main/spoken/subtitle languages
  if (!facets.language) {
    const merged = new Map();
    for (const key of ["mainlanguage", "spokenlanguage", "subtitlelanguage"]) {
      for (const [k, score] of facets[key] || []) {
        merged.set(k, (merged.get(k) || 0) + (score || 0));
      }
    }
    facets.language = [...merged.entries()].sort((a, b) => b[1] - a[1]);
  }

  const out = {
    source: failures === FACETS.length ? existing.source || "seed" : "facets",
    generatedAt: new Date().toISOString(),
    endpoint: url,
    note: 'Generated by scripts/ai-vocab-refresh.mjs from complexFacets(cql: "workId=*"). Values are [key, works].',
    facets,
  };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
  console.log(
    `\nWrote ${path.relative(ROOT, OUT)} (${
      Object.keys(facets).length
    } vocabularies, ${failures} failures)`
  );
  if (failures) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
