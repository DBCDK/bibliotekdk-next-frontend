import { StoryTitle } from "@/storybook";

import Popover from "./Tooltip";

const exportedObject = {
  title: "base/Tooltips",
};

export default exportedObject;

export function SimpleTooltipWithChild() {
  return (
    <div style={{ height: "200px", width: "300px" }}>
      <StoryTitle>Simple tooltip width child</StoryTitle>
      <Popover placement="right" labelToTranslate="tooltip_change_email">
        <p style={{ cursor: "pointer" }}>CLICK ME</p>
      </Popover>
    </div>
  );
}

export function SimpleTooltipDefaultContent() {
  return (
    <div style={{ height: "200px", width: "300px" }}>
      <StoryTitle>Shows default icon</StoryTitle>
      <Popover
        placement="right"
        labelToTranslate="tooltip_change_email"
      ></Popover>
    </div>
  );
}
