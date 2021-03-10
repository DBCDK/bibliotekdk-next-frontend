import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import Banner from "./Banner";

export default {
  title: "layout/Banner",
};

/**
 * Returns Banner
 *
 */
export function TopBanner() {
  return (
    <div style={{ height: "800px" }}>
      <StoryTitle>Banner</StoryTitle>
      <StoryDescription>Topbanner</StoryDescription>
      <Banner />
    </div>
  );
}
