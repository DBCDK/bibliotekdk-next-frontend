# AI search v2 — proposal for a tool-using, self-validating CQL agent

Status: proposal only, nothing implemented. The current route `src/pages/api/ai/cql.js`
stays untouched; v2 lives next to it as `POST /api/ai/v2/cql`.

Revision 3 (2026-09-10): **tool-calling agent on OpenRouter.** The model gets a short system
prompt and a handful of tools (look up values for a field, find a person/subject/title,
test candidate queries), does the small lookups itself, and then submits the final CQL.
The server verifies every submission. This replaces revision 2's "one big JSON plan"
design and the v1 "one big prompt" design, and replaces glyph-gate with OpenRouter.

Everything marked **[verified]** was measured against the live FBI-API (`bibdk21`). The
OpenRouter API details in section 3 follow its documented OpenAI-compatible contract but
could not be smoke-tested from this sandbox (host blocked); see section 8.

---

## 1. What I inspected and what it tells us

### 1a. The current agent (v1)

- One stateless chat completion against glyph-gate (`skolegpt`, `temperature: 0`,
  `reasoning_effort: "low"`), ~150 lines of system prompt, output is trusted as-is.
- **No validation anywhere.** Wrong index name, wrong controlled value, a misspelled author
  or a too-narrow `phrase.*` all produce 0 hits and the user sees "ingen resultater".
- The v1 prompt teaches several things the live API contradicts **[verified]**:

| v1 prompt says | Live API | Consequence |
| --- | --- | --- |
| `term.setting="paris"` for "foregår i Paris" | `setting` is a *type of milieu* vocabulary: `realistisk, storbyen, provinsen, naturen, hospitaler, politiet…` (459 values). `phrase.setting="københavn"` and `term.setting="paris"` give **0** hits. `term.subject="københavn" AND term.genreandform="krimi"` gives 688. | Place names must go to `subject` (or freetext), never `setting` |
| `firstaccessiondate >= NOW - 30 DAYS` for "nyindkøbte" | `firstaccessiondate is not allowed as index` — it is a **holdings filter**, not a search index in this profile | Every "new arrivals" query is a parse error today |
| `term.genreandform="roman"`, `"biografi*"`, `"tegneserie"` | `term.*` does **not** stem: `roman` 5 hits, `romaner` 222 955; `biografi` 0, `biografier` 21 239; `tegneserie` 1, `tegneserier` 26 940 | Singular/plural guesses silently lose ~100 % recall |
| `term.specificmaterialtype="lydbog*"`, `"dvd"` | `lydbog` alone already matches all `lydbog (…)` variants (143 680). `dvd` matches 74 487 but the controlled values are `film (dvd)`, `musik (dvd)` | Works by accident; resolver should use the controlled keys |
| `AND NOT` is not mentioned but a model will emit it | `Illegal operator` — only bare `NOT` is legal | Needs composer control, not prompt hope |
| Language values as Danish words | Correct, but `term.mainlanguage="english"` = 0. `term.originallanguage` wants ISO codes (`en`/`eng`) | Needs an English→Danish language alias table in code |

### 1b. Live API findings **[verified 2026-09-10]**

Vocabulary and indexes

- `complexSearchIndexes` returns **184** indexes (43 plain, 43 `term.*`, 44 `phrase.*`,
  44 `facet.*`, 10 `sort.*`) plus aliases (`op`, `gf`, `lhs`…). The repo's
  `src/components/utils/cql/fields.json` is missing 90+ of them (all `facet.*`/`sort.*`,
  `phrase.title`, `term.maintitle`, `term.originallanguage`, `term.issn`, `term.function`…).
  The validator must use the live list, not `fields.json`.
- `errorMessage` is precise and actionable: it names the bad index, lists every allowed
  index, and marks the position (`… at: --->term.foo="x"`, `Expected ) at: …`).
- `phrase.*` is **case-insensitive**: `krimi` / `Krimi` / `KRIMI` → identical 18 802 hits.
  The resolver can normalise keys freely.
- `term.*` is tokenised and always ≥ `phrase.*` on recall. Examples: creator
  `term` 192 vs `phrase` 177 (Adler-Olsen); 10 077 vs 6 565 (H.C. Andersen); subject
  `term.subject="anden verdenskrig"` 1 499 vs `phrase` 489. Records are catalogued under
  variants like `Jussi Adler-Olsen (1950-)`, which `phrase` misses.
- Subject wording matters enormously: `term.subject="2. verdenskrig"` = **18 257**,
  `"anden verdenskrig"` = 1 499, `"verdenskrig"` = 23 899. A model that "normalises" to
  the formal form loses 90 % of the hits. Value groups fix it cheaply:
  `term.subject=("2. verdenskrig" OR "anden verdenskrig")` = 19 512.
- English uncontrolled subjects exist: `term.subject="cold war"` = 2 034. OR-ing the user's
  original wording with the Danish translation is a legitimate recall boost.
- `term.function="oversætter rane knudsen"` = 48 vs `phrase.contributorfunction="Rane
  Knudsen (oversætter)"` = 8. The tokenised `function` index is the better role+name tool;
  no exact "(rolle)" formatting needed.
- Title: `term.title="profeterne fra evighedsfjorden"` = 0 (real title says "i"), but
  `term.title="profeterne evighedsfjorden"` (stopwords removed) = 31, and
  `TITLE` suggest on `profeterne` or `evighedsfjorden` returns the right title. Whole-phrase
  title suggest on a typo returns nothing.
- `worktype=movie` lowercase works; `worktype=bog` = 0 (must be the enum: literature,
  article, movie, music, game, sheetmusic, …).
- `phrase.language` spans main + spoken + subtitle language — a good default for
  "på engelsk" when material type is unknown.
- `ages=5` ≡ `phrase.ages="for 5 år"`; `pegi <= 7`, `mediacouncilagerestriction < 11`,
  `lix < 20`, `workyear=NOW`, `workyear > NOW - 12 MONTHS`, `datefirstedition > 2020`,
  `publicationyear within "1990 1999"` all work. `NOT` works, `AND NOT` does not.

Facets (closed vocabularies)

- `complexFacets(cql: "workId=*")` with **23 closed facets at `facetLimit: 500`**: one call,
  12.7 s, 100 KB. Fine as a background prefetch, never in the request path.
- `facetLimit` is not capped at 500 on either query. Sizes: specificmaterialtype 183,
  generalmaterialtype 15, mainlanguage 407, filmnationality 98, setting 459, mood 113,
  gameplatform 28, players 100, narrativetechnique 42, instrument 98, spokenlanguage 47,
  subtitlelanguage 85, accesstype 3, primarytarget 6, hostpublicationtype 3.
  **genreandform and generalaudience exceed 3 000** globally (tail score 3 and 2). Per
  worktype: literature 2 695 (5 s), movie 741 (0.5 s), music 2 864 (0.8 s), game 130 (0.2 s).
- Facets on a *narrow* query are free: `phrase.creator="Kim Leine"` + 3 facets = 157 ms.

Suggester (open vocabularies)

- 80–500 ms per call, typically ~150 ms.
- Typo- and order-tolerant: `jusi adler` → Jussi Adler-Olsen; `kim lejne` → Kim Leine;
  `murakmi` → Haruki Murakami; `adler olsen jussi` → Jussi Adler-Olsen; `jk rowling` →
  J.K. Rowling. Returns the canonical name first, then dated/variant forms.
- SUBJECT suggest returns capitalisation variants and compound headings; the first hit is
  usually usable but the *dominant* wording (`2. verdenskrig`) may not be first.
- Abbreviations are **not** expanded by the suggester: `kbh` → junk, `ai` → `aids`,
  `ww2` → literal `WW2`. Abbreviation expansion stays a model/code responsibility.
- `DEFAULT` type is a subject-ish typeahead, not a general resolver (`krimi københavn` →
  one odd heading). Do not use it to resolve freetext.

Latency

- Narrow/combined queries: **110–300 ms** for hitcount, also on first hit.
- Broad single-filter queries on a **cold cache**: 3–5 s (`term.specificmaterialtype="bog"`,
  `worktype=literature`, `term.accesstype="online"`); the same query repeated: 130–200 ms.
  This is the p95 risk for any verify step.
- **GraphQL aliases batch for free**: 5 `complexSearch` hitcounts in one request = 158 ms
  (vs ~130 ms each sequentially). 3 suggests + 3 candidate hitcounts + facets in one request
  = 241 ms. This is the single most important speed lever in the design below.

---

## 2. Goals and non-goals

Goals

- **Small prompt, small tasks.** The system prompt states the job, the rules of CQL, and the
  field list. No value lists, no long example catalogue. The model discovers values by
  calling tools, exactly like a librarian would look things up.
- The returned CQL **always parses** and **normally has hits**. Controlled values are real
  values from FBI-API because they came out of a tool, not out of the model's memory.
- **Fast.** Target p50 ≤ 3 s, p95 ≤ 5 s, hard cap 8 s with a graceful best-effort answer.
  The loop is bounded (max 4 model turns), tool calls in one turn run in parallel, and
  every FBI-API tool call is batched into one HTTP request.
- Same contract to the frontend as v1 (`{ cql }`), extended with metadata for the
  conversational output panel.

Non-goals (this iteration)

- Multi-turn refinement with the user.
- Holdings filters ("på min bibliotek"). `firstaccessiondate` is filter-only, so
  "nyindkøbte" cannot be expressed in CQL; the agent maps it to `workyear` and says so.

---

## 3. The agent

### 3.1 Shape

```
POST /api/ai/v2/cql  { prompt }
   │
   ▼
system prompt (~60 lines) + user prompt
   │
   ▼            ┌──────────────────────────────────────────────────────────┐
model turn 1 ──▶│ tool calls (parallel): find_values / find_entity / …     │
   ▲            │ server runs them: cache hits = 0 ms, FBI calls batched   │
   │            └──────────────────────────────────────────────────────────┘
   │  tool results
model turn 2 ──▶ test_queries([c1, c2])   → one batched FBI request
   │  hitcounts, errorMessages, sample titles, facets
model turn 3 ──▶ submit_query({ cql, explanation })
   │
   ▼
server: local parse check → hitcount (unless the exact cql was just tested)
   ├─ hits > 0  → respond
   ├─ 0 hits & turns left → feed back as tool result, model gets one more turn
   └─ 0 hits & no turns left → deterministic relaxation, respond with relaxed:true
```

Loop budget: **max 4 model turns**, max 12 tool calls total, whole request 8 s. When the
budget runs out the server takes the best *tested* candidate with hits, else relaxes the
last submission itself (section 3.6). The user never gets an error because the model was
indecisive.

### 3.2 Tools (five)

Few, orthogonal, cheap. Names and argument shapes are the model's whole vocabulary of
actions, so they are chosen to map 1:1 onto what FBI-API can actually answer.

**1. `find_values` — closed vocabularies, served from memory (0 ms)**

```json
{
  "name": "find_values",
  "description": "Look up the legal values of a controlled field (material type, genre, language, film nationality, game platform, mood, setting/milieu, audience, players, instrument…). Returns real values with work counts. Always use this before writing a value for one of these fields; never guess plural/singular or spelling.",
  "parameters": {
    "type": "object",
    "properties": {
      "field": { "type": "string", "enum": ["specificmaterialtype","generalmaterialtype","genreandform","mainlanguage","spokenlanguage","subtitlelanguage","filmnationality","gameplatform","players","pegi","generalaudience","primarytarget","ages","mood","setting","narrativetechnique","instrument","choirtype","chambermusictype","accesstype","hostpublicationtype","source","libraryrecommendation","mediacouncilagerestriction"] },
      "query": { "type": "string", "description": "What the user said, e.g. 'lydbog', 'krimi', 'english', 'spooky'" },
      "worktype": { "type": "string", "enum": ["literature","article","movie","music","game","sheetmusic"], "description": "Optional; narrows genre/audience lists to that worktype" }
    },
    "required": ["field","query"]
  }
}
```

Returns `{ field, matches: [{ value, works }], hint }` — exact, prefix and fuzzy matches
from the prefetched facet cache (section 5), max 15, plus a `hint` such as
`"use phrase.specificmaterialtype=\"lydbog*\" to cover all 3 lydbog variants"`. A small
alias table is applied first (`english→engelsk`, `sci-fi→science fiction`,
`bog→bøger` for general type) so the model does not have to translate.

**2. `find_entity` — open vocabularies via `complexSuggest` (~150 ms, batched)**

```json
{
  "name": "find_entity",
  "description": "Find the catalogued form of a person, subject, title, series, fictional character, publisher or host publication. Tolerates typos and word order. Use it for every name or topic the user mentions, then search with the returned canonical form.",
  "parameters": {
    "type": "object",
    "properties": {
      "type": { "type": "string", "enum": ["creator","creatorcontributor","subject","title","series","fictionalcharacter","publisher","hostpublication","creatorcontributorfunction"] },
      "query": { "type": "string" }
    },
    "required": ["type","query"]
  }
}
```

Returns `{ type, candidates: [{ term, works? }] }`. For `subject` the server also runs
hitcounts for the top 3 distinct terms in the same batched request so the model sees
`2. verdenskrig (18 257)` next to `anden verdenskrig (1 499)` and can OR them. For
`title` the server strips stopwords and suggests on the rarest token, returning candidate
titles with a similarity score (fixes "profeterne *fra* evighedsfjorden").

**3. `test_queries` — run up to 4 candidate CQL strings (one batched FBI request)**

```json
{
  "name": "test_queries",
  "description": "Run candidate CQL queries and get hitcount, parse errors, three sample titles and (optionally) facet values for a field. Use it to compare alternatives before submitting. Cheap; test several at once.",
  "parameters": {
    "type": "object",
    "properties": {
      "queries": { "type": "array", "maxItems": 4, "items": { "type": "string" } },
      "facets": { "type": "array", "maxItems": 3, "items": { "type": "string" }, "description": "Optional facet fields to return for the first query, e.g. [\"specificmaterialtype\"]" }
    },
    "required": ["queries"]
  }
}
```

Each query is first run through the local tokenizer/validator with the live index list;
invalid ones come back with the local error message without touching FBI-API. Valid ones
go into one GraphQL request using aliases (5 hitcounts = 158 ms **[verified]**). Returns
`[{ cql, hitcount, errorMessage, sample: ["title", …], facets? }]`.

**4. `describe_field` — on-demand documentation (0 ms)**

```json
{
  "name": "describe_field",
  "description": "Get the one-paragraph documentation, allowed operators and examples for a CQL index, e.g. 'term.function' or 'workyear'. Use it when unsure how a field behaves.",
  "parameters": { "type": "object", "properties": { "field": { "type": "string" } }, "required": ["field"] }
}
```

Served from the indexmapper text (scraped once at boot, cached 24 h; the page is 120 KB
HTML and has name, aliases, description, format, examples per index **[verified]**). This
is what lets the system prompt stay short: the reference is pulled in only when needed.

**5. `submit_query` — the terminal action**

```json
{
  "name": "submit_query",
  "description": "Submit the final CQL. Call this exactly once when you are satisfied. The server will verify it.",
  "parameters": {
    "type": "object",
    "properties": {
      "cql": { "type": "string" },
      "explanation": { "type": "string", "description": "One short Danish sentence for the user: what you interpreted and any assumption, e.g. 'Jeg søger efter forfatteren Jussi Adler-Olsen og emnet 2. verdenskrig.'" },
      "interpretations": { "type": "array", "items": { "type": "object", "properties": { "input": {"type":"string"}, "field": {"type":"string"}, "value": {"type":"string"} } } }
    },
    "required": ["cql","explanation"]
  }
}
```

Using a tool for the final answer (instead of free text) gives a typed result, lets
`tool_choice: "required"` force progress, and lets the server treat "no submit within
budget" as a well-defined failure.

### 3.3 The system prompt (kept short)

Roughly 60 lines, no example catalogue:

1. **Job**: translate the request into one CQL query for FBI-API; use tools to look up
   every value and name; submit with `submit_query`.
2. **Workflow**: identify the pieces (who, what, material, audience, language, time); call
   `find_entity`/`find_values` for all of them *in the same turn*; build 1–3 candidates and
   `test_queries` them; submit the best. Prefer more hits with correct meaning over zero.
3. **CQL rules** (10 lines): `AND`/`OR`/`NOT` (never `AND NOT`), quotes, `( … )` groups,
   value groups `field=("a" OR "b")`, range operators only on the numeric/date fields,
   `NOW - 12 MONTHS`, trailing `*`; `term.*` = tokenised (use for people, subjects,
   titles), `phrase.*` = exact controlled value (use for values from `find_values`).
4. **Field list** (25 lines, names + 3–6 words each, grouped): people/roles, topic/place
   (`term.subject`, not `setting`), title/series/character, material types, genre, language,
   audience/age, time (`publicationyear`, `workyear`, `datefirstedition` — acquisition date
   is not searchable), worktype enum, misc (`term.isbn`, `term.publisher`,
   `term.hostpublication`, `term.function` for "rolle navn").
5. **Language rule**: controlled values and subjects are Danish; keep names as written;
   when the user wrote another language, OR the original with the translation.
6. **Two examples**, tool flow only, not CQL lore.

This replaces v1's 150-line prompt. Everything factual and volatile (values, exact index
semantics) lives behind tools, so the prompt does not go stale.

### 3.4 The LLM client (OpenRouter)

OpenRouter exposes the OpenAI chat-completions contract at
`POST https://openrouter.ai/api/v1/chat/completions` with `Authorization: Bearer <key>`,
optional `HTTP-Referer` and `X-Title` headers for app attribution, and supports `tools`,
`tool_choice`, `parallel_tool_calls`, `response_format` and per-request model fallbacks
(`models: [...]`). [To smoke-test — host blocked from sandbox.]

Configuration (`.env.local`, never committed):

| Variable | Default | Purpose |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | – | Required. Route answers 500 without it |
| `OPENROUTER_BASE_URL` | `https://openrouter.ai/api/v1` | Lets us point at any OpenAI-compatible host (glyph-gate stays possible) |
| `OPENROUTER_MODEL` | *(pick after benchmark)* | Primary model id |
| `OPENROUTER_FALLBACK_MODELS` | – | Comma list for OpenRouter's `models` fallback |
| `LLM_TIMEOUT_MS` | `4000` | Per model turn |
| `AI_MAX_TURNS` | `4` | Loop budget |

Request per turn:

```json
{
  "model": "<OPENROUTER_MODEL>",
  "messages": [system, user, ...assistant tool_calls, ...tool results],
  "tools": [find_values, find_entity, test_queries, describe_field, submit_query],
  "tool_choice": "required",
  "parallel_tool_calls": true,
  "temperature": 0,
  "max_tokens": 600,
  "provider": { "require_parameters": true }
}
```

`tool_choice: "required"` on every turn means the model always acts; the only way to end
is `submit_query`. `provider.require_parameters` makes OpenRouter route only to backends
that honour tools. The tool list is identical every turn so prompt-caching providers can
reuse the prefix.

Model choice: this task wants a *fast* tool-capable model, not the smartest. Benchmark
three on the golden set (section 9) for accuracy, turns used and latency; candidates in
the fast tier are Anthropic Haiku, OpenAI mini-class and Google Flash-class models. Pick by
p50 latency at ≥ 95 % "hits > 0" on the golden set. Keep `OPENROUTER_MODEL` an env var so
the choice can change without a deploy.

### 3.5 Server-side loop (pseudo-code)

```js
const messages = [system(), user(prompt)];
let tested = new Map();                  // cql -> {hitcount, errorMessage}
for (let turn = 0; turn < MAX_TURNS; turn++) {
  const reply = await llm.chat(messages, TOOLS);       // 4 s timeout
  const calls = reply.tool_calls ?? [];
  messages.push(reply);

  const submit = calls.find(c => c.name === "submit_query");
  const lookups = calls.filter(c => c.name !== "submit_query");

  // run all lookups of this turn together: cache lookups are sync,
  // all FBI-API needs (suggest + hitcounts + facets) go in ONE GraphQL request
  const results = await runToolsBatched(lookups);
  results.forEach(r => { if (r.name === "test_queries") r.value.forEach(t => tested.set(t.cql, t)); });
  messages.push(...results.map(toolMessage));

  if (submit) {
    const { cql, explanation, interpretations } = validateArgs(submit);
    const local = validateLocally(cql);                 // tokenizer + live index set
    const check = local.ok ? (tested.get(cql) ?? await hitcount(cql)) : { errorMessage: local.error };
    if (!check.errorMessage && check.hitcount > 0) return respond({ cql, ...check, explanation, interpretations });
    if (turn < MAX_TURNS - 1) {                         // give the model the bad news once
      messages.push(toolMessage(submit.id, { rejected: true, ...check, tip: relaxationTip(cql) }));
      continue;
    }
    return respond(relaxDeterministically(cql, tested)); // section 3.6
  }
}
return respond(bestTestedOrFreetext(tested, prompt));    // budget exhausted
```

Guardrails: tool arguments are schema-validated (unknown field → tool error message, not a
crash); `test_queries` caps at 4 queries; any CQL string is local-validated before FBI-API;
one FBI request per turn regardless of how many tools were called; total FBI budget 3 s per
request; the user prompt is capped at 1 000 chars as in v1.

### 3.6 Deterministic safety net

The same relaxation ladder as before, only reached when the model runs out of turns:
1. `phrase.*` → `term.*`, drop trailing exactness, expand material type to `*`.
2. Drop the least important clause (keep order: creator/title → subject/genre/place →
   material → language → year → audience). Run the variants **in one batched request**.
3. Everything as bare freetext.
Respond with `relaxed: true` and the facets of the winning variant so the panel can say
what exists.

### 3.7 Worked example (target flow, 3 turns)

User: *"lydbøger af jusi adler olsen om ww2"*

- **Turn 1** — model calls, in parallel: `find_entity(creator, "jusi adler olsen")`,
  `find_entity(subject, "anden verdenskrig")`, `find_values(specificmaterialtype, "lydbog")`.
  Server: one FBI request (2 suggests + 3 subject hitcounts) ≈ 250 ms; the material lookup
  is a cache hit. Results: `Jussi Adler-Olsen`; `2. verdenskrig (18 257)`,
  `anden verdenskrig (1 499)`; `lydbog (online)`, `lydbog (cd)`, `lydbog (cd-mp3)` with hint
  `phrase.specificmaterialtype="lydbog*"`.
- **Turn 2** — `test_queries(["term.creator=\"Jussi Adler-Olsen\" AND term.subject=(\"2. verdenskrig\" OR \"anden verdenskrig\") AND phrase.specificmaterialtype=\"lydbog*\"", "term.creator=\"Jussi Adler-Olsen\" AND phrase.specificmaterialtype=\"lydbog*\""], facets: ["subject"])`.
  Server: one FBI request ≈ 200 ms. First has 0 hits, second 17 with subject facets showing
  `krimi`, `Afdeling Q`… not WW2.
- **Turn 3** — `submit_query({ cql: <second>, explanation: "Jussi Adler-Olsen har ingen lydbøger om 2. verdenskrig; her er alle hans lydbøger." })`.
  Server: already tested → respond.

Wall clock ≈ 3 model turns (~0.6–1.2 s each on a fast model) + ~0.5 s FBI ≈ 2.5–4 s.

---

## 4. Latency budget

| Step | Estimate | Notes |
| --- | --- | --- |
| Model turn (fast tier) | 600–1200 ms | ×2–3 turns typical, ×4 max. Dominant cost |
| Tool execution per turn | 0 ms (cache) / 150–300 ms (one batched FBI request) **[verified]** | Never more than one FBI request per turn |
| Final verify | 0 ms if already tested, else 150–300 ms | |
| **Typical total (3 turns)** | **2.5–4 s** | v1 ≈ 1–2 s, revision-2 plan ≈ 1.5–2.5 s |
| Worst case (4 turns + relaxation) | ~6 s | Hard cap 8 s |

Honest trade-off: this is **~1–2 s slower** than the single-call designs because each tool
round is a model turn. What we buy is a prompt that does not go stale, a model that sees
real values before writing them, and behaviour that is easy to inspect (the tool trace *is*
the explanation). Keep it fast by:

- **Parallel tools in one turn.** The prompt says "look everything up in the same turn"; the
  server executes all of a turn's lookups in one batched FBI request.
- **No speculative prefetch in v2.0.** Measure turn counts first; add a server-side
  pre-run of `find_entity` for name-like tokens only if turns turn out to be the bottleneck.
- **Fast model tier** and `max_tokens: 600`; tool-call turns are short.
- **Result LRU** (prompt → response, 10 min) and **suggest LRU** (5 min).
- **Cold-cache guard**: `test_queries` refuses a candidate that is a *single* broad clause
  (`worktype=literature`, `term.accesstype="online"`) with a tool message "too broad to test,
  add a constraint" — those are the 3–5 s cold-cache cases **[verified]**.
- Verify timeout 1.5 s → `verified:false` rather than blocking.

---

## 5. Server-side caches the tools read from

| Cache | Source | Refresh | Size | Notes |
| --- | --- | --- | --- | --- |
| Closed vocabularies | `complexFacets(cql:"workId=*", facetLimit:500, 23 facets)` — 12.7 s **[verified]** | 12 h, stale-while-revalidate, warmed at boot | ~300 KB | genre + audience additionally per worktype at limit 3000 (literature 5 s, movie 0.5 s, music 0.8 s, game 0.2 s) |
| Live index list | `complexSearchIndexes` (184 indexes + aliases) | 12 h | small | Feeds the local validator; `fields.json` in the repo is 90+ indexes short |
| Field docs | `https://fbi-api.dbc.dk/indexmapper/` scraped to `{ name, aliases, description, format, examples }` | 24 h | ~30 KB text | Feeds `describe_field`; if the scrape fails, fall back to a checked-in snapshot |
| Suggest results | `complexSuggest` | 5 min LRU | – | |
| Whole responses | – | 10 min LRU, ~500 entries | – | Key: normalised prompt |

All refreshes run in the background; a request never waits for a refresh.

---

## 6. Response contract

```json
{
  "cql": "term.creator=\"Jussi Adler-Olsen\" AND phrase.specificmaterialtype=\"lydbog*\"",
  "hitcount": 17,
  "verified": true,
  "relaxed": false,
  "degraded": false,
  "explanation": "Jussi Adler-Olsen har ingen lydbøger om 2. verdenskrig; her er alle hans lydbøger.",
  "interpretations": [
    { "input": "jusi adler olsen", "field": "term.creator", "value": "Jussi Adler-Olsen" },
    { "input": "lydbøger", "field": "phrase.specificmaterialtype", "value": "lydbog*" }
  ],
  "trace": [
    { "tool": "find_entity", "args": { "type": "creator", "query": "jusi adler olsen" }, "ms": 0 },
    { "tool": "test_queries", "args": { "queries": ["…", "…"] }, "ms": 210 }
  ],
  "timing": { "turns": 3, "llm": 2400, "fbi": 460, "total": 2950 }
}
```

`cql` keeps the v1 shape so `AiSearch.js` only changes the URL. `explanation` is written by
the model for the conversational panel; `trace` is for the debug view and for the eval
script (turn counts, which tools were used).

---

## 7. Proposed file layout

```
src/pages/api/ai/cql.js                  # v1, unchanged
src/pages/api/ai/v2/cql.js               # v2 route: input validation, agent loop, response
src/lib/ai/llm/openrouter.js             # chat() with tools, timeouts, fallbacks, usage logging
src/lib/ai/agent/prompt.js               # the short system prompt
src/lib/ai/agent/tools.js                # tool JSON schemas + dispatcher (validates args)
src/lib/ai/agent/loop.js                 # the bounded turn loop (section 3.5)
src/lib/ai/tools/findValues.js           # closed vocab lookup (cache + alias table + fuzzy)
src/lib/ai/tools/findEntity.js           # suggest wrapper, subject hitcounts, title strategy
src/lib/ai/tools/testQueries.js          # local validate + batched hitcount/facets/samples
src/lib/ai/tools/describeField.js        # indexmapper docs lookup
src/lib/ai/cache/vocabulary.js           # facet prefetch + TTL
src/lib/ai/cache/indexes.js              # live index list for the validator
src/lib/ai/cache/indexDocs.js            # indexmapper scrape + snapshot fallback
src/lib/ai/fbi.js                        # direct FBI-API fetch w/ access token, alias batching
src/lib/ai/relax.js                      # deterministic safety net
src/lib/ai/__tests__/*.test.js           # tools/relax/validator unit tests with fixture data
scripts/ai-eval.js                       # golden prompts → hits>0 rate, turns, latency, model compare
```

Helpers live under `src/lib/ai/`, not `pages/api/`, because every file under `pages/api`
becomes a public route.

---

## 8. Open questions

Settled by the live FBI-API probe: facet coverage and sizes, key casing, suggester
tolerance, batching cost, cold-cache behaviour, which indexes exist, `setting` semantics,
`firstaccessiondate` being filter-only.

Open — OpenRouter and model side (host blocked from the sandbox):

1. **Smoke-test the contract**: `tools`, `tool_choice: "required"`, `parallel_tool_calls`,
   `provider.require_parameters`, `models` fallback — one curl each with the key from
   `.env.local`.
2. **Which model.** Benchmark 3 fast tool-capable models on the golden set for (a) share of
   prompts with hits > 0, (b) average turns, (c) p50/p95 latency, (d) cost per request.
3. **Does a fast model reliably parallelise lookups in turn 1?** If it serialises (one tool
   per turn), turn count doubles; mitigation is a stronger prompt nudge or a
   speculative server-side prefetch of `find_entity` for name-like tokens.
4. **Prompt caching** on OpenRouter for the chosen provider (stable system + tools prefix).

To test from this sandbox: allow `openrouter.ai` in the network policy and put
`OPENROUTER_API_KEY` in `.env.local`.

---

## 9. Evaluation plan

- Golden set of ~60 prompts (Danish/English, all worktypes, typos, abbreviations, time
  expressions, negations, ISBNs, place names, "nyindkøbte", role+name). Expected: 0 parse
  errors, `hitcount > 0`, expected fields present, optional expected top workId.
- `scripts/ai-eval.js` runs the set per model and prints hits>0 rate, relaxation rate,
  avg/max turns, tools per request, latency p50/p95, tokens and cost. Compare against v1.
- Unit tests for each tool with fixture vocabularies (today's facet JSON can seed them),
  for the local validator against the live index list, and for `relax.js`.
- Ship behind `AI_CQL_VERSION=2` and compare in the AI tab before switching the default.

---

## 10. Summary

Replace the big prompt with a small one and five tools. The model looks values and names up
(`find_values` from a prefetched vocabulary, `find_entity` via the suggester), tests
candidates (`test_queries`, batched into one FBI request), reads field docs on demand
(`describe_field`), and ends with `submit_query`, which the server verifies and, if needed,
relaxes. OpenRouter is the LLM endpoint, configured by env, model chosen by benchmark.
Cost: roughly 1–2 s more latency than a single-call design. Benefit: values that exist,
queries that parse, a prompt that never goes stale, and a tool trace that doubles as the
explanation shown to the user.
