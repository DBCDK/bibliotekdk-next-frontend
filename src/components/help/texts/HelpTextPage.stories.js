import HelpPage from "./page/Page";
import { StoryTitle } from "@/storybook";

export default {
  title: "help/page",
};

export function HelpTextPage() {
  return (
    <div>
      <StoryTitle>Help Text Page</StoryTitle>
      <HelpPage helpTextId={"19"} />
    </div>
  );
}
