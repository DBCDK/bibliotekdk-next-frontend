/**
 * @file
 * System prompt and tool definition for AI search v4.
 *
 * Same shape as the v3 prompt (a large static prefix so provider-side prompt
 * caching makes it cheap), but built from the narrower v4 field registry and
 * written for the v4 pipeline: every open-vocabulary value the model produces
 * is afterwards looked up in the catalogue with the FBI-API suggester
 * (src/lib/aiCql/v4/suggest.js), so the model is told to write one natural
 * value per clause instead of hedging with synonyms.
 */

import { fieldTable, vocabPreview } from "../prompt";
import { FIELDS, FIELD_NAMES } from "./indexes";
import { SUGGESTED_FIELDS } from "./suggestFields";

export const TOOL_NAME = "build_query";

/**
 * JSON schema for the query AST. Identical to v3 apart from the field enum,
 * which is the v4 registry.
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
                  enum: [...FIELD_NAMES],
                  description:
                    'Which field to search. Use "default" when unsure. Every person is "creatorcontributor".',
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
                    'One or more values. Several values are ORed. Use a single value for names, titles, series, publishers and characters. For op "within" give exactly two bounds, e.g. ["2015", "2020"].',
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
 * Gold examples: user text → AST. Same catalogue behaviour as the v3 examples
 * (place names are subjects, acquisition date is not searchable …), but every
 * person goes to creatorcontributor and names are written plainly – the
 * suggester step corrects the spelling afterwards.
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
        { field: "creatorcontributor", op: "=", values: ["kim leine"] },
        { field: "specificmaterialtype", op: "=", values: ["bog"] },
      ],
    },
  },
  {
    user: "har I profeterne fra evighedsfjorden af kim leine?",
    ast: {
      clauses: [
        { field: "title", op: "=", values: ["profeterne evighedsfjorden"] },
        { field: "creatorcontributor", op: "=", values: ["kim leine"] },
      ],
    },
  },
  {
    user: "lydbøger af jusi adler olsen om ww2",
    ast: {
      clauses: [
        { field: "creatorcontributor", op: "=", values: ["jusi adler olsen"] },
        { field: "subject", op: "=", values: ["2. verdenskrig"] },
        { field: "specificmaterialtype", op: "=", values: ["lydbog"] },
      ],
    },
  },
  {
    user: "film med charlie chaplin",
    ast: {
      clauses: [
        { field: "creatorcontributor", op: "=", values: ["charlie chaplin"] },
        { field: "worktype", op: "=", values: ["movie"] },
      ],
    },
  },
  {
    user: "noget om ai",
    ast: {
      clauses: [{ field: "subject", op: "=", values: ["kunstig intelligens"] }],
    },
  },
  {
    user: "books about the cold war in english",
    ast: {
      clauses: [
        { field: "subject", op: "=", values: ["den kolde krig"] },
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
        { field: "creatorcontributor", op: "=", values: ["murakami"] },
        { field: "specificmaterialtype", op: "=", values: ["bog", "lydbog"] },
      ],
    },
  },
  {
    user: "harry potter på engelsk",
    ast: {
      clauses: [
        { field: "series", op: "=", values: ["harry potter"] },
        { field: "language", op: "=", values: ["engelsk"] },
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
        { field: "creatorcontributor", op: "=", values: ["stephen king"] },
        { field: "specificmaterialtype", op: "=", values: ["bog"] },
        { field: "publicationyear", op: "within", values: ["1990", "1999"] },
        { field: "genreandform", op: "=", values: ["gys"], negate: true },
      ],
    },
  },
];

function examplesBlock() {
  return EXAMPLES.map(
    (ex) => `User: ${ex.user}\n${TOOL_NAME}: ${JSON.stringify(ex.ast)}`
  ).join("\n\n");
}

/**
 * Builds the full v4 system prompt.
 *
 * @param {Object} [options]
 * @param {Object} [options.vocab] vocab.json-shaped object (tests)
 * @returns {string}
 */
export function buildSystemPrompt({ vocab } = {}) {
  const suggested = SUGGESTED_FIELDS.join(", ");

  return `# Natural language → library search query (bibliotek.dk / FBI-API)

You translate ONE user request (Danish or English) into ONE structured search query by calling the tool \`${TOOL_NAME}\`. The server compiles your structure into CQL, so you never write CQL syntax yourself. Never answer the question, never ask back, never refuse — always call the tool once.

## How to think

1. Expand abbreviations and informal forms to full Danish: kbh → københavn · dk → danmark · ww2 / 2. vk → 2. verdenskrig · sci-fi → science fiction · ai → kunstig intelligens · ps5 → playstation 5.
2. Decide what each word IS: a person, a topic, a place, a title, a genre, a material type, an audience, a language, a time. Map by meaning, never by word order.
3. **Every person is \`creatorcontributor\`** — author, director, artist, composer, actor, narrator, illustrator, translator. There is no separate creator/contributor field: never guess the role. Only use \`function\` when the user names the role explicitly ("oversat af", "illustreret af", "indlæst af").
4. Place names ("i københavn", "der foregår i paris", "fra grønland") go to **subject**, never to setting. The field **setting** is only for TYPES of milieu and only with a value from the list below ("storbyen", "provinsen", "overklassen", "historisk"); the same goes for **mood**. If the word is not in the list, use subject.
5. Use **title** ONLY when the user clearly refers to a title (quotes, "der hedder", "med titlen", "har I <kendt titel>"). Remove stopwords from the title words (fra, i, og, the, of, a).
6. When you are not confident which field a word belongs to, use **default**. A bare term in the default index is always better than a wrong field.
7. The server looks every value for ${suggested} up in the catalogue and replaces it with the closest real catalogue value. So write ONE natural value per clause — do not add spelling variants, do not complete a half-remembered name, and do not translate a person's name. Translate everything else — subjects, genres, material types, languages, audiences — into Danish.
8. Only for **subject** you may give a second value when the Danish wording is genuinely uncertain (e.g. ["2. verdenskrig", "anden verdenskrig"]). Values inside one clause are ORed. Never more than two.
9. Be minimal: add only the constraints the user actually asked for. Do not add specificmaterialtype="bog" unless the user said bog/bøger/book(s) or "noget at læse".
10. Ignore what cannot be searched (a specific library branch, "on the shelf", "the best", ratings). "Nyindkøbte" / "nyheder" → workyear > NOW - 12 MONTHS and mention it in \`note\`.
11. "af X" / "by X" / "med X" → creatorcontributor. "om X" / "about X" → subject. Exclusions ("men ikke", "uden", "not") → the same clause with negate=true.

## Fields

${fieldTable(FIELDS)}

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
- Every person → creatorcontributor. Places → subject. Unsure → default.
- One value per clause for names, titles, series, publishers and characters; the server matches them against the catalogue. Controlled values in Danish. Exclusions via negate.`;
}

/**
 * Builds the message array for a chat completion, with a cache_control marker
 * on the static system prompt.
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
