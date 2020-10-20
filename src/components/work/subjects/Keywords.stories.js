import { StoryTitle, StoryDescription, StorySpace } from "../../base/storybook";
import dummy_materialTypesApi from "../dummy.materialTypesApi";

import { Keywords, KeywordsSkeleton } from "./Keywords";

export default {
  title: "Work: Keywords",
};

/**
 * Returns Description section
 *
 */
export function DescriptionSection() {
  const workId = "some-id";
  const type = "Bog";
  const data = dummy_materialTypesApi({ workId, type });

  console.log("data", data[workId].subjects);

  return (
    <div>
      <StoryTitle>Keywords section</StoryTitle>
      <StoryDescription>
        Work keywords component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />

      <Keywords data={data[workId].subjects} type={type} />
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
      <StoryTitle>Keywords section</StoryTitle>
      <StoryDescription>Loading keywords component</StoryDescription>
      <StorySpace direction="v" space="8" />
      <KeywordsSkeleton />
    </div>
  );
}
