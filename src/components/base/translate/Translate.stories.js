import { StoryTitle, StoryDescription, StorySpace } from "../storybook";
import Translate from "./Translate";

export default {
  title: "Translate",
};

/**
 * Returns all primary buttons (Default button style)
 *
 */
export function Basic() {
  return (
    <div>
      <StoryTitle>Translate</StoryTitle>
      <StoryDescription>...</StoryDescription>
      <Translate />
    </div>
  );
}
