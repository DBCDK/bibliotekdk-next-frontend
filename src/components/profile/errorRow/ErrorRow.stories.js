import { StoryTitle } from "@/storybook";
import ErrorRow from "./ErrorRow";
//import automock_utils from "@/components/_modal/pages/automock_utils";

const exportedObject = {
  title: "profile/ErrorRow",
};
export default exportedObject;
/**
 * Returns a list table libraries
 *
 */
export function ErrorRowStory() {
  return (
    <div>
      <StoryTitle>Error Row</StoryTitle>
      <ErrorRow />
    </div>
  );
}
