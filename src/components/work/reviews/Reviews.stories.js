import { StoryTitle, StoryDescription } from "../../base/storybook";

import { Reviews, ReviewsSkeleton } from "./Reviews";

export default {
  title: "Reviews",
};

/**
 * Returns all primary buttons (Default button style)
 *
 */

export function SomeReviews() {
  return (
    <div>
      <StoryTitle>Breadcrumb path</StoryTitle>
      <StoryDescription>
        The breadcrump component takes a path, and breaks the path up in
        clickable path fragments
      </StoryDescription>
      <Reviews />
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <StoryTitle>Loading breadcrumb path</StoryTitle>
      <StoryDescription>
        The breadcrumbs component takes a fixed number of crumbs in skeleton
        mode, here shown with 5.
      </StoryDescription>
      <ReviewsSkeleton />
    </div>
  );
}
