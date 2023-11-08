//input indexes for materialtype "all"
const all = [
  { index: "term.default", placeholder: "all placeholder" },
  {
    index: "term.title",
    placeholder: "title placeholder",
  },
  {
    index: "term.isbn",
    placeholder: "isbn placeholder",
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
    index: "term.contributor",
    placeholder: "contributor placeholder",
  },
  {
    index: "term.series",
    placeholder: "series placeholder",
  },
  {
    index: "term.function",
    searchType: "field",
    placeholder: "function placeholder",
  },
];

//input indexes for materialtype "books"
const books = [];

//input indexes for materialtype "articles"
const articles = [];

//TODO: add the other material types
const labels = {
  all,
  books,
  articles,
};

export default labels;