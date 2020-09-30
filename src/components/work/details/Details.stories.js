import { StoryTitle, StoryDescription } from "../../base/storybook";

import Details from "./Details";

export default {
  title: "Details",
};

/**
 * Returns all primary buttons (Default button style)
 *
 */
export function Primary() {
  const type = "primary";

  return (
    <div>
      <StoryTitle>Detials section</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <Details />
    </div>
  );
}
