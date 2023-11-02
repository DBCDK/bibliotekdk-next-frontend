//input indexes for materialtype "all"
const all = [
  { index: "term.all", label: "all", placeholder: "all placeholder" },
  {
    index: "term.title",
    label: "title",
    placeholder: "title placeholder",
  },
  {
    index: "term.isbn",
    label: "isbn",
    placeholder: "isbn placeholder",
  },
  {
    index: "term.subject",
    label: "subject",
    placeholder: "subject placeholder",
  },
  {
    index: "term.publisher",
    label: "publisher",
    placeholder: "publisher placeholder",
  },
  {
    index: "term.contributor",
    label: "contributor",
    placeholder: "contributor placeholder",
  },
  {
    index: "term.series",
    label: "series",
    placeholder: "series placeholder",
  },
  {
    index: "term.function",
    label: "function",
    searchType: "field",
    placeholder: "function placeholder",
  },
];

//input indexes for materialtype "books"
const books = [];

//input indexes for materialtype "articles"
const articles = [];

//TODO: add the other material type
export default {
  all,
  books,
  articles,
};
