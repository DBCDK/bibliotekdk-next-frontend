import { StoryTitle, StoryDescription, StorySpace } from "../../base/storybook";

import Description from "./Description";

export default {
  title: "Work: Description",
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
        Work description component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Description workId={"some-id"} type={"Bog"} />
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
      <StorySpace direction="v" space="8" />
      <Description skeleton />
    </div>
  );
}
