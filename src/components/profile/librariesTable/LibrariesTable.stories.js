import { StoryTitle } from "@/storybook";
import automock_utils from "@/lib/automock_utils.fixture";

import LibrariesTable from "./LibrariesTable";

const { USER_LIBRARIES } = automock_utils();
const exportedObject = {
  title: "profile/LibrariesTable",
};
export default exportedObject;
/**
 * Returns a list table libraries
 *
 */
export function LibrariesTableStory() {
  return (
    <div>
      <StoryTitle>LibrariesTable</StoryTitle>
      <LibrariesTable data={USER_LIBRARIES} />
    </div>
  );
}
