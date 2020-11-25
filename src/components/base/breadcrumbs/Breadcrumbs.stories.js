import { StoryTitle, StoryDescription } from "@/storybook";

import Breadcrumbs from "./Breadcrumbs";

export default {
  title: "Breadcrumbs",
};

/**
 * Returns all primary buttons (Default button style)
 *
 */

export function BreadcrumbPath() {
  const path = ["This", "is", "Some", "Relative", "Path"];

  return (
    <div>
      <StoryTitle>Breadcrumb path</StoryTitle>
      <StoryDescription>
        The breadcrump component takes a path, and breaks the path up in
        clickable path fragments
      </StoryDescription>
      <Breadcrumbs path={path} />
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
      <Breadcrumbs skeleton={true} crumbs={5} />
    </div>
  );
}
