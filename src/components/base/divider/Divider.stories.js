import { Divider } from "./Divider";
import { StoryTitle } from "@/storybook";

export default {
  title: "Divider (<hr>)",
};

/**
 * Returns bibliographic data component
 */
export function BibData() {
  return (
    <React.Fragment>
      <StoryTitle>Divider</StoryTitle>
      <Divider />
    </React.Fragment>
  );
}
