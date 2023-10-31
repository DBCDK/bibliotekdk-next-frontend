import { StoryTitle } from "@/storybook";

import FieldInput from "./FieldInput";

const exportedObject = {
  title: "search/FieldInput",
};
export default exportedObject;
/**
 * Returns a list table libraries
 *
 */
export function FieldInputStory() {
  return (
    <div>
      <StoryTitle>FieldInput</StoryTitle>
      <FieldInput materialType="all" />
    </div>
  );
}
