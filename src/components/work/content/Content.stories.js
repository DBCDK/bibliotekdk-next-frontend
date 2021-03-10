import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import dummy_materialTypesApi from "../dummy.materialTypesApi";

import { Content, ContentSkeleton } from "./Content";

export default {
  title: "work/Content",
};

/**
 * Returns Content section
 *
 */
export function ContentSection() {
  const workId = "some-id";
  const type = "Bog";
  const data = dummy_materialTypesApi({ workId, type });
  return (
    <div>
      <StoryTitle>Content section</StoryTitle>
      <StoryDescription>
        Work content component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Content data={data[workId]} />
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
      <ContentSkeleton />
    </div>
  );
}
