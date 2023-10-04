import { StoryTitle, StoryDescription } from "@/storybook";
import Logo from "./Logo";

const exportedObject = {
  title: "base/logo",
};

export default exportedObject;

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
        <Logo />
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
        <Logo fill="var(--white)" />
      </div>
    </div>
  );
}
