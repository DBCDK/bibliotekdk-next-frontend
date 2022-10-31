import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import dummy_materialTypesApi from "../dummy.materialTypesApi";
import { Details, DetailsSkeleton } from "./Details";

const dummyDetails = require("../dummy.detailsApi.json");

const exportedObject = {
  title: "work/Details",
};

export default exportedObject;

/**
 * Returns details section
 *
 */
export function DetailsSection() {
  const workId = "some-id";
  const type = "Bog";
  const dummy = dummyDetails;

  const genreAndForm = dummy.genreAndForm || [];
  return (
    <div>
      <StoryTitle>Detials section</StoryTitle>
      <StoryDescription>
        Work details component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Details data={dummy} genreAndForm={genreAndForm} />
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
