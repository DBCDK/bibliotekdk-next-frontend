import { StoryTitle, StoryDescription } from "@/storybook";

import Link from "./Link";

const exportedObject = {
  title: "base/Link",
};

export default exportedObject;

/**
 * Return what-ever as a Link
 *
 */
export function BasicLink() {
  return (
    <div>
      <StoryTitle>Turns what-ever into a link component</StoryTitle>
      <StoryDescription>
        This component is for internal navigation only. The Link component uses
        the build-in next/Link component under the hood.
      </StoryDescription>
      <Link />
    </div>
  );
}
