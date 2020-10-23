import { StoryTitle, StoryDescription } from "../../../../base/storybook";

import { MaterialReview, MaterialReviewSkeleton } from "./MaterialReview";

export default {
  title: "MaterialReview",
};

/**
 * Returns all primary buttons (Default button style)
 *
 */

export function SomeMaterialReview() {
  return (
    <div>
      <StoryTitle>...</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <MaterialReview />
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <StoryTitle>...</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <MaterialReviewSkeleton />
    </div>
  );
}
