import { StoryTitle, StoryDescription } from "../../base/storybook";

import Description from "./Description";

export default {
  title: "Description",
};

/**
 * Returns Description section
 *
 */
export function DescriptionSection() {
  return (
    <div>
      <StoryTitle>Description section</StoryTitle>
      <StoryDescription>
        Work description component. Section component is used for layout.
      </StoryDescription>
      <Description />
    </div>
  );
}

/**
 * Returns Loading description section
 *
 */
export function Loading() {
  return (
    <div>
      <StoryTitle>Description section</StoryTitle>
      <StoryDescription>Loading description component</StoryDescription>
      <Description skeleton />
    </div>
  );
}
