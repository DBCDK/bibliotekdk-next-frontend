import HelpPage from "./page/Page";
import { StoryTitle } from "@/storybook";

export default {
  title: "helptext/page",
};

export function HelpTextPage() {
  return (
    <div>
      <StoryTitle>Help Text Page</StoryTitle>
      <HelpPage helptxtId={"19"} />
    </div>
  );
}
