import { StoryTitle } from "@/storybook";
import {
  default as WrappedHelpText,
  HelpText as NamedHelpText,
} from "@/components/help/texts/HelpText";

import aHelpText from "./aHelpText.fixture.json";

const exportedObject = {
  title: "help/Helptext",
};

export default exportedObject;

/**
 * a single helptext
 * @returns {React.JSX.Element}
 */
export function OneHelpText() {
  return (
    <>
      <StoryTitle>A single Helptext</StoryTitle>
      <NamedHelpText helptext={aHelpText} skeleton={true} />
    </>
  );
}

export function WrappedStoryHelpText() {
  const helpTextId = "42";

  return (
    <>
      <StoryTitle>A wrapped HelpText</StoryTitle>
      <WrappedHelpText helpTextId={helpTextId} />
    </>
  );
}
WrappedStoryHelpText.story = {
  parameters: {
    nextRouter: {
      showInfo: true,
      pathname: "/",
      query: { helpTextId: "42" },
    },
  },
};
