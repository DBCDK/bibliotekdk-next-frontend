import { StoryTitle, StoryDescription } from "../../base/storybook";

import Details from "./Details";

export default {
  title: "Details",
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
        Work details component. Section component is used for layout.
      </StoryDescription>
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
      <Details skeleton />
    </div>
  );
}
