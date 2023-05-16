import IconButton from "./IconButton";
import { StoryTitle } from "@/storybook";

const exportedObject = {
  title: "base/IconButton",
};
export default exportedObject;
/**
 * Returns closebutton
 *
 */
export function CloseIcon() {
  return (
    <div>
      <StoryTitle>IconButton</StoryTitle>
      <IconButton>Fjern</IconButton>
    </div>
  );
}
