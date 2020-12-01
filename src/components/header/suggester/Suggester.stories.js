import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import Suggester from "./Suggester";

export default {
  title: "Suggester",
};

/**
 * Returns Suggester
 *
 */
export function HeaderSuggester() {
  return (
    <div>
      <Suggester />
    </div>
  );
}
