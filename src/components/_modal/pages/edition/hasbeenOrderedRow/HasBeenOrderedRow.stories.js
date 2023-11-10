import { StoryDescription, StoryTitle } from "@/storybook";
import HasBeenOrderedRow from "./HasBeenOrderedRow";

const exportedObject = {
  title: "modal/Edition",
};

export default exportedObject;

export function HasBeenOrderedRowStory() {
  const date = new Date();
  return (
    <div>
      <StoryTitle>Material been ordered</StoryTitle>
      <StoryDescription>
        Row shown in edition when material has already been ordered
      </StoryDescription>
      <HasBeenOrderedRow orderDate={date} />
    </div>
  );
}
