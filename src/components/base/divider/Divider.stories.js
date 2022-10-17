import Divider from "./Divider";
import { StoryTitle } from "@/storybook";
import React from "react";

const exportedObject = {
  title: "base/Divider (<hr>)",
};

export default exportedObject;

/**
 * Returns bibliographic data component
 */
export function BibData() {
  return (
    <React.Fragment>
      <StoryTitle>Divider</StoryTitle>
      <Divider />
    </React.Fragment>
  );
}
