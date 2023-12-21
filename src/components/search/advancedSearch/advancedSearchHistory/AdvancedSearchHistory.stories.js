import { StoryTitle, StoryDescription } from "@/storybook";

import { AdvancedSearchHistory } from "./AdvancedSearchHistory";

const exportedObject = {
  title: "search/avanceret/searchHistory",
};

export default exportedObject;

export function Default() {
  return (
    <div>
      <StoryTitle>Advanced Search History</StoryTitle>
      <StoryDescription>Search history</StoryDescription>
      <AdvancedSearchHistory />
    </div>
  );
}

Default.loaders = [
  () => {
    window.sessionStorage.setItem(
      "advanced-search-history",
      JSON.stringify([
        {
          hitcount: 80,
          fieldSearch: {
            inputFields: [
              {
                value: "Sissel-Jo Gazan",
                prefixLogicalOperator: null,
                searchIndex: "term.function",
              },
            ],
            dropdownSearchIndices: [
              {
                searchIndex: "phrase.mainlanguage",
                value: [],
              },
              {
                searchIndex: "phrase.generalmaterialtype",
                value: [],
              },
            ],
          },
          cql: '(term.function="Sissel-Jo Gazan")',
          timestamp: "11:45",
        },
        {
          hitcount: 16,
          fieldSearch: {
            inputFields: [
              {
                value: "Jesper Tolstrup",
                prefixLogicalOperator: null,
                searchIndex: "term.function",
              },
              {
                value: "heste",
                prefixLogicalOperator: "AND",
                searchIndex: "term.subject",
              },
            ],
            dropdownSearchIndices: [
              {
                searchIndex: "phrase.mainlanguage",
                value: [],
              },
              {
                searchIndex: "phrase.generalmaterialtype",
                value: [],
              },
            ],
          },
          cql: '(term.function="Jesper Tolstrup" AND term.subject="heste")',
          timestamp: "10.36",
        },
        {
          hitcount: 88,
          fieldSearch: {
            inputFields: [
              {
                value: "Tammi Øst",
                prefixLogicalOperator: null,
                searchIndex: "term.contributor",
              },
            ],
            dropdownSearchIndices: [
              {
                searchIndex: "phrase.mainlanguage",
                value: [],
              },
              {
                searchIndex: "phrase.generalmaterialtype",
                value: [],
              },
            ],
          },
          cql: '(term.contributor="Tammi Øst")',
          timestamp: "11:44",
        },
      ])
    );
  },
];

Default.story = {
  nextRouter: {
    showInfo: true,
    pathname: "/avanceret",
    query: { cql: "Harry potter" },
  },
};
