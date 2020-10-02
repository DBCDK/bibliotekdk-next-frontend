import { StoryTitle, StoryDescription, StorySpace } from "../../base/storybook";

import Content from "./Content";

export default {
  title: "Work: Content",
};

/**
 * Returns Content section
 *
 */
export function ContentSection() {
  return (
    <div>
      <StoryTitle>Content section</StoryTitle>
      <StoryDescription>
        Work content component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Content workId={"some-id"} type={"Bog"} />
    </div>
  );
}

/**
 * Returns Loading content section
 *
 */
export function Loading() {
  return (
    <div>
      <StoryTitle>Content section</StoryTitle>
      <StoryDescription>Loading content component</StoryDescription>
      <StorySpace direction="v" space="8" />
      <Content skeleton />
    </div>
  );
}
