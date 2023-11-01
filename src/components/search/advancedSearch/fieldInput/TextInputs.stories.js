import { StoryTitle } from "@/storybook";

import TextInputs from "./TextInputs";

const exportedObject = {
  title: "search/FieldInput",
};
export default exportedObject;
/**
 * TextInputs for advanced search
 *
 */
export function TextInputsStory() {
  return (
    <div>
      <StoryTitle>TextInputs</StoryTitle>
      <TextInputs materialType="all" />
    </div>
  );
}
