import { StoryTitle, StoryDescription } from "@/storybook";

import { Header } from "./Header";

export default {
  title: "Help/Header",
};

/**
 * Returns Header
 *
 */
export function NavHeader() {
  return (
    <div>
      <StoryTitle>Help header</StoryTitle>
      <StoryDescription>Header from the help pages</StoryDescription>
      <Header />
    </div>
  );
}
