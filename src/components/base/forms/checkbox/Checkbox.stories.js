import { StoryTitle, StoryDescription } from "@/storybook";

import Checkbox from "./Checkbox";

export default {
  title: "base/Forms/Checkbox",
};

/**
 * Default input field
 *
 */
export function Default() {
  return (
    <div>
      <StoryTitle>Checkbox</StoryTitle>
      <StoryDescription>Checkbox default</StoryDescription>
      <Checkbox id="default" />
    </div>
  );
}
