import { StoryTitle, StoryDescription } from "@/storybook";

import Checkbox from "./Checkbox";

const exportedObject = {
  title: "base/Forms/Checkbox",
};

export default exportedObject;

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
