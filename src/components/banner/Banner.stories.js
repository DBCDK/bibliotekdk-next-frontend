import { StoryTitle, StoryDescription } from "@/storybook";
import Banner from "./Banner";

const exportedObject = {
  title: "layout/Banner",
};

export default exportedObject;

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
