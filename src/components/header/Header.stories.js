import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { useState } from "react";
import Header from "./Header";

export default {
  title: "Header",
};

/**
 * Returns Header
 *
 */
export function NavHeader() {
  // Storybook handle suggester internal state (url params not working in storybook)
  const [suggesterVisibleMobile, setSuggesterVisibleMobile] = useState(false);

  const story = { suggesterVisibleMobile, setSuggesterVisibleMobile };

  return (
    <div>
      <StoryTitle>Header</StoryTitle>
      <StoryDescription>Full header component</StoryDescription>
      <Header story={story} />
    </div>
  );
}
