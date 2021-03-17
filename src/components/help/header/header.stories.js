import { StoryTitle, StoryDescription } from "@/storybook";

import { Header } from "./Header";

export default {
  title: "Help/Header",
};

/**
 * Returns Header
 *
 */
export function NavHeaderExpanded() {
  return (
    <div style={{ height: 500 }}>
      <StoryTitle>Help header</StoryTitle>
      <StoryDescription>
        Header from the help pages with expanded title and input
      </StoryDescription>
      <Header expanded={true} />
    </div>
  );
}

export function NavHeaderNonExpanded() {
  return (
    <div style={{ height: 500 }}>
      <StoryTitle>Help header</StoryTitle>
      <StoryDescription>
        Header from the help pages with non expanded title and input
      </StoryDescription>
      <Header expanded={false} q />
    </div>
  );
}
