# AI search – model overview

Every endpoint takes `POST { prompt }` (max 1000 chars) and returns at least `{ cql }`, which is then run as a normal CQL search. The versions differ in how they get from natural language to CQL.

The frontend uses `/api/ai/v6/cql` (hardcoded as `AI_CQL_ENDPOINT` in `AiSearch.js`).

## The AST (v3 and later)

From v3 onwards the model does not write CQL. It returns a small JSON AST, and the compiler turns that into CQL. Each clause has a `field`, an `op` and a list of `values`. Several values in one clause are ORed, `negate: true` excludes the clause, and `combine` (default `"AND"`) joins the clauses.

```json
{
  "clauses": [
    { "field": "creatorcontributor", "op": "=", "values": ["Arnold Schwarzenegger"] },
    { "field": "worktype", "op": "=", "values": ["movie"] }
  ],
  "combine": "AND",
  "note": "Film med Arnold Schwarzenegger."
}
```

This compiles to:

```
term.creatorcontributor="Arnold Schwarzenegger" AND worktype=movie
```

The compiler maps each field to its index (`creatorcontributor` → `term.creatorcontributor`), quotes string values, and leaves enum values like `worktype` unquoted. In v5 the model returns three of these ASTs in a `candidates` array.

## v1 – `/api/ai/cql`: the LLM writes CQL directly

- One chat completion against glyph-gate (`LLMTOKEN`, default model `skolegpt`).
- A large system prompt contains the index reference, controlled Danish values and examples. The model outputs raw CQL on a single line.
- Only post-processing: strip code fences and quotes.
- Weakness: nothing stops invalid syntax, invented indexes or wrong controlled values.

## v3 – `/api/ai/v3/cql`: the LLM builds an AST and a compiler writes the CQL

- The LLM goes through OpenRouter (`OPENROUTER_API_KEY`) with a static, cacheable prompt.
- A forced tool call makes the model return a small JSON AST (clauses, combine, note) instead of CQL. If the model has no tool support, it falls back to plain JSON output.
- A deterministic compiler (`src/lib/aiCql/compiler.js`) produces the CQL, so syntax errors and unknown indexes are impossible.
- Controlled values (genre, material type, language …) are matched against a local vocabulary using aliases, inflections and fuzzy matching.
- If nothing compiles, the prompt itself is searched as a default-index term.

## v3.1 – `/api/ai/v3.1/cql`: v3 plus a hit-count check and relaxation

- The compiled CQL is sent to FBI-API `complexSearch` to read its hit count.
- On 0 hits, the AST is relaxed deterministically (`relax.js`): drop negations, drop the least essential clauses, demote a clause to the default index. The prompt text is tried as a last resort.
- The first candidate with hits wins. If nothing has hits, or FBI-API is unreachable, the original translation is returned.
- More robust, but slower, because it can make several FBI-API round trips.

## v3.2 – `/api/ai/v3.2/cql`: v3.1 plus worktype filtering and creator correction

- `specificmaterialtype` is mapped to the coarser `worktype` (literature, movie, game …).
- When a query gets 0 hits, creator names are replaced by the first FBI-API `complexSuggest` (CREATOR) suggestion before relaxation.

## v4 – `/api/ai/v4/cql`: catalogue values up front, no validation loop

- Uses a narrower field registry (`v4/indexes.js`): every person is `creatorcontributor`, and `issn`/`dk5` are removed.
- Three steps: the LLM produces an AST; every open-vocabulary value (person, subject, title, series, publisher …) is replaced by the first `complexSuggest` hit; then the compiler writes the CQL.
- Because the values come from the catalogue, there is no hit-count check and no relaxation, which makes it faster and more predictable than v3.1/v3.2.
- The provider can be OpenRouter or glyph-gate (`v4/provider.js`). Set `AI_CQL_SUGGEST=false` to skip the catalogue step.

## v4.1 – `/api/ai/v4.1/cql`: v4 plus reranked suggestions

- Same pipeline as v4, but the top 3 suggester candidates are reranked against the prompt with `voyageai/rerank-2.5-lite` before one is picked.
- If the reranker fails, the suggester's original order is used.

## v5 – `/api/ai/v5/cql`: several candidates plus a reranker, no catalogue

- One structured-output call to a small model (`google/gemma-4-26b-a4b-it`) returns 3 candidate ASTs.
- Each candidate is compiled with the v4 registry, and duplicates are dropped.
- The CQL strings are reranked against the prompt with the v4.1 reranker, and the best one is returned. If the reranker fails, the model's first candidate is used.
- There is no FBI-API lookup, so it is cheap and fast, but the values are not verified against the catalogue.

## v6 – `/api/ai/v6/cql`: v4.1 plus reranker-guided relaxation (current default)

- Runs the full v4.1 pipeline, then checks the query's hit count in FBI-API.
- On 0 hits, the positive clauses are ranked once against the prompt with `voyageai/rerank-2.5-lite` (`v6/relax.js`). Negations are dropped first, then the least relevant clause, then the next.
- Up to 3 relaxed candidates are checked in parallel, and the least relaxed one with hits wins. If the reranker fails, the fixed drop priority from v3.1 is used.
- Unlike v3.1, the prompt decides which clauses matter, not a fixed field order. If FBI-API is unreachable or nothing has hits, the v4.1 query is kept.

## v7 – `/api/ai/v7/cql`: v4 with facet-based catalogue values

- Same LLM step as v4, but most values are resolved through FBI-API facets instead of the suggester (`v7/facets.js`).
- For facet fields (person, role, subject, series, host publication, fictional character), each value is searched on its own in the default index. The top 20 facet values for the clause's field are reranked against it, and the best one replaces it if its score is at least `AI_CQL_FACET_MIN_SCORE` (default 0.5).
- Fields without a facet (title, publisher) use the v4.1 reranked suggester. Both lookups run in parallel.
- Values are kept as written when nothing scores high enough or a lookup fails. There is no hit-count check.
