# AI search (AI-søgning)

Natural-language search for bibliotek.dk. The user describes what they are
looking for in plain Danish or English, an LLM translates the text into a
single CQL query, and the normal CQL search pipeline runs the query and shows
the results. The user stays on the **AI-søgning** tab and sees the generated
CQL as the output of their input, right below the input field.

```
User text ──▶ POST /api/ai/cql ──▶ LLM (glyph-gate) ──▶ CQL string
                                                          │
             /find/ai?prompt=<text>&cql=<cql>  ◀──────────┘
                     │
                     └──▶ complexSearch (FBI-API) ──▶ results
```

## Setup

The LLM is called server-side only. Configure it with environment variables
(see `.env.local_example`; never commit real tokens):

| Variable         | Required | Default                      | Purpose                                                                                           |
| ---------------- | -------- | ---------------------------- | ------------------------------------------------------------------------------------------------- |
| `LLMTOKEN`       | yes      | –                            | Bearer token for the LLM gateway. Without it the route answers `500 AI search is not configured`. |
| `LLM_BASE_URL`   | no       | `https://glyph-gate.dbc.dk/` | OpenAI-compatible base URL. The route calls `v1/chat/completions` under it.                       |
| `LLM_MODEL`      | no       | `skolegpt`                   | Model name sent in the request body.                                                              |
| `LLM_TIMEOUT_MS` | no       | `30000`                      | Abort the LLM request after this many milliseconds.                                               |

No new npm dependencies are needed. The route uses the built-in `fetch` in
Node/Next.js and `dbc-node-logger` for logging.

## Files

| File                                                                           | Role                                                                                                                                                                                             |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/pages/api/ai/cql.js`                                                      | Next.js API route. Validates the prompt, calls the LLM, cleans the answer and returns `{ cql }`.                                                                                                 |
| `src/components/search/aiSearch/AiSearch.js`                                   | The tab content: input + button (`AiSearchView`), the CQL output panel, and the `Wrap` that calls the API and commits the search.                                                                |
| `src/components/search/aiSearch/AiSearch.module.css`                           | Styles for the input row and the output panel, incl. token colours for the CQL.                                                                                                                  |
| `src/components/search/Search.js`                                              | Renders the AI tab (`MODE.AI`) and passes `handleAiCommit` to it.                                                                                                                                |
| `src/components/hooks/useSearchSync.js`                                        | `handleAiCommit(prompt, cql)` pushes `/find/ai?prompt=…&cql=…`.                                                                                                                                  |
| `src/components/utils/searchSyncCore.js`                                       | Ladder rules for `MODE.AI` (snapshot, hydration from URL, tab switching).                                                                                                                        |
| `src/components/search/page/Page.js`, `src/components/search/result/Result.js` | Treat `mode === "ai"` like CQL mode so hit count and results are fetched from `cql` in the URL.                                                                                                  |
| `src/components/search/advancedSearch/topBar/TopBar.js`                        | Sticky top bar shows "AI-søgning" as the heading in AI mode.                                                                                                                                     |
| `src/pages/find/[mode].js`                                                     | Accepts `ai` as a valid mode and fetches SSR hit count as "avanceret".                                                                                                                           |
| `src/components/base/translate/Translate.json`                                 | Labels under `improved-search` (`ai`, `ai-placeholder`, `ai-description`, `ai-loading`, `ai-error`, `ai-cql-label`, `ai-edit-cql`) and `search` (`topbar-ai-search`, `topbar-ai-search-mobile`). |
| `src/components/utils/__tests__/searchSyncCore.test.js`                        | Unit tests for the AI ladder rules.                                                                                                                                                              |

## The "agent"

There is no multi-step agent: it is a single, stateless LLM call per search.
The route sends two messages:

1. `system`: `SYSTEM_PROMPT` in `src/pages/api/ai/cql.js`. It is the whole
   "brain" of the feature and contains
   - the output contract (exactly one CQL line, no prose, no markdown),
   - interpretation rules (expand abbreviations such as `kbh` → `københavn`,
     decide whether a word is a person, place, topic, genre, material type…),
   - the fallback rule: when unsure of the index, emit a bare quoted term so the
     default index is searched instead of guessing a wrong index,
   - CQL syntax rules (operators, relations, `within`, `NOW` arithmetic,
     wildcards, quoting),
   - a reference table of allowed indexes (`term.creator`, `term.subject`,
     `term.setting`, `publicationyear`, `ages`, …) and `phrase.*` patterns,
   - controlled Danish vocabularies (languages, roles, material types, genres),
   - ~30 few-shot examples of prompt → CQL.
2. `user`: the trimmed prompt (max 1000 characters).

Request parameters: `temperature: 0` for deterministic output and
`reasoning_effort: "low"` because the task is a direct translation.

The index list in the prompt is based on <https://fbi-api.dbc.dk/indexmapper/>.
When indexes or controlled values change in FBI-API, update the prompt tables
and the examples. The comments marked `<!-- EXTEND … -->` in the prompt point
to lists that could be generated from a vocabulary endpoint instead of being
hard-coded.

## The LLM call, step by step

`POST /api/ai/cql` with body `{ "prompt": "krimier der foregår i kbh" }`.

1. Only `POST` is accepted (`405` otherwise). Missing `LLMTOKEN` → `500`.
2. The prompt is trimmed. Empty → `400 Missing prompt`; longer than 1000
   characters → `400 Prompt too long`.
3. `Cache-Control: no-store` is set on the response.
4. An `AbortController` aborts the LLM request after `LLM_TIMEOUT_MS`.
5. `fetch(<LLM_BASE_URL>/v1/chat/completions)` with
   `Authorization: Bearer <LLMTOKEN>` and the JSON body
   `{ model, temperature: 0, reasoning_effort: "low", messages: [system, user] }`.
6. Non-2xx from the LLM → logged, `502 AI service unavailable`.
7. `choices[0].message.content` is run through `extractCql()`, which strips
   code fences, collapses whitespace to single spaces and removes a single pair
   of surrounding backticks. Empty result → `502 Could not generate CQL`.
8. Success → `200 { "cql": "term.genreandform=\"krimi\" AND \"københavn\"" }`.
9. Network errors → `502 AI request failed`; timeout → `504 AI service timeout`.

The CQL is **not** validated server-side. Invalid CQL simply yields zero hits
from FBI-API and the standard "no hits" UI. The user can open the query in the
CQL tab to fix it by hand.

## Frontend flow

1. `AiSearch` (Wrap) posts the prompt and shows an "Oversætter…" output panel
   below the input while waiting.
2. On success it calls `onCommit(prompt, cql)` → `handleAiCommit` in
   `useSearchSync`, which pushes `/find/ai?prompt=<text>&cql=<cql>` (shallow).
   The URL is the single source of truth; reloading or sharing the link
   restores the prompt in the input and the generated CQL.
3. `AdvancedSearchProvider` already reads `cql` from the URL, so `Page.js` and
   `Result.js` fetch hit count and results through the existing complexSearch
   fragments. The facets, sorting, save-search and search-history features work
   as in CQL mode; history items are labelled "AI-søgning".
4. The output panel shows the label "Din tekst oversat til CQL-søgning", the
   CQL with the same token colours as the CQL editor (rendered as React
   elements, not `innerHTML`, since the value comes from the URL) and a link
   "Rediger i CQL-søgning" to `/find/cql?cql=<cql>`.
5. On error the output panel shows the `ai-error` text and the input stays
   editable so the user can retry.

### Ladder rules (`searchSyncCore.js`)

AI behaves like the CQL rung:

- An AI commit clears simple/advanced/CQL state and sets `workTypes` to `all`.
- Switching from AI to the **CQL** tab seeds the editor with the generated CQL.
- Switching from AI down to **Avanceret** or **Søg** gives empty views (no
  carry-down, same policy as CQL).
- Switching to AI from another tab starts with an empty input and no output.
- Staying on AI keeps `prompt` and `cql` in the URL.

## Testing

- `npm test` runs the Jest suites, including
  `src/components/utils/__tests__/searchSyncCore.test.js`.
- Manual check: open `/find/ai`, type "bøger af kim leine", press Enter. The
  tab must stay on AI-søgning, the output panel must show
  `term.creator="kim leine" AND term.specificmaterialtype="bog"` (or similar),
  and results must appear below. Reload the page: the prompt, the CQL and the
  results persist. Click "Rediger i CQL-søgning": the CQL tab opens with the query.
- Try the API directly:

  ```bash
  curl -X POST http://localhost:3000/api/ai/cql \
    -H 'Content-Type: application/json' \
    -d '{"prompt":"franske film med danske undertekster"}'
  ```

## Known limitations / ideas

- Single-turn only: each search is a fresh translation, there is no follow-up
  ("…and only from the 90s") that refines the previous query.
- The LLM output is trusted as-is; a server-side pass through the CQL parser in
  `src/components/utils/cql/parser.js` could reject invalid queries early or
  ask the model to retry.
- The `data-cy` hooks (`ai-search-input`, `ai-search-button`, `ai-search-cql`,
  `ai-search-edit-cql`, `ai-search-error`) are in place for a
  Cypress test; the LLM call should be stubbed with `cy.intercept`.

## v3: JSON AST + deterministic compiler (`/api/ai/v3/cql`)

A second, experimental route lives next to v1 and implements the ideas in
`ai-cql-v3.md`. v1 is untouched; switch the AI tab to v3 with
`NEXT_PUBLIC_AI_CQL_ENDPOINT=/api/ai/v3/cql`.

```
User text ──▶ POST /api/ai/v3/cql ──▶ OpenRouter (forced tool call) ──▶ JSON AST
                                                                          │
                     compiler + vocabulary resolver (src/lib/aiCql) ◀─────┘
                                                                          │
                                                          { cql, ast, resolutions, … }
```

What is different from v1:

- **The model never writes CQL.** It calls one tool, `build_query`, with
  `{ clauses: [{ field, op, values, negate? }], combine?, note? }`. Field names
  have no `term.`/`phrase.` prefix; the compiler picks the family.
- **`src/lib/aiCql/compiler.js`** turns the AST into CQL: whitelisted fields
  (`indexes.js`), operators checked per field (range ops only on
  ages/pegi/mediacouncilagerestriction/lix/publicationyear/workyear/
  datefirstedition), `within` bounds validated, `NOW - 12 MONTHS` spacing
  normalized, quoting/escaping in code, `NOT` appended after the positive
  clauses (never `AND NOT`), unknown fields demoted to the default index.
- **`src/lib/aiCql/vocab.js`** resolves controlled values (genre, material
  type, language, mood, setting, film nationality, platform…) against
  `vocab.json`: exact → alias table (`aliases.js`: english→engelsk,
  sci-fi→science fiction, roman→romaner…) → Danish singular/plural →
  word-boundary prefix (`lydbog` → `phrase.specificmaterialtype="lydbog*"`)
  → fuzzy (Dice/Levenshtein). Known value → `phrase.<field>` (exact, case
  insensitive); unknown → `term.<field>` (tokenized, best recall).
- **`vocab.json`** holds the real facet values from FBI-API (18 vocabularies,
  dumped 2026-09-10 with `complexFacets(cql: "workId=*")`). Refresh it with
  `node scripts/ai-vocab-refresh.mjs` (needs `CLIENT_ID`/`CLIENT_SECRET` or
  `FBI_API_ACCESS_TOKEN`, and `FBI_API_BIBDK21_URL` if you don't want the
  default from `.env`). Because the file's `source` is `"facets"`, fuzzy
  matches are trusted for `phrase.*`, and a value that is _not_ in a closed
  vocabulary is rerouted: an unknown `setting` (e.g. the city "valencia")
  becomes `term.subject`, an unknown `mood`/`narrativetechnique` becomes a
  bare default-index term. `term.setting="valencia"` has 0 hits,
  `term.subject="valencia"` 237.
- **`src/lib/aiCql/prompt.js`** builds the static system prompt from the field
  registry, the top vocabulary values and ~20 gold examples, and sends it with
  `cache_control: ephemeral` so OpenRouter/Anthropic-style prompt caching
  applies. Verified FBI-API behaviour is baked in: place names → `subject`
  (not `setting`), `term.*` is not stemmed, `firstaccessiondate` is a
  holdings filter and not searchable, English subject synonyms are ORed.
- **`src/lib/aiCql/openrouter.js`**: `POST {OPENROUTER_BASE_URL}/chat/completions`
  with `tools`, forced `tool_choice`, `provider.require_parameters`, optional
  `models` fallback list, timeout, usage/cache logging.
- **Never errors on the model's account:** if the AST is unusable the route
  answers with the whole prompt as a quoted default-index term and
  `fallback: true`.

Env: `OPENROUTER_API_KEY` (required), `OPENROUTER_MODEL`,
`OPENROUTER_FALLBACK_MODELS`, `OPENROUTER_BASE_URL`, `OPENROUTER_TIMEOUT_MS`.

Tests: `src/lib/aiCql/__tests__/` (compiler, vocabulary resolver, prompt/tool
schema, tool-call extraction).

## v3.1: v3 + hit count validation (`/api/ai/v3.1/cql`)

Same translation as v3, but the route checks that the generated CQL actually
has results before returning it. Switch the AI tab to it with
`NEXT_PUBLIC_AI_CQL_ENDPOINT=/api/ai/v3.1/cql`. v3 is untouched.

```
User text ──▶ LLM (build_query) ──▶ compile ──▶ CQL ──▶ complexSearch hitcount
                                                            │ > 0 → done
                                                            │ = 0
        ┌───────────────────────────────────────────────────┘
        ▼
  1. LLM revision   "your query had 0 hits, broaden it"     → hitcount
  2. relax ladder   drop NOT · drop least essential clause · demote to default
                    (checked in parallel batches)           → hitcount
  3. prompt text    "whole prompt" · "word" AND "word"       → hitcount
  4. nothing hits   → the original CQL is returned (hitcount 0)
```

- **`src/lib/aiCql/hitcount.js`**: `fetchHitcount({ cql, accessToken })`
  runs `complexSearch(cql) { hitcount errorMessage }` against FBI-API
  server-side with the session's (anonymous or user) access token from
  `getServerSession`. A CQL error from FBI-API counts as 0 hits; network/HTTP
  errors make the route return the unvalidated v3 result (`validated: false`)
  instead of failing. `firstWithHits()` checks candidates in small parallel
  batches and picks the first in ladder order that has hits.
- **`src/lib/aiCql/relax.js`**: deterministic relaxation of the AST.
  `DROP_PRIORITY` orders fields from least to most essential (mood, setting,
  audience → year → language, material type → genre → subject → creator,
  title). `relaxCandidates(ast)` yields `drop-negations`, then `drop:<field>`
  while more than one clause is left, then `demote:<field>` (last value in the
  default index). `fallbackCandidates(prompt)` yields `fallback:phrase` and
  `fallback:words`.
- **`src/pages/api/ai/v3.1/cql.js`**: the route. `buildRevisionMessages()`
  appends the previous structure and the failing CQL to the (cached) system
  prompt so the model can broaden its own answer.

Response = v3 body plus `hitcount`, `validated`, `strategy` (`original`,
`llm-revision:N`, `drop-negations`, `drop:<field>`, `demote:<field>`,
`fallback:phrase`, `fallback:words`), `original: { cql, hitcount }`,
`attempts: [{ strategy, cql, hitcount }]` and `timing.hitcount`. `cql` keeps
the v1/v3 contract so the AI tab needs no change.

Env: `AI_CQL_VALIDATE` (`false` → behave like v3), `AI_CQL_LLM_RETRIES` (1),
`AI_CQL_MAX_RELAXATIONS` (6), `AI_CQL_HITCOUNT_CONCURRENCY` (3),
`AI_CQL_HITCOUNT_TIMEOUT_MS` (6000), `AI_CQL_VALIDATE_BUDGET_MS` (12000),
`AI_CQL_FBI_API_URL` (default: origin of `NEXT_PUBLIC_FBI_API_URL` +
`/<FBI_API_FORCE_PROFILE || bibdk21>/graphql`).

Tests: `src/lib/aiCql/__tests__/relax.test.js`, `hitcount.test.js`,
`route-v31.test.js`.

## v4: narrow field set + catalogue suggester (`/api/ai/v4/cql`)

The route the AI tab uses by default. Three fixed steps, no hit count check and
no relaxation ladder — the query is built from values that exist in the
catalogue, so there is nothing to repair afterwards. v3, v3.1 and v3.2 are
untouched; point `NEXT_PUBLIC_AI_CQL_ENDPOINT` at one of them to compare.

```
User text ──▶ 1. LLM (build_query) ──▶ AST
                                        │
             2. complexSuggest per open value, FIRST suggestion wins
                                        │
             3. compile (v4 registry) ──▶ CQL ──▶ complexSearch results
```

- **Fewer indexes** (`src/lib/aiCql/v4/indexes.js`). The v3 registry minus
  `creator`, `contributor`, `issn` and `dk5`. Every person goes to
  `creatorcontributor`, which matches both roles, so the model never has to
  guess whether someone is an author or an actor; `creator`, `author`,
  `director`, `actor`, `narrator`, `translator`, `illustrator` … are aliases
  for it. The other 40 fields, the compiler and the controlled vocabulary are
  the shared v3 ones.
- **Catalogue lookup** (`src/lib/aiCql/v4/suggest.js`). Every value in an open
  vocabulary — `creatorcontributor`, `function`, `subject`, `title`, `series`,
  `publisher`, `hostpublication`, `fictionalcharacter` — is sent to
  `complexSuggest(q, type)` and replaced by the **first** suggestion. Lookups
  run in parallel, identical values are asked once, and a value the suggester
  does not know (or a timeout, an HTTP error) is kept as the model wrote it.
  `default` is deliberately not looked up: free text must stay as typed.
  Controlled fields (genre, mood, material type, languages …) are still
  resolved locally against `vocab.json`.
- **Prompt** (`src/lib/aiCql/v4/prompt.js`). Same cached-prefix structure as
  v3, built from the v4 registry, with gold examples that use
  `creatorcontributor` and one value per clause: the model is told that the
  server matches names, titles and subjects against the catalogue, so it must
  not hedge with spelling variants or complete a half-remembered name.
- The FBI-API token comes from the same session flow as v3.1
  (`getAccessToken`), and the route never fails on the lookup's account.

Response: `cql`, `ast` (after the lookup), `originalAst`, `original: { cql }`,
`note`, `resolutions` (`method: "suggester"` for catalogue swaps),
`suggestions: [{ field, type, input, suggestions, accepted }]`, `warnings`,
`fallback`, `model`, `mode`, `usage`, `timing { llm, suggest, total }`. `cql`
keeps the v1/v3 contract, so the AI tab needs no change.

Env: `AI_CQL_SUGGEST` (`false` → skip the lookup), `AI_CQL_SUGGEST_TIMEOUT_MS`
(4000), `AI_CQL_FBI_API_URL` (shared with v3.1), plus the OpenRouter variables.

Tests: `src/lib/aiCql/__tests__/route-v4.test.js` (pipeline, suggester
behaviour, narrow registry) and `v4-prompt.test.js` (prompt/tool schema, gold
examples).
