import Label from "./Label";
import Input from "../input/";

import { StoryTitle } from "@/storybook";

const exportedObject = {
  title: "Base/Forms/Label",
};

export default exportedObject;

export function Default() {
  return (
    <div>
      <StoryTitle>Label </StoryTitle>
      <Label>Some example label</Label>
    </div>
  );
}

export function Loading() {
  return <Label skeleton={true}> Some example label </Label>;
}

export function LabelForInput() {
  return (
    <div>
      <Label for="input">Label for input</Label>
      <Input id="input" />
    </div>
  );
}
