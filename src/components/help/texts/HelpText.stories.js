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
WrappedStoryHelpText.parameters = {
  graphql: {
    debug: true,
    resolvers: {
      BibliotekdkCms: {
        helpTexts: () => [
          {
            documentId: "42",
            title: "Sådan søger du i Bibliotek.dk",
            body: `I Bibliotek.dk kan du finde danske bibliotekers materialer`,
            group: "sogning",
            image: null,
            createdAt: "2021-04-28T09:56:34+0200",
            updatedAt: "2022-06-30T10:29:43+0200",
          },
        ],
      },
    },
  },
  nextRouter: {
    showInfo: true,
    pathname: "/",
    query: { helpTextId: "42" },
  },
};
