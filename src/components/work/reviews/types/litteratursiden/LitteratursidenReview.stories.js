import { StoryTitle, StoryDescription } from "../../../../base/storybook";

import { InfomediaReview, InfomediaReviewSkeleton } from "./InfomediaReview";

export default {
  title: "InfomediaReview",
};

/**
 * Returns all primary buttons (Default button style)
 *
 */

export function SomeInfomediaReview() {
  return (
    <div>
      <StoryTitle>...</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <InfomediaReview />
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <StoryTitle>...</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <InfomediaReviewSkeleton />
    </div>
  );
}
