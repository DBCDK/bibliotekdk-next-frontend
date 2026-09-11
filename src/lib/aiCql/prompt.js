/**
 * @file
 * System prompt and tool definition for AI search v3.
 *
 * The prompt is a large, *static* prefix (field schema + controlled values +
 * gold examples) so that provider-side prompt caching makes it cheap. Only
 * the user message changes between requests.
 */

import { FIELDS, FIELD_NAMES, KIND } from "./indexes";
import { getVocab, normalize, topValues } from "./vocab";

export const TOOL_NAME = "build_query";

/**
 * JSON schema for the query AST. The field enum doubles as the whitelist the
 * model is nudged to respect; the compiler re-validates everything anyway.
 */
export function buildTool() {
  return {
    type: "function",
    function: {
      name: TOOL_NAME,
      description:
        "Return the structured search query that answers the user's request. Call exactly once.",
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {
          clauses: {
            type: "array",
            minItems: 1,
            maxItems: 12,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                field: {
                  type: "string",
                  enum: FIELD_NAMES,
                  description:
                    'Which field to search. Use "default" when unsure.',
                },
                op: {
                  type: "string",
                  enum: ["=", "<", "<=", ">", ">=", "within"],
                  description:
                    'Relation. Anything but "=" is only allowed on ages, pegi, mediacouncilagerestriction, lix, publicationyear, workyear, datefirstedition.',
                },
                values: {
                  type: "array",
                  minItems: 1,
                  maxItems: 6,
                  items: { type: "string" },
                  description:
                    'One or more values. Several values are ORed (synonyms, alternatives). For op "within" give exactly two bounds, e.g. ["2015", "2020"].',
                },
                negate: {
                  type: "boolean",
                  description: "true to EXCLUDE what this clause matches.",
                },
              },
              required: ["field", "op", "values"],
            },
          },
          combine: {
            type: "string",
            enum: ["AND", "OR"],
            description:
              "How the (non-negated) clauses are combined. Default AND.",
          },
          note: {
            type: "string",
            description:
              "Optional. One short Danish sentence for the user about an interpretation or something that could not be expressed (max 120 chars).",
          },
        },
        required: ["clauses"],
      },
    },
  };
}

/**
 * Gold examples: user text → AST. Kept in sync with the verified behaviour of
 * FBI-API (place names are subjects, term.* is not stemmed, acquisition date
 * is not searchable, etc.).
 */
export const EXAMPLES = [
  {
    user: "find krimi i kbh",
    ast: {
      clauses: [
        { field: "genreandform", op: "=", values: ["krimi"] },
        { field: "subject", op: "=", values: ["københavn"] },
      ],
    },
  },
  {
    user: "romaner der foregår i paris",
    ast: {
      clauses: [
        { field: "genreandform", op: "=", values: ["romaner"] },
        { field: "subject", op: "=", values: ["paris"] },
      ],
    },
  },
  {
    user: "bøger af kim leine",
    ast: {
      clauses: [
        { field: "creator", op: "=", values: ["kim leine"] },
        { field: "specificmaterialtype", op: "=", values: ["bog"] },
      ],
    },
  },
  {
    user: "har I profeterne fra evighedsfjorden af kim leine?",
    ast: {
      clauses: [
        { field: "title", op: "=", values: ["profeterne evighedsfjorden"] },
        { field: "creator", op: "=", values: ["kim leine"] },
      ],
    },
  },
  {
    user: "lydbøger af jusi adler olsen om ww2",
    ast: {
      clauses: [
        { field: "creator", op: "=", values: ["jusi adler olsen"] },
        {
          field: "subject",
          op: "=",
          values: ["2. verdenskrig", "anden verdenskrig"],
        },
        { field: "specificmaterialtype", op: "=", values: ["lydbog"] },
      ],
    },
  },
  {
    user: "noget om ai",
    ast: {
      clauses: [
        {
          field: "subject",
          op: "=",
          values: ["kunstig intelligens", "ai"],
        },
      ],
    },
  },
  {
    user: "books about the cold war in english",
    ast: {
      clauses: [
        { field: "subject", op: "=", values: ["den kolde krig", "cold war"] },
        { field: "mainlanguage", op: "=", values: ["engelsk"] },
        { field: "specificmaterialtype", op: "=", values: ["bog"] },
      ],
    },
  },
  {
    user: "krimier udgivet mellem 2015 og 2020",
    ast: {
      clauses: [
        { field: "genreandform", op: "=", values: ["krimi"] },
        { field: "publicationyear", op: "within", values: ["2015", "2020"] },
      ],
    },
  },
  {
    user: "nye fantasyromaner fra i år",
    ast: {
      clauses: [
        { field: "genreandform", op: "=", values: ["fantasy"] },
        { field: "workyear", op: "=", values: ["NOW"] },
      ],
    },
  },
  {
    user: "hvad er der kommet af nyt til børn den seneste måned?",
    ast: {
      clauses: [
        { field: "childrenoradults", op: "=", values: ["til børn"] },
        { field: "workyear", op: ">", values: ["NOW - 12 MONTHS"] },
      ],
      note: "Indkøbsdato kan ikke søges; viser nye udgivelser til børn.",
    },
  },
  {
    user: "noget at læse for en 5-årig",
    ast: {
      clauses: [
        { field: "ages", op: "=", values: ["5"] },
        { field: "specificmaterialtype", op: "=", values: ["bog"] },
      ],
    },
  },
  {
    user: "franske film med danske undertekster",
    ast: {
      clauses: [
        { field: "filmnationality", op: "=", values: ["franske film"] },
        { field: "subtitlelanguage", op: "=", values: ["dansk"] },
      ],
    },
  },
  {
    user: "movies in german with danish subtitles",
    ast: {
      clauses: [
        { field: "worktype", op: "=", values: ["movie"] },
        { field: "spokenlanguage", op: "=", values: ["tysk"] },
        { field: "subtitlelanguage", op: "=", values: ["dansk"] },
      ],
    },
  },
  {
    user: "playstation 5 spil der er ok for en 7-årig",
    ast: {
      clauses: [
        { field: "gameplatform", op: "=", values: ["playstation 5"] },
        { field: "pegi", op: "<=", values: ["7"] },
      ],
    },
  },
  {
    user: "bøger oversat af rane knudsen",
    ast: {
      clauses: [
        { field: "function", op: "=", values: ["oversætter rane knudsen"] },
      ],
    },
  },
  {
    user: "en uhyggelig roman der foregår i storbyen",
    ast: {
      clauses: [
        { field: "genreandform", op: "=", values: ["romaner"] },
        { field: "mood", op: "=", values: ["uhyggelig"] },
        { field: "setting", op: "=", values: ["storbyen"] },
      ],
    },
  },
  {
    user: "bøger om python men ikke om slanger",
    ast: {
      clauses: [
        { field: "subject", op: "=", values: ["python"] },
        { field: "specificmaterialtype", op: "=", values: ["bog"] },
        { field: "subject", op: "=", values: ["slanger"], negate: true },
      ],
    },
  },
  {
    user: "something by murakami as book or audiobook",
    ast: {
      clauses: [
        { field: "creator", op: "=", values: ["murakami"] },
        { field: "specificmaterialtype", op: "=", values: ["bog", "lydbog"] },
      ],
    },
  },
  {
    user: "letlæste bøger til voksne",
    ast: {
      clauses: [
        { field: "generalaudience", op: "=", values: ["let at læse"] },
        { field: "childrenoradults", op: "=", values: ["til voksne"] },
      ],
    },
  },
  {
    user: "9788763860888",
    ast: { clauses: [{ field: "isbn", op: "=", values: ["9788763860888"] }] },
  },
  {
    user: "bæredygtighed",
    ast: {
      clauses: [{ field: "default", op: "=", values: ["bæredygtighed"] }],
    },
  },
  {
    user: "bøger fra 90'erne af stephen king, ikke gys",
    ast: {
      clauses: [
        { field: "creator", op: "=", values: ["stephen king"] },
        { field: "specificmaterialtype", op: "=", values: ["bog"] },
        { field: "publicationyear", op: "within", values: ["1990", "1999"] },
        { field: "genreandform", op: "=", values: ["gys"], negate: true },
      ],
    },
  },
];

/**
 * Which vocabularies to show in the prompt: [name, limit, curated?]. Curated
 * values are shown first (only if they exist in the vocabulary), the rest is
 * filled with the most frequent values. Without curation the genre list would
 * be dominated by "tidsskrifter", "disputatser", "anmeldelser" …
 */
const VOCAB_PREVIEW = [
  ["specificmaterialtype", 25],
  ["generalmaterialtype", 15],
  [
    "genreandform",
    45,
    [
      "romaner",
      "krimi",
      "spænding",
      "thriller",
      "noveller",
      "digte",
      "essays",
      "dramatik",
      "biografier",
      "erindringer",
      "rejsebeskrivelser",
      "kogebøger",
      "lærebøger",
      "håndbøger",
      "tegneserier",
      "graphic novels",
      "billedbøger",
      "pegebøger",
      "børnebøger",
      "ungdomsbøger",
      "fantasy",
      "science fiction",
      "dystopier",
      "gys",
      "humor",
      "eventyr",
      "historiske romaner",
      "kærlighedsromaner",
      "slægtsromaner",
      "spillefilm",
      "dokumentarfilm",
      "tv-serier",
      "animationsfilm",
      "tegnefilm",
      "børnefilm",
      "komedier",
      "actionfilm",
      "gyserfilm",
      "westerns",
      "musicals",
      "rock",
      "pop",
      "jazz",
      "klassisk musik",
      "podcasts",
    ],
  ],
  ["mood", 25],
  ["setting", 20],
  ["narrativetechnique", 10],
  ["mainlanguage", 20],
  ["filmnationality", 14],
  ["gameplatform", 8],
  [
    "generalaudience",
    6,
    [
      "let at læse",
      "for højtlæsning",
      "for begynderlæsere",
      "for voksne",
      "for unge",
    ],
  ],
  ["primarytarget", 6],
];

/**
 * Renders the "## Fields" table of the system prompt.
 *
 * Exported so later route versions (v4) can build the same table from a
 * narrower field registry.
 *
 * @param {Object} [fields] field registry (defaults to the v3 registry)
 * @returns {string}
 */
export function fieldTable(fields = FIELDS) {
  const rows = Object.keys(fields).map((name) => {
    const def = fields[name];
    const ops = def.ops.length > 1 ? " (range ops allowed)" : "";
    const kind =
      def.kind === KIND.ENUM
        ? ` Values: ${def.values.map((v) => `"${v}"`).join(" | ")}.`
        : "";
    return `- ${name}${ops}: ${def.doc}${kind}`;
  });
  return rows.join("\n");
}

/**
 * Renders the "## Controlled values" block. Exported for reuse by v4.
 *
 * @param {Object} [vocab] vocab.json-shaped object
 * @returns {string}
 */
export function vocabPreview(vocab) {
  return VOCAB_PREVIEW.map(([name, limit, curated = []]) => {
    const known = new Set(getVocab(name, vocab).map((e) => e.norm));
    const values = curated.filter((v) => known.has(normalize(v)));
    for (const v of topValues(name, limit, vocab)) {
      if (values.length >= limit) {
        break;
      }
      if (!values.includes(v)) {
        values.push(v);
      }
    }
    return values.length ? `- ${name}: ${values.join(" · ")}` : null;
  })
    .filter(Boolean)
    .join("\n");
}

function examplesBlock() {
  return EXAMPLES.map(
    (ex) => `User: ${ex.user}\n${TOOL_NAME}: ${JSON.stringify(ex.ast)}`
  ).join("\n\n");
}

/**
 * Builds the full system prompt.
 *
 * @param {Object} [options]
 * @param {Object} [options.vocab] vocab.json-shaped object (tests)
 * @returns {string}
 */
export function buildSystemPrompt({ vocab } = {}) {
  return `# Natural language → library search query (bibliotek.dk / FBI-API)

You translate ONE user request (Danish or English) into ONE structured search query by calling the tool \`${TOOL_NAME}\`. The server compiles your structure into CQL, so you never write CQL syntax yourself. Never answer the question, never ask back, never refuse — always call the tool once.

## How to think

1. Expand abbreviations and informal forms to full Danish: kbh → københavn · dk → danmark · ww2 / 2. vk → 2. verdenskrig · sci-fi → science fiction · ai → kunstig intelligens · ps5 → playstation 5.
2. Decide what each word IS: a person, a topic, a place, a title, a genre, a material type, an audience, a language, a time. Map by meaning, never by word order.
3. Place names ("i københavn", "der foregår i paris", "i valencia", "fra grønland") go to **subject**, never to setting. The field **setting** is only for TYPES of milieu and only with a value from the list below ("storbyen", "provinsen", "overklassen", "historisk"); the same goes for **mood**. If the word is not in the list, use subject.
4. Use **title** ONLY when the user clearly refers to a title (quotes, "der hedder", "med titlen", "har I <kendt titel>"). Remove stopwords from the title words (fra, i, og, the, of, a).
5. When you are not confident which field a word belongs to, use **default**. A bare term in the default index is always better than a wrong field.
6. Keep people's names exactly as written. Never correct, complete, or translate a name. Translate everything else — subjects, genres, material types, languages, audiences — into Danish controlled values as listed below, regardless of input language.
7. For **subject** give up to 3 synonyms as separate values when the wording is uncertain (e.g. ["2. verdenskrig", "anden verdenskrig"], ["den kolde krig", "cold war"]). Values inside one clause are ORed.
8. Be minimal: add only the constraints the user actually asked for. Do not add specificmaterialtype="bog" unless the user said bog/bøger/book(s) or "noget at læse".
9. Ignore what cannot be searched (a specific library branch, "on the shelf", "the best", ratings). "Nyindkøbte" / "nyheder" → workyear > NOW - 12 MONTHS and mention it in \`note\`.
10. "af X" / "by X" → creator. "om X" / "about X" → subject. "oversat af / illustreret af / indlæst af / med (skuespiller)" → function with the Danish role word first. Exclusions ("men ikke", "uden", "not") → the same clause with negate=true.

## Fields

${fieldTable()}

## Operators and time

- op "=" for everything except numbers/years. Range ops (<, <=, >, >=, within) only on ages, pegi, mediacouncilagerestriction, lix, publicationyear, workyear, datefirstedition.
- within: exactly two values, e.g. ["2015", "2020"] or ["2000", "NOW"].
- NOW is the current year/date and is resolved by the server: "fra i år" → workyear = NOW · "nye"/"seneste"/"recent" → workyear > NOW - 12 MONTHS · "de seneste 5 år" → workyear > NOW - 60 MONTHS · "efter 2015" → publicationyear > 2015 · "før 1980" → publicationyear < 1980 · "fra 90'erne" → publicationyear within ["1990", "1999"] · a specific year → publicationyear = YYYY.
- Never insert a literal current date yourself.

## Controlled values (Danish) — use exactly these spellings when they fit

${vocabPreview(vocab)}

Language names: dansk, engelsk, tysk, fransk, spansk, italiensk, portugisisk, svensk, norsk, finsk, islandsk, nederlandsk (hollandsk), polsk, russisk, ukrainsk, arabisk, tyrkisk, persisk, kinesisk, japansk, koreansk.
Role words for function: forfatter, oversætter, illustrator, instruktør, skuespiller, indlæser, fotograf, komponist, redaktør.

## Examples

${examplesBlock()}

## Final reminders

- Exactly one call to ${TOOL_NAME}. No prose.
- Expand abbreviations, then map by meaning. Places → subject. Unsure → default.
- Controlled values in Danish, names exactly as written. Never correct names. Synonyms as multiple values. Exclusions via negate.`;
}

/**
 * Builds the message array for a chat completion. The system prompt is sent
 * as a content block with a cache_control marker so providers that support
 * prompt caching (Anthropic, Gemini via OpenRouter) reuse the static prefix.
 *
 * @param {string} prompt user text
 * @param {Object} [options]
 * @param {string} [options.systemPrompt]
 * @param {boolean} [options.cache]
 * @returns {Array}
 */
export function buildMessages(
  prompt,
  { systemPrompt = buildSystemPrompt(), cache = true } = {}
) {
  const system = cache
    ? {
        role: "system",
        content: [
          {
            type: "text",
            text: systemPrompt,
            cache_control: { type: "ephemeral" },
          },
        ],
      }
    : { role: "system", content: systemPrompt };

  return [system, { role: "user", content: prompt }];
}
