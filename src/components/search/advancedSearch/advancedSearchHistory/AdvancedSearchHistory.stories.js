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
    window.localStorage.setItem(
      "advanced-search-history",
      JSON.stringify([
        {
          hitcount: 11,
          fieldSearch: {
            inputFields: [
              {
                value: "Malene Sølvsten",
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
          cql: '(term.function="Malene Sølvsten")',
          timestamp: "Nov 30, 2023",
        },
        {
          hitcount: 700,
          fieldSearch: {
            inputFields: [
              {
                value: "parallelle verdener",
                prefixLogicalOperator: null,
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
          cql: '(term.subject="parallelle verdener")',
          timestamp: "Nov 30, 2023",
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
