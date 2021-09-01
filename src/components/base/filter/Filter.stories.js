import { useState } from "react";
import { StoryTitle, StoryDescription } from "@/storybook";

import Filter from "./";

export default {
  title: "base/Filter",
};

/**
 * Default input field
 *
 */
export function Default() {
  return (
    <div>
      <StoryTitle>Filter list</StoryTitle>
      <StoryDescription>Input default state</StoryDescription>
      <Filter onChange={(value) => console.log(("data", { value }))} />
    </div>
  );
}
