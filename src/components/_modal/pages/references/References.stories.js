import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import { References } from "@/components/_modal/pages/references/References";

export default {
  title: "modal/References",
};

export function referenceLinks() {
  return (
    <div>
      <StoryTitle>Link reference systems</StoryTitle>
      <StoryDescription>endnote refworks download</StoryDescription>
      <References pid="820030-katalog:246833" />
    </div>
  );
}
