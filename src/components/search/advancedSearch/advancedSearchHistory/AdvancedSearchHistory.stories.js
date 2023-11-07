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
          hitcount: 2433,
          cql: "title=harry NOT potter",
        },
        {
          hitcount: 900,
          cql: "title=harry AND potter",
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
