//input indexes for materialtype "all"
const all = [
  { index: "term.default", placeholder: "all placeholder" },
  {
    index: "term.title",
    placeholder: "title placeholder",
  },
  {
    index: "term.creatorcontributor",
    placeholder: "creatorcontributor placeholder",
  },
  {
    index: "term.subject",
    placeholder: "subject placeholder",
  },
  {
    index: "term.publisher",
    placeholder: "publisher placeholder",
  },
  {
    index: "dk5",
  },
  {
    index: "term.isbn",
    placeholder: "isbn placeholder",
  },
  {
    index: "term.series",
    placeholder: "series placeholder",
  },
  {
    index: "term.fictionalcharacter",
    placeholder: "fictionalcharacter placeholder",
  },
  {
    index: "term.hostpublication",
  },
];

//input indexes for materialtype "literature"
const literature = [
  { index: "term.default", placeholder: "all placeholder" },
  { index: "term.title", placeholder: "title placeholder" },
  {
    index: "term.creatorcontributor",
    placeholder: "creatorcontributor placeholder",
    label: "literature_term.creatorcontributor",
  },
  {
    index: "term.contributor",
    placeholder: "contributor_books placeholder",
    label: "literature_term.contributor",
  },
  { index: "term.subject", placeholder: "subject placeholder" },
  {
    index: "term.publisher",
    placeholder: "publisher placeholder",
    label: "literature_term.publisher",
  },
  { index: "dk5", placeholder: "dk5 placeholder" },
  { index: "term.isbn", placeholder: "isbn placeholder" },
  {
    index: "term.series",
    placeholder: "series placeholder",
    label: "literature_term.series",
  },
  {
    index: "term.fictionalcharacter",
    placeholder: "fictionalcharacter placeholder",
    label: "literature_term.fictionalcharacter",
  },
];

//input indexes for materialtype "articles"
const article = [
  { index: "term.default", placeholder: "all placeholder" },
  { index: "term.title", placeholder: "title placeholder" },
  {
    index: "term.creatorcontributor",
    placeholder: "creatorcontributor placeholder",
    label: "literature_term.creatorcontributor",
  },
  { index: "term.contributor", placeholder: "contributor placeholder" },
  { index: "term.subject", placeholder: "subject placeholder" },
  { index: "term.hostpublication", placeholder: "hostPublication placeholder" },
  {
    index: "term.publisher",
    placeholder: "publisher placeholder",
    label: "article_term.publisher",
  },
  { index: "dk5", placeholder: "dk5 placeholder" },
  { index: "issn", placeholder: "issn placeholder" },
];

//input indexes for materialtype "movie"
const movie = [
  { index: "term.default", placeholder: "all placeholder" },
  { index: "term.title", placeholder: "title placeholder" },
  {
    index: "term.creatorcontributor",
    placeholder: "creatorcontributor placeholder",
    label: "movie_term.creatorcontributor",
  },
  { index: "term.subject", placeholder: "subject placeholder" },
  {
    index: "term.fictionalcharacter",
    placeholder: "fictionalcharacter placeholder",
    label: "movie_term.fictionalcharacter",
  },
  {
    index: "term.publisher",
    placeholder: "publisher placeholder",
    label: "movie_term.publisher",
  },
  { index: "dk5", placeholder: "dk5 placeholder" },
];

//input indexes for materialtype "music"
const music = [
  { index: "term.default", placeholder: "all placeholder" },
  { index: "term.title", placeholder: "title placeholder" },
  {
    index: "term.titlemanifestationpart",
    placeholder: "titleManifestationPart placeholder",
  },
  {
    index: "term.creator",
    placeholder: "creator placeholder",
    label: "music_term.creator",
  },
  {
    index: "term.contributor",
    placeholder: "contributor placeholder",
    label: "music_term.contributor",
  },
  {
    index: "term.publisher",
    placeholder: "publisher placeholder",
    label: "music_term.publisher",
  },
  // { index: "term.identifiers(?)", placeholder: "identifiers placeholder" },
];
//input indexes for materialtype "game"
const game = [
  { index: "term.default", placeholder: "default placeholder" },
  { index: "term.title", placeholder: "title placeholder" },
  {
    index: "term.creatorcontributor",
    placeholder: "creatorcontributor placeholder",
    label: "game_term.creatorcontributor",
  },
  { index: "term.contributor", placeholder: "contributor placeholder" },
  { index: "term.subject", placeholder: "subject placeholder" },
  {
    index: "term.publisher",
    label: "game_term.publisher",
  },
  { index: "dk5", placeholder: "dk5 placeholder" },
];

//input indexes for materialtype "sheetmusic"
const sheetmusic = [
  { index: "term.default", placeholder: "default placeholder" },
  {
    searchIndex: "term.creator",
    label: "sheetmusic_term.creator",
  },
  {
    searchIndex: "term.title",
    label: "sheetmusic_term.title",
  },
  {
    searchIndex: "term.titlemanifestationpart",
    label: "sheetmusic_term.titlemanifestationpart",
  },
];

/**
 * The indexes to be shown in dropdowns by materialtype. An index comes in the form:
 *  {
 *     index: "term.creator",
 *     placeholder: "creator placeholder",
 *     label: "music_term.creator",
 *  },
 *  By default the index is translated - if a label is added the label will overrule
 * @type {{all: [{index: string, placeholder: string},{index: string, placeholder: string},{index: string, placeholder: string},{index: string, placeholder: string},{index: string, placeholder: string},null,null,null,null,null], literature: [{index: string, placeholder: string},{index: string, placeholder: string},{index: string, placeholder: string, label: string},{index: string, placeholder: string, label: string},{index: string, placeholder: string},null,null,null,null,null], game: *[], music: [{index: string, placeholder: string},{index: string, placeholder: string},{index: string, placeholder: string},{index: string, placeholder: string, label: string},{index: string, placeholder: string},null,null], movie: [{index: string, placeholder: string},{index: string, placeholder: string},{index: string, placeholder: string, label: string},{index: string, placeholder: string},{index: string, placeholder: string, label: string},null,null], sheetmusic: *[], article: [{index: string, placeholder: string},{index: string, placeholder: string},{index: string, placeholder: string, label: string},{index: string, placeholder: string},{index: string, placeholder: string},null,null,null,null]}}
 */
const labels = {
  all,
  sheetmusic,
  literature,
  article,
  game,
  music,
  movie,
};

export default labels;
