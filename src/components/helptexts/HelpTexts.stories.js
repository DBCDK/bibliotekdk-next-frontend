import { StoryTitle } from "@/storybook";
import { HelpText } from "@/components/helptexts/HelpText";

import aHelptText from "./aHelpText.json";

export default {
  title: "A Helptext",
};

export function OneHelpText() {
  return (
    <div>
      <StoryTitle>Helptext</StoryTitle>
      <HelpText helptexts={[aHelptText]} skeleton={true} />;
    </div>
  );
}
