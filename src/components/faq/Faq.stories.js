import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { Faq } from "./Faq";

export default {
  title: "layout/Footer",
};

export function FooterStory() {
  <StoryTitle>Faq</StoryTitle>;
  <StoryDescription>Frequently asked questions</StoryDescription>;
  return <Faq />;
}
