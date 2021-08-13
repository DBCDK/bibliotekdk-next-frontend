import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import dummy_materialTypesApi from "../dummy.materialTypesApi";
import { Details, DetailsSkeleton } from "./Details";

export default {
  title: "work/Details",
};

/**
 * Returns details section
 *
 */
export function DetailsSection() {
  const workId = "some-id";
  const type = "Bog";
  const data = dummy_materialTypesApi({ workId, type });
  const allsubjects = data[workId]?.subjects;
  return (
    <div>
      <StoryTitle>Detials section</StoryTitle>
      <StoryDescription>
        Work details component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Details data={data[workId]} allsubjects={allsubjects} />
    </div>
  );
}

/**
 * Returns loading details section
 *
 */
export function Loading() {
  return (
    <div>
      <StoryTitle>Detials section</StoryTitle>
      <StoryDescription>Loading details component</StoryDescription>
      <StorySpace direction="v" space="8" />
      <DetailsSkeleton />
    </div>
  );
}
