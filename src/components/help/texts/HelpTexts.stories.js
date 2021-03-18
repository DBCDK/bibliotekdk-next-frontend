import { StoryTitle } from "@/storybook";
import { HelpText } from "@/components/help/texts/HelpText";

import aHelptText from "./aHelpText.json";

export default {
  title: "help/Helptext",
};

/**
 * a single helptext
 * @return {JSX.Element}
 * @constructor
 */
export function OneHelpText() {
  return (
    <div>
      <StoryTitle>A single Helptext</StoryTitle>
      <HelpText helptext={aHelptText} skeleton={true} />
    </div>
  );
}
