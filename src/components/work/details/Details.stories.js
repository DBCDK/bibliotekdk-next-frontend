import { StoryTitle, StoryDescription, StorySpace } from "../../base/storybook";

import Details from "./Details";

export default {
  title: "Work: Details",
};

/**
 * Returns details section
 *
 */
export function DetailsSection() {
  return (
    <div>
      <StoryTitle>Detials section</StoryTitle>
      <StoryDescription>
        Work details component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Details workId={"some-id"} type={"Bog"} />
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
      <Details skeleton />
    </div>
  );
}
