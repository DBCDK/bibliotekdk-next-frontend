import IconButton from "./IconButton";
import { StoryTitle, StoryDescription } from "@/storybook";

const exportedObject = {
  title: "base/IconButton",
};
export default exportedObject;

/**
 * Returns closebutton
 *
 */
export function Remove() {
  return (
    <div>
      <StoryTitle>Remove</StoryTitle>
      <StoryDescription>
        Any svg icon inside public/icons folder can be used with this component.
        Put icon name as prop
      </StoryDescription>
      <IconButton icon="close">Fjern</IconButton>
    </div>
  );
}
