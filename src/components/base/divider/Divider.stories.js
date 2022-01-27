import Divider from "./Divider";
import { StoryTitle } from "@/storybook";
import React from "react";

export default {
  title: "base/Divider (<hr>)",
};

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
