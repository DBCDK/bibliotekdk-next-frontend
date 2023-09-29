import { StoryTitle } from "@/storybook";
import { HelpTextMenu } from "@/components/help/menu/HelpTextMenu";

import allHelp from "./allHelp.fixture.json";

const exportedObject = {
  title: "help/menu",
};

export default exportedObject;

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
      <StoryTitle>Helptext Menu expanded by id</StoryTitle>
      <HelpTextMenu
        helpTexts={allHelp.data.nodeQuery.entities}
        helpTextId={"19"}
      />
    </div>
  );
}
