import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { useState } from "react";
import { Logo } from "./Logo";

export default {
  title: "base/logo",
};

/**
 * Returns Header
 *
 */
export function Logostory() {
  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>Logo component</StoryTitle>
      <StoryDescription>Default logo</StoryDescription>
      <Logo />
    </div>
  );
}
