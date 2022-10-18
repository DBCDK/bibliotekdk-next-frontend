import { StoryTitle } from "@/storybook";

import Popover from "./Tjooltjip";

const exportedObject = {
  title: "base/Tooltips",
};

export default exportedObject;

export function SimpleTooltip() {
  return (
    <div>
      <StoryTitle>simple tooltip</StoryTitle>
      <Popover placement="right" labelToTranslate="tooltip_change_email" />
    </div>
  );
}
