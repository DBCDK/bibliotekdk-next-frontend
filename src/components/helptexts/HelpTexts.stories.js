import { StoryTitle } from "@/storybook";
import { HelpText } from "@/components/helptexts/HelpText";
import { HelpTextMenu } from "@/components/helptexts/HelpTextMenu";

import aHelptText from "./aHelpText.json";
import allHelp from "./allHelp.json";

export default {
  title: "Helptext",
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

/**
 * HelpMenu - collapsed if no id is given
 * @return {JSX.Element}
 * @constructor
 */
export function HelpMenu() {
  return (
    <div>
      <StoryTitle>Helptext Menu collapsed</StoryTitle>
      <HelpTextMenu helpTexts={allHelp.data.nodeQuery.entities} />
    </div>
  );
}

/**
 * Help Menus - expanded to given id
 * @return {JSX.Element}
 * @constructor
 */
export function HelpMenuWithId() {
  return (
    <div>
      <StoryTitle>Helptext Manu expanded by id</StoryTitle>
      <HelpTextMenu
        helpTexts={allHelp.data.nodeQuery.entities}
        helpTextId={19}
      />
    </div>
  );
}
