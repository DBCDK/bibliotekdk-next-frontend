You can read about my cql here: https://fbi-api.dbc.dk/indexmapper/


The entire indexmapper documentation is a few thousand tokens. Retrieval would just add latency and a failure mode (retrieving the wrong index docs). Instead:

Bake the full index schema into the system prompt (index names, formats, allowed operators, 10–20 gold examples of user prompt → query). Use prompt caching so this large static prefix costs near-zero latency and money on every call.
Have the model output a JSON AST, not raw CQL. Define a tool/JSON schema like:
json
{
  "clauses": [
    {"index": "term.creator", "op": "=", "value": "kim leine"},
    {"index": "phrase.genreandform", "op": "=", "value": "roman"},
    {"index": "workyear", "op": ">=", "value": "2020"}
  ],
  "combine": "AND"
}

Then a deterministic compiler in your code turns this into CQL. This is the single biggest precision win: syntax errors become impossible, you validate index names against a whitelist, you enforce which operators are legal per index (e.g. within only on ranges), and you handle the fiddly NOW - 28 DAYS spacing rules in code instead of hoping the model gets the whitespace right.

Use a small, fast model (Haiku-class). This is a constrained translation task, not open-ended reasoning — small models do it well with good few-shot examples. With a cached prompt and a short JSON output you're looking at ~300–700 ms end to end.
Where preprocessing and embeddings do help

The hard precision problem in your dialect isn't syntax — it's controlled vocabulary values, which are Danish closed sets (phrase.genreandform="graphic novel*", phrase.mainlanguage=dansk, phrase.gameplatform="playstation 4", term.childrenoradults="til voksne", etc.). A model will happily invent phrase.genreandform="krimi-roman" when the controlled term is something else.

Since you don't mind preprocessing:

Dump every controlled vocabulary using the facet indexes (facet.genreandform, facet.specificmaterialtype, facet.language, facet.mood, facet.setting, ...). Run a broad search once, collect all facet values, store them locally. Refresh weekly.
Small vocabularies go straight into the prompt (material types, worktypes, accesstype, languages — these are tiny).
Large vocabularies (subjects, genres, moods) get a local lookup layer: after the LLM emits a value, check it against the vocab. Exact match → done. No match → fuzzy match or a precomputed embedding index (nearest neighbor over a few thousand strings is sub-millisecond locally). This corrects "sci-fi" → "science fiction" without another LLM round trip.

So embeddings: yes, but as a post-hoc value resolver, not as the main translation engine.