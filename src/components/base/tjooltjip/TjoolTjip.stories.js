import { StoryTitle, StorySpace } from "@/storybook";

import Popover from "./Tjooltjip";

export default {
  title: "base/Tooltips",
};

export function SimpleTooltip() {
  return (
    <div>
      <StoryTitle>simple tooltip</StoryTitle>
      <Popover placement="right" labelToTranslate="tooltip_change_email" />
    </div>
  );
}
