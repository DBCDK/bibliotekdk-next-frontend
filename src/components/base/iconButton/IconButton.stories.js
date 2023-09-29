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

/**
 * Returns add library button
 *
 */
export function AddLibrary() {
  return (
    <div>
      <StoryTitle>AddLibrary</StoryTitle>
      <StoryDescription>
        Any svg icon inside public/icons folder can be used with this component.
        Put icon name as prop
      </StoryDescription>
      <IconButton icon="chevron">Tilføj uddannelsesbibliotek</IconButton>
    </div>
  );
}
