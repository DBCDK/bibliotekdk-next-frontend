import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { getDescription } from "../dummy.materialTypesApi";

import { Description, DescriptionSkeleton } from "./Description";

const exportedObject = {
  title: "work/Description",
};

export default exportedObject;

/**
 * Returns Description section
 *
 */
export function DescriptionSection() {
  const workId = "some-id";
  const abstract = getDescription({ workId });
  return (
    <div>
      <StoryTitle>Description section</StoryTitle>
      <StoryDescription>
        Work description component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />

      <Description data={abstract[workId]} />
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
      <DescriptionSkeleton />
    </div>
  );
}
