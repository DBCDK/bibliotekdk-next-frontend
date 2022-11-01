import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { getSubjectsDbcVerified } from "../dummy.materialTypesApi";

import { Keywords, KeywordsSkeleton } from "./Keywords";
import { uniqueEntries } from "@/lib/utils";

const exportedObject = {
  title: "work/Keywords",
};

export default exportedObject;

/**
 * Returns Keyword section
 *
 */
export function KeywordsSection() {
  const workId = "some-id";
  const data = getSubjectsDbcVerified({ workId });
  const uniqueSubjects = uniqueEntries(data[workId]);

  return (
    <div>
      <StoryTitle>Keywords section</StoryTitle>
      <StoryDescription>
        Work keywords component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Keywords data={uniqueSubjects} />
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
