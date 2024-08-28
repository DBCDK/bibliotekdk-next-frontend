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
    graphql: {
      debug: true,
      resolvers: {
        Query: {
          nodeById: () => {
            return {
              nid: 42,
              title: "Sådan søger du i Bibliotek.dk",
              body: {
                value: `<p>I Bibliotek.dk kan du finde danske bibliotekers materialer</p>`,
                processed: `<p>I Bibliotek.dk kan du finde danske bibliotekers materialer</p>`,
              },
              entityCreated: "2021-04-28T09:56:34+0200",
              entityChanged: "2022-06-30T10:29:43+0200",
              fieldHelpTextGroup: "Søgning",
              fieldImage: null,
            };
          },
        },
        Node: {
          __resolveType: () => "NodeHelpText",
        },
      },
      // url: "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql",
    },
    nextRouter: {
      showInfo: true,
      pathname: "/",
      query: { helpTextId: "42" },
    },
  },
};
