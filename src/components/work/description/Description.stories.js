import { StoryTitle, StoryDescription } from "../../base/storybook";

import Description from "./Description";

export default {
  title: "Description",
};

/**
 * Returns all primary buttons (Default button style)
 *
 */
export function DescriptionSection() {
  return (
    <div>
      <StoryTitle>Description section</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <Description />
    </div>
  );
}
