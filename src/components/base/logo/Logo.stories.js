import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { useState } from "react";
import Logo from "./Logo";

export default {
  title: "base/logo",
};

/**
 * Returns Header
 *
 */
export function DefaultLogo() {
  return (
    <div style={{ height: "800px", width: "400px" }}>
      <StoryTitle>Logo component</StoryTitle>
      <StoryDescription>Default logo</StoryDescription>
      <div style={{ padding: "20px" }}>
        <Logo text="default_logo_text" />
      </div>
    </div>
  );
}

export function BlueLogo() {
  return (
    <div style={{ height: "800px", width: "400px" }}>
      <StoryTitle>Logo component</StoryTitle>
      <StoryDescription>Hjælp og vejledninger logo</StoryDescription>
      <div style={{ backgroundColor: "blue", padding: "20px" }}>
        <Logo fill="var(--white)" text="help_logo_text" />
      </div>
    </div>
  );
}
