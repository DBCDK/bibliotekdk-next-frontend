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
  },
  { index: "term.contributor", placeholder: "contributor placeholder" },
  { index: "term.subject", placeholder: "subject placeholder" },
  { index: "term.publisher", placeholder: "publisher placeholder" },
  { index: "dk5", placeholder: "dk5 placeholder" },
  { index: "term.isbn", placeholder: "isbn placeholder" },
  { index: "term.series", placeholder: "series placeholder" },
  {
    index: "term.fictionalcharacter",
    placeholder: "fictionalcharacter placeholder",
  },
];

//input indexes for materialtype "articles"
const article = [
  { index: "term.default", placeholder: "all placeholder" },
  { index: "term.title", placeholder: "title placeholder" },
  {
    index: "term.creatorcontributor",
    placeholder: "creatorcontributor placeholder",
  },
  { index: "term.contributor", placeholder: "contributor placeholder" },
  { index: "term.subject", placeholder: "subject placeholder" },
  { index: "term.hostPublication", placeholder: "hostPublication placeholder" },
  { index: "term.publisher", placeholder: "publisher placeholder" },
  { index: "dk5", placeholder: "dk5 placeholder" },
  { index: "issn", placeholder: "issn placeholder" },
];

//input indexes for materialtype "sheetmusic"
const sheetmusic = [];

//input indexes for materialtype "game"
const game = [];

//input indexes for materialtype "music"
const music = [];

//input indexes for materialtype "movie"
const movie = [];

//TODO: add the other material types
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
