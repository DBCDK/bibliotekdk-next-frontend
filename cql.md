# CQL / Complex Search — a client-side guide

How to search FBI API with CQL from a frontend client: what you can write in a query,
which indexes exist, and how to discover the legal *values* of an index (e.g. all languages).

Everything here is done through two GraphQL queries: `complexSearch` and `complexFacets`
(plus `complexSuggest` for typeahead).

---

## 1. The basics

```graphql
query ($cql: String!) {
  complexSearch(cql: $cql) {
    hitcount
    errorMessage
    works(offset: 0, limit: 10) {
      workId
      titles { main }
    }
  }
}
```

```json
{ "cql": "term.title=snemand*" }
```

- `cql` is **required** — it is the whole query, written as a plain string.
- `hitcount` is the total number of **works** (use it for pagination).
- `errorMessage` is non-null when your CQL is invalid — always select it while developing,
  otherwise a syntax error just looks like "0 hits".
- `works(offset, limit, sort)` — `limit` is a `PaginationLimitScalar`, i.e. an integer **1–100**.

### Query syntax

| What | Example |
| --- | --- |
| Free text (no index) | `harry potter` |
| Index + value | `term.title=snemand` |
| Exact / quoted value | `phrase.creator="H.C. Andersen"` |
| Truncation | `term.title=snemand*` |
| Boolean | `term.title=snemand AND term.creator=andersen` |
| Negation | `worktype=literature NOT term.subject=krimi` |
| Grouping | `(term.title=hest OR term.title=pony) AND publicationyear=2020` |
| Value list (OR-shorthand) | `phrase.subject=("krimi" OR "spænding")` |
| Ranges / relations | `publicationyear>=2015`, `publicationyear=2010` |

Quote any value containing spaces, punctuation or Danish characters that could be read as
operators. When you build CQL from user input, strip/escape `"` — the gateway itself does this
when it composes CQL internally (see `periodicalFiltersToCql` in `src/utils/utils.js:1078`).

### Index families

| Prefix | Meaning |
| --- | --- |
| `term.*` | Analyzed/tokenized match — `term.title=snemand` matches a word in the title |
| `phrase.*` | Exact whole-string match — `phrase.creator="H.C. Andersen"` |
| `sort.*` | Only usable in the `sort` argument, e.g. `sort.latestpublicationdate` |
| *(no prefix)* | A few plain indexes, e.g. `publicationyear`, `worktype` |

Sorting:

```graphql
works(offset: 0, limit: 10, sort: [{ index: "sort.latestpublicationdate", order: DESC }])
```

---

## 2. Which indexes exist?

The full, authoritative list of CQL indexes is published here:

**https://fbi-api.dbc.dk/indexmapper/**

That page is the answer to "can I search on X?". The GraphQL schema does *not* enumerate the
CQL indexes (the `cql` argument is just a `String`), so the indexmapper is the reference you
want open while writing queries.

---

## 3. Which **values** can an index have?

Yes — you can discover them, and there are three mechanisms depending on what you need.

### 3a. Facets — the full value list for an index (this is what you want for "all languages")

Ask for facets and you get back every value the index has *within the result set*, together
with how many works have it. Run it against a broad query and it is effectively "all viable
values".

```graphql
query ($cql: String!, $facets: ComplexSearchFacetsInput) {
  complexSearch(cql: $cql, facets: $facets) {
    hitcount
    errorMessage
    facets {
      name          # e.g. "facet.language"
      values {
        key         # the value you can put in your CQL
        score       # number of works with this value
      }
    }
  }
}
```

```json
{
  "cql": "*",
  "facets": { "facetLimit": 100, "facets": ["LANGUAGE"] }
}
```

Response shape:

```json
{
  "name": "facet.language",
  "values": [
    { "key": "dansk", "score": 1234567 },
    { "key": "engelsk", "score": 456789 }
  ]
}
```

Now feed a `key` straight back into a query: `phrase.language="dansk"`.

Notes that bite people:

- **`name` comes back prefixed and lowercased** — you ask for `LANGUAGE`, you get back
  `facet.language`. Match on that when you look the facet up in the response array.
- **`facetLimit` is how many values per facet you get back**, ordered by frequency. It is
  required. On `complexSearch` it is capped server-side — if you need an exhaustive list of a
  large index (e.g. every publication year, every subject), use `complexFacets` instead, which
  has no cap. `complexFacets` is documented as *internal use only*, so prefer `complexSearch`
  with a sane limit for public clients.
- **Scope matters.** Facets are computed over the current result set *and* the current search
  profile/filters. `cql: "*"` gives you the global vocabulary; `cql: "term.creator=andersen"`
  gives you only the languages Andersen's works exist in — which is usually what you want for
  a filter sidebar (don't offer a filter that leads to 0 hits).
- If `*` is rejected as a match-all by the backend you will see it in `errorMessage`; fall back
  to a broad anchor query such as `worktype=literature`.

**Facet-only query.** If you only need the values and not the works, `complexFacets` skips
resolving works entirely:

```graphql
query ($cql: String!, $facets: ComplexSearchFacetsInput) {
  complexFacets(cql: $cql, facets: $facets) {
    hitcount
    facets { name values { key score } }
  }
}
```

**Which indexes are facetable.** Only the fields in the `ComplexSearchFacetsEnum` enum can be
faceted (`src/schema/complexsearch.js`). Currently:

```
AGES, CATALOGUECODE, CONTRIBUTOR, CONTRIBUTORFUNCTION, CREATOR,
CREATORCONTRIBUTOR, CREATORCONTRIBUTORFUNCTION, CREATORFUNCTION,
FICTIONALCHARACTER, FILMNATIONALITY, GAMEPLATFORM, GENERALAUDIENCE,
GENERALMATERIALTYPE, GENREANDFORM, ISSUE, LANGUAGE, LIBRARYRECOMMENDATION,
MAINLANGUAGE, MUSICALENSEMBLEORCAST, PLAYERS, PRIMARYTARGET,
SPECIFICMATERIALTYPE, SPOKENLANGUAGE, SUBTITLELANGUAGE, TYPEOFSCORE, SUBJECT,
HOSTPUBLICATION, HOSTPUBLICATIONTYPE, SERIES, MEDIACOUNCILAGERESTRICTION,
ACCESSTYPE, MOOD, NARRATIVETECHNIQUE, PEGI, SETTING, LIX, LET,
PUBLICATIONYEAR, SOURCE, INSTRUMENT, CHOIRTYPE, CHAMBERMUSICTYPE,
DATEFIRSTEDITION
```

Introspect the enum in GraphiQL rather than trusting this list — it grows.

An index that is *not* in this enum is still searchable, you just can't enumerate its values
this way; use the suggester or the schema (below).

### 3b. `complexSuggest` — typeahead over a value space

For big open vocabularies (creators, subjects, titles, series, publishers) you don't want the
whole list, you want prefix matches as the user types:

```graphql
query ($q: String!, $type: ComplexSuggestionTypeEnum!) {
  complexSuggest(q: $q, type: $type) {
    result { type term traceId }
  }
}
```

```json
{ "q": "fisker", "type": "CREATOR" }
```

Types: `DEFAULT`, `CREATOR`, `CREATORFUNCTION`, `CREATORCONTRIBUTOR`,
`CREATORCONTRIBUTORFUNCTION`, `CONTRIBUTORFUNCTION`, `SUBJECT`, `TITLE`, `SERIES`,
`PUBLISHER`, `HOSTPUBLICATION`, `FICTIONALCHARACTER`.

The returned `term` is a value you can drop into a `phrase.*` query.

### 3c. The GraphQL schema itself

A few closed vocabularies are enumerated directly in the schema, with their CQL search values
attached. Example: `MaterialSelectionSelectionGroup.searchValues` gives you the values to use
with `term.selectionGroup`, and there are similar `searchValues` fields for
`term.cataloguedPublicationStatus` and `term.librarianAssessment`. When a value set is small
and fixed, check the schema docs in GraphiQL before reaching for facets.

### 3d. "I have index X — can I list its values?"

There is **no generic dump-all-values-of-any-index call**. Work through these in order:

1. **Is it in `ComplexSearchFacetsEnum`?** Strip the `term.`/`phrase.` prefix and look for the
   uppercased name in the enum. If it's there, facet it — that's your value list.
2. **Is it a closed set in the GraphQL schema?** Some indexes correspond to a schema enum or a
   `searchValues` field. Then the schema *is* the list, and it costs you no query at all.
3. **Is it faceted on the simple `search` query instead?** `FacetFieldEnum` (used by
   `search { facets(facets: [...]) }`) covers a slightly different set than
   `ComplexSearchFacetsEnum`.
4. **Otherwise** — open vocabulary, no enumeration. Use `complexSuggest` for typeahead, or
   accept that you can only test values you already have.

**Worked example: `term.setting`**

`SETTING` is in `ComplexSearchFacetsEnum` → case 1, facet it:

```json
{ "cql": "*", "facets": { "facetLimit": 200, "facets": ["SETTING"] } }
```

Response comes back under `name: "facet.setting"`; each `key` is a value you can put back into
`phrase.setting="..."`.

**Worked example: `worktype`**

`WORKTYPE` is *not* in `ComplexSearchFacetsEnum`, so the facet route is closed on
`complexSearch`. But it's case 2 **and** case 3:

- The schema enumerates it as `WorkTypeEnum` in `src/schema/work.js:179` — `ANALYSIS`,
  `ARTICLE`, `BOOKDESCRIPTION`, `GAME`, `LITERATURE`, `MAP`, `MOVIE`, `MUSIC`, `OTHER`,
  `PERIODICA`, `PORTRAIT`, `REVIEW`, `SHEETMUSIC`, `TRACK`. In CQL you write the plain value:
  `worktype=literature`, `worktype="Article"`.
- If you also want counts, the simple `search` query has a `WORKTYPES` facet:

  ```graphql
  query {
    search(q: { all: "*" }) {
      facets(facets: [WORKTYPES]) {
        name
        values(limit: 50) { key term score }
      }
    }
  }
  ```

  Note this is the `search` query's facet enum, not Complex Search's — different query,
  different filter input, and `values(limit:)` is required here. Use `key` when you build a
  query; `term` is the display label and comes back translated to Danish where a translation
  exists.

---

## 4. Filters (holdings) — `filters` vs `cqlfilter`

Two optional arguments narrow the result *without* being part of the CQL string. They are
**mutually exclusive** — sending both is a validation error.

**`filters: ComplexSearchFiltersInput`** — structured holdings filtering:

```json
{
  "filters": {
    "branchId": ["775122"],
    "status": ["ONSHELF"],
    "agencyId": ["775100"],
    "department": ["Voksen"],
    "location": ["skønlitteratur"],
    "sublocation": ["Fantasy"],
    "useOnlineHoldings": false
  }
}
```

`status` values: `ONSHELF`, `ONLOAN`, `DISCARDED`, `LOST`, `NOTFORLOAN`, `ONORDER`.
Other fields: `itemId`, `issueId`, `firstAccessionDate`, `circulationRule`, `section`,
`floatGroup`, `lastloandate`, `loanrestriction`, `branch`.

**`cqlfilter: { cqlfilterquery: "..." }`** — the same idea but expressed as CQL, for cases the
structured input can't express.

Filters also constrain the facets you get back, which is exactly what you want for a
"filter within these results" UI.

---

## 5. What matched inside a work?

Results are **works**; a work has many manifestations. `searchHits` tells you which
manifestations actually matched:

```graphql
works(offset: 0, limit: 10) {
  titles { main }
  manifestations {
    searchHits {
      match { pid identifiers { type value } }
    }
  }
}
```

Useful when the user searched an ISBN or a specific edition and you want to highlight the
right one.

## 6. Convenience hits

`complexSearch` also returns two aggregate signals you can use to render an "entity" card
above the result list:

- `creatorHit: CreatorInfo` — set when ≥3 of the top 5 works share a creator.
- `seriesHit: Series` — set when ≥3 of the top 5 works belong to the same series.

Both are `null` otherwise, so just render conditionally.

---

## 7. Recipes

**All values of an index, most frequent first**

```json
{ "cql": "*", "facets": { "facetLimit": 200, "facets": ["LANGUAGE"] } }
```

**Filter sidebar for the current result set** — one round trip, works + facets together

```json
{
  "cql": "term.title=snemand*",
  "facets": { "facetLimit": 10, "facets": ["LANGUAGE", "GENREANDFORM", "PUBLICATIONYEAR"] }
}
```

**Apply a facet the user clicked**

```
term.title=snemand* AND phrase.language="dansk"
```

**Multi-select within one facet**

```
term.title=snemand* AND phrase.language=("dansk" OR "engelsk")
```

**Everything by an author, newest first**

```json
{ "cql": "phrase.creator=\"H.C. Andersen\"" }
```

```graphql
works(offset: 0, limit: 20, sort: [{ index: "sort.latestpublicationdate", order: DESC }])
```

**On the shelf at my branch right now**

```json
{
  "cql": "term.subject=krimi",
  "filters": { "branchId": ["775122"], "status": ["ONSHELF"] }
}
```

---

## 8. Checklist when a query misbehaves

1. Select `errorMessage` — invalid CQL returns 0 hits *and* a message.
2. Check the index name against https://fbi-api.dbc.dk/indexmapper/.
3. `term.` vs `phrase.` — `phrase.creator=andersen` will not match `H.C. Andersen`; `term.` will.
4. Quote values with spaces or punctuation.
5. Looking a facet up in the response? Match on `facet.<lowercase>`, not the enum name.
6. Empty facet list? The index probably isn't in `ComplexSearchFacetsEnum`.
7. `limit` outside 1–100 is a scalar validation error, not a search error.
8. Sending both `filters` and `cqlfilter` is rejected.
