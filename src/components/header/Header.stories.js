import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import Header from "./Header";

export default {
  title: "Header",
};

/**
 * Returns Header
 *
 */
export function NavHeader() {
  return (
    <div>
      <Header isStory={true} />
    </div>
  );
}
