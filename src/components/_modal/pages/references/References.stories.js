import { StoryTitle, StoryDescription } from "@/storybook";

import { References } from "@/components/_modal/pages/references/References";

const exportedObject = {
  title: "modal/References",
};

export default exportedObject;

export function referenceLinks() {
  const context = {
    pids: ["some-pid-1"],
    orderPids: ["some-pid-1"],
    workId: "some-work-id",
    periodicaForm: false,
  };
  return (
    <div>
      <StoryTitle>Link reference systems</StoryTitle>
      <StoryDescription>endnote refworks download</StoryDescription>
      <References context={context} />
    </div>
  );
}
