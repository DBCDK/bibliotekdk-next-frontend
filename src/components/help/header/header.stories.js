import { StoryTitle, StoryDescription } from "@/storybook";
import { useState } from "react";

import { Header } from "./Header";

const exportedObject = {
  title: "Help/Header",
};

export default exportedObject;

/**
 * Returns Header
 *
 */
export function NavHeaderExpanded() {
  const [query, setQuery] = useState("");
  return (
    <div style={{ height: 500 }}>
      <StoryTitle>Help header</StoryTitle>
      <StoryDescription>
        Header from the help pages with expanded title and input
      </StoryDescription>
      <Header
        expanded={true}
        query={query}
        onQueryChange={(q) => setQuery(q)}
        onQueryClear={() => setQuery("")}
      />
    </div>
  );
}

export function NavHeaderNonExpanded() {
  const [query, setQuery] = useState("");
  return (
    <div style={{ height: 500 }}>
      <StoryTitle>Help header</StoryTitle>
      <StoryDescription>
        Header from the help pages with non expanded title and input
      </StoryDescription>
      <Header
        expanded={false}
        query={query}
        onQueryChange={(q) => setQuery(q)}
        onQueryClear={() => setQuery("")}
      />
    </div>
  );
}
