/**
 * @file
 * Registry of the CQL fields the AI search (v3) may use.
 *
 * The LLM emits *field names without family prefix* (e.g. "creator",
 * "genreandform", "publicationyear"). The compiler decides whether the field
 * becomes `term.<field>`, `phrase.<field>` or a bare index, based on the
 * field kind and on whether the value resolved against a controlled vocabulary.
 *
 * Source of truth for index names, formats and operators:
 * https://fbi-api.dbc.dk/indexmapper/
 */

export const KIND = Object.freeze({
  /** Bare quoted term in the default index */
  DEFAULT: "default",
  /** Open, tokenized text: names, subjects, titles → term.<field> */
  TEXT: "text",
  /** Closed Danish vocabulary → phrase.<field> when the value is known */
  CONTROLLED: "controlled",
  /** Small fixed set of values listed inline */
  ENUM: "enum",
  /** YYYY or NOW arithmetic, range operators allowed */
  YEAR: "year",
  /** Integer, range operators allowed */
  NUMBER: "number",
  /** true / false */
  BOOLEAN: "boolean",
  /** ISBN, ISSN, DK5 – copied verbatim */
  IDENTIFIER: "identifier",
});

export const EQ_OPS = Object.freeze(["="]);
export const RANGE_OPS = Object.freeze(["=", "<", "<=", ">", ">=", "within"]);

/**
 * Field aliases the model (or a human) might use → canonical field name.
 * Prefixes `term.` / `phrase.` are stripped before this lookup.
 */
export const FIELD_ALIASES = Object.freeze({
  "": "default",
  any: "default",
  all: "default",
  text: "default",
  freetext: "default",
  query: "default",
  author: "creator",
  artist: "creator",
  director: "creator",
  actor: "contributor",
  narrator: "contributor",
  translator: "contributor",
  illustrator: "contributor",
  creatorfunction: "function",
  contributorfunction: "function",
  creatorcontributorfunction: "function",
  role: "function",
  topic: "subject",
  place: "subject",
  location: "subject",
  maintitle: "title",
  genre: "genreandform",
  genreform: "genreandform",
  form: "genreandform",
  audiencegeneral: "generalaudience",
  audience: "childrenoradults",
  materialtype: "specificmaterialtype",
  type: "specificmaterialtype",
  format: "specificmaterialtype",
  language: "language",
  lang: "language",
  year: "publicationyear",
  published: "publicationyear",
  age: "ages",
  platform: "gameplatform",
  nationality: "filmnationality",
  imprint: "publisher",
  label: "publisher",
});

/**
 * @typedef {Object} FieldDef
 * @property {string} kind One of KIND
 * @property {string[]} families Which CQL families exist for this field: "term", "phrase", "bare"
 * @property {string[]} ops Allowed relations
 * @property {string} doc Short description used in the system prompt
 * @property {string} [example] Example value shown in the prompt
 * @property {string} [vocab] Key into vocab.json (controlled fields)
 * @property {string} [unresolved] Where a value goes when it is NOT in the (trusted) vocabulary: another field name or "default"
 * @property {string[]} [values] Legal values (enum fields)
 * @property {boolean} [unquoted] Emit the value without quotes (enum/boolean bare indexes)
 * @property {Object<string,string>} [aliases] Value aliases (enum fields)
 */

/** @type {Object<string, FieldDef>} */
export const FIELDS = Object.freeze({
  default: {
    kind: KIND.DEFAULT,
    families: [],
    ops: EQ_OPS,
    doc: "Free text searched in the default index (title, creator, subject, notes, material type, host publication, ISBN). Use when you are not sure which field a word belongs to.",
    example: "bæredygtighed",
  },

  // ---- People -------------------------------------------------------------
  creator: {
    kind: KIND.TEXT,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    doc: 'Author, artist, composer, director ("af X", "by X"). Keep the name exactly as written; never correct or complete it.',
    example: "kim leine",
  },
  contributor: {
    kind: KIND.TEXT,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    doc: "Actor, translator, narrator, illustrator, musician.",
    example: "charlie chaplin",
  },
  creatorcontributor: {
    kind: KIND.TEXT,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    doc: "A person who may be either creator or contributor (unknown role).",
    example: "chaplin",
  },
  function: {
    kind: KIND.TEXT,
    families: ["term"],
    ops: EQ_OPS,
    doc: 'Role + name in ONE value, Danish role word first: "oversætter rane knudsen", "illustrator ...", "skuespiller ...", "indlæser ...". Use for "oversat af", "illustreret af", "indlæst af", "med <skuespiller>".',
    example: "oversætter rane knudsen",
  },

  // ---- What ----------------------------------------------------------------
  subject: {
    kind: KIND.TEXT,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    doc: 'Topic ("om X") AND place names ("i københavn", "der foregår i paris"). Danish wording. Give common synonyms as extra values, e.g. ["2. verdenskrig", "anden verdenskrig"].',
    example: "kunstig intelligens",
  },
  title: {
    kind: KIND.TEXT,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    doc: 'Words in a title. ONLY when the user clearly refers to a title (quotes, "der hedder", "med titlen", "har I <kendt titel>"). Drop stopwords (fra, i, og, the, of, a).',
    example: "profeterne evighedsfjorden",
  },
  series: {
    kind: KIND.TEXT,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    doc: "Series or universe name.",
    example: "harry potter",
  },
  fictionalcharacter: {
    kind: KIND.TEXT,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    doc: "Fictional character.",
    example: "sherlock holmes",
  },
  publisher: {
    kind: KIND.TEXT,
    families: ["term"],
    ops: EQ_OPS,
    doc: "Publisher or record label.",
    example: "gyldendal",
  },
  hostpublication: {
    kind: KIND.TEXT,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    doc: "Newspaper or journal an article appeared in.",
    example: "information",
  },
  isbn: {
    kind: KIND.IDENTIFIER,
    families: ["term"],
    ops: EQ_OPS,
    doc: "ISBN, with or without hyphens.",
    example: "9788763860888",
  },
  issn: {
    kind: KIND.IDENTIFIER,
    families: ["term"],
    ops: EQ_OPS,
    doc: "ISSN of a journal or article.",
    example: "0106-4622",
  },
  dk5: {
    kind: KIND.IDENTIFIER,
    families: ["bare"],
    ops: EQ_OPS,
    doc: "DK5 classification code, only when the user gives one.",
    example: "85",
  },

  // ---- Literary descriptors (controlled, Danish) ----------------------------
  genreandform: {
    kind: KIND.CONTROLLED,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    vocab: "genreandform",
    doc: 'Genre or form. Danish, use the listed form (plural for most: "romaner", "noveller", "biografier", "tegneserier"; but "krimi", "fantasy", "science fiction", "digte").',
    example: "krimi",
  },
  mood: {
    kind: KIND.CONTROLLED,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    vocab: "mood",
    unresolved: "default",
    doc: "Mood of literature (Danish adjective from the list below).",
    example: "uhyggelig",
  },
  setting: {
    kind: KIND.CONTROLLED,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    vocab: "setting",
    unresolved: "subject",
    doc: 'TYPE of milieu from the list below, never a place name: "storbyen", "provinsen", "naturen", "overklassen", "historisk", "futuristisk". A city, region or country goes to subject.',
    example: "storbyen",
  },
  narrativetechnique: {
    kind: KIND.CONTROLLED,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    vocab: "narrativetechnique",
    unresolved: "default",
    doc: 'Narrative technique: "jeg-fortæller", "flere fortællere", "brevroman".',
    example: "jeg-fortæller",
  },
  childrentopic: {
    kind: KIND.TEXT,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    doc: 'Children\'s literature topic: "venskaber", "samfundet", "ud i fremtiden".',
    example: "venskaber",
  },

  // ---- Material --------------------------------------------------------------
  generalmaterialtype: {
    kind: KIND.CONTROLLED,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    vocab: "generalmaterialtype",
    doc: 'Broad material type, Danish plural: "bøger", "e-bøger", "lydbøger", "film", "musik", "computerspil", "artikler", "noder", "tegneserier".',
    example: "film",
  },
  specificmaterialtype: {
    kind: KIND.CONTROLLED,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    vocab: "specificmaterialtype",
    doc: 'Specific material type, Danish singular: "bog", "e-bog", "lydbog", "billedbog", "tegneserie", "artikel", "film (dvd)", "musik (cd)". Prefer this over generalmaterialtype for "bog"/"lydbog"/"e-bog".',
    example: "bog",
  },
  worktype: {
    kind: KIND.ENUM,
    families: ["bare"],
    ops: EQ_OPS,
    unquoted: true,
    values: [
      "literature",
      "article",
      "movie",
      "music",
      "game",
      "sheetmusic",
      "periodica",
      "analysis",
      "portrait",
      "review",
      "map",
      "other",
    ],
    aliases: {
      book: "literature",
      books: "literature",
      bog: "literature",
      bøger: "literature",
      litteratur: "literature",
      film: "movie",
      movies: "movie",
      musik: "music",
      spil: "game",
      games: "game",
      computerspil: "game",
      noder: "sheetmusic",
      artikel: "article",
      artikler: "article",
      articles: "article",
      tidsskrift: "periodica",
      tidsskrifter: "periodica",
    },
    doc: "Overall work type (English enum). Use for films/music/games when no specific material type is given.",
    example: "movie",
  },
  fictionnonfiction: {
    kind: KIND.ENUM,
    families: ["term"],
    ops: EQ_OPS,
    values: ["fiction", "nonfiction"],
    aliases: {
      skønlitteratur: "fiction",
      faglitteratur: "nonfiction",
      "non-fiction": "nonfiction",
      fakta: "nonfiction",
    },
    doc: '"fiction" or "nonfiction" (skønlitteratur / faglitteratur).',
    example: "nonfiction",
  },
  accesstype: {
    kind: KIND.ENUM,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    values: ["fysisk", "online"],
    aliases: {
      physical: "fysisk",
      digital: "online",
      digitalt: "online",
      "e-": "online",
    },
    doc: '"fysisk" or "online".',
    example: "online",
  },
  canalwaysbeloaned: {
    kind: KIND.BOOLEAN,
    families: ["term"],
    ops: EQ_OPS,
    doc: "true when the user wants e-materials that are always available (no queue) on eReolen/netlydbog.",
    example: "true",
  },

  // ---- Language ---------------------------------------------------------------
  mainlanguage: {
    kind: KIND.CONTROLLED,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    vocab: "mainlanguage",
    doc: 'Primary language of books, Danish language name: "engelsk", "tysk", "dansk".',
    example: "engelsk",
  },
  spokenlanguage: {
    kind: KIND.CONTROLLED,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    vocab: "spokenlanguage",
    doc: "Spoken language of films (Danish language name).",
    example: "tysk",
  },
  subtitlelanguage: {
    kind: KIND.CONTROLLED,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    vocab: "subtitlelanguage",
    doc: "Subtitle language of films (Danish language name).",
    example: "dansk",
  },
  language: {
    kind: KIND.CONTROLLED,
    families: ["phrase"],
    ops: EQ_OPS,
    vocab: "language",
    doc: 'Any language (main, spoken or subtitles). Use for "på engelsk" when the material type is unknown.',
    example: "engelsk",
  },

  // ---- Audience ---------------------------------------------------------------
  childrenoradults: {
    kind: KIND.ENUM,
    families: ["term"],
    ops: EQ_OPS,
    values: ["til børn", "til voksne"],
    aliases: {
      børn: "til børn",
      children: "til børn",
      kids: "til børn",
      "for børn": "til børn",
      voksne: "til voksne",
      adults: "til voksne",
      "for voksne": "til voksne",
    },
    doc: '"til børn" or "til voksne".',
    example: "til børn",
  },
  schooluse: {
    kind: KIND.ENUM,
    families: ["term"],
    ops: EQ_OPS,
    values: ["til skolebrug", "til læreren"],
    aliases: {
      skolebrug: "til skolebrug",
      undervisning: "til skolebrug",
      lærer: "til læreren",
      læreren: "til læreren",
    },
    doc: '"til skolebrug" or "til læreren".',
    example: "til skolebrug",
  },
  generalaudience: {
    kind: KIND.CONTROLLED,
    families: ["phrase"],
    ops: EQ_OPS,
    vocab: "generalaudience",
    doc: 'Intended audience phrase: "let at læse" (letlæst), "for ordblinde", "for læsesvage".',
    example: "let at læse",
  },
  primarytarget: {
    kind: KIND.CONTROLLED,
    families: ["phrase"],
    ops: EQ_OPS,
    vocab: "primarytarget",
    doc: 'Educational level: "folkeskoleniveau", "gymnasieniveau", "alment niveau".',
    example: "folkeskoleniveau",
  },
  libraryrecommendation: {
    kind: KIND.CONTROLLED,
    families: ["phrase"],
    ops: EQ_OPS,
    vocab: "libraryrecommendation",
    doc: 'Recommended from-age phrase: "fra 7 år". Prefer ages for a specific age.',
    example: "fra 7 år",
  },
  ages: {
    kind: KIND.NUMBER,
    families: ["bare"],
    ops: RANGE_OPS,
    doc: 'Suggested reader age. "for en 5-årig" → ages = 5. Range: within "3 5".',
    example: "5",
  },
  pegi: {
    kind: KIND.NUMBER,
    families: ["bare"],
    ops: RANGE_OPS,
    doc: 'PEGI minimum age of games. "ok for en 7-årig" → pegi <= 7.',
    example: "7",
  },
  mediacouncilagerestriction: {
    kind: KIND.NUMBER,
    families: ["bare"],
    ops: RANGE_OPS,
    doc: "Film age rating from Medierådet (7, 11, 15).",
    example: "11",
  },
  lix: {
    kind: KIND.NUMBER,
    families: ["bare"],
    ops: RANGE_OPS,
    doc: "Readability index (lix), only when the user mentions lix.",
    example: "20",
  },

  // ---- Film / games / music ----------------------------------------------------
  filmnationality: {
    kind: KIND.CONTROLLED,
    families: ["phrase"],
    ops: EQ_OPS,
    vocab: "filmnationality",
    doc: 'Nationality of films as "<nationalitet i flertal> film": "franske film", "danske film", "amerikanske film".',
    example: "franske film",
  },
  gameplatform: {
    kind: KIND.CONTROLLED,
    families: ["term", "phrase"],
    ops: EQ_OPS,
    vocab: "gameplatform",
    doc: 'Gaming platform: "playstation 5", "xbox one", "nintendo switch", "pc".',
    example: "playstation 5",
  },
  players: {
    kind: KIND.CONTROLLED,
    families: ["phrase"],
    ops: EQ_OPS,
    vocab: "players",
    doc: 'Number of players for games as "for N spillere".',
    example: "for 2 spillere",
  },
  instrument: {
    kind: KIND.CONTROLLED,
    families: ["phrase"],
    ops: EQ_OPS,
    vocab: "instrument",
    doc: "Instrument for sheet music (Danish).",
    example: "guitar",
  },

  // ---- Time ---------------------------------------------------------------------
  publicationyear: {
    kind: KIND.YEAR,
    families: ["bare"],
    ops: RANGE_OPS,
    doc: 'Publication year of any edition. "fra 90\'erne" → within "1990 1999"; "efter 2015" → > 2015.',
    example: "2020",
  },
  workyear: {
    kind: KIND.YEAR,
    families: ["bare"],
    ops: RANGE_OPS,
    doc: 'Year the work first appeared. "fra i år" → = NOW; "nye"/"seneste" → > NOW - 12 MONTHS. Also use for "nyindkøbte"/"nyheder" (acquisition date is not searchable).',
    example: "NOW",
  },
  datefirstedition: {
    kind: KIND.YEAR,
    families: ["bare"],
    ops: RANGE_OPS,
    doc: "Year of the first edition. Rarely needed; prefer workyear.",
    example: "2010",
  },
});

export const FIELD_NAMES = Object.freeze(Object.keys(FIELDS));

/**
 * Normalizes a field name from the model to a canonical key in the registry.
 * Returns null when the field is unknown.
 *
 * Later route versions may narrow the registry (see src/lib/aiCql/v4/indexes.js);
 * without options this is the v3 registry.
 *
 * @param {string} raw
 * @param {Object} [options]
 * @param {Object} [options.fields] field registry (default FIELDS)
 * @param {Object} [options.aliases] alias table (default FIELD_ALIASES)
 * @returns {string|null}
 */
export function normalizeFieldName(
  raw,
  { fields = FIELDS, aliases = FIELD_ALIASES } = {}
) {
  let name = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/^(term|phrase|facet)\./, "");

  if (name in aliases) {
    name = aliases[name];
  }
  return name in fields ? name : null;
}
