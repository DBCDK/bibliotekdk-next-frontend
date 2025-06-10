import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";

import Keywords, { KeywordsSkeleton } from "./Keywords";

const exportedObject = {
  title: "work/Keywords",
};

export default exportedObject;

/**
 * Returns Keyword section
 *
 */
export function KeywordsSection() {
  const workId = "some-id";

  return (
    <div>
      <StoryTitle>Keywords section</StoryTitle>
      <StoryDescription>
        Work keywords component. The Section component is used for layout.
      </StoryDescription>
      <StorySpace direction="v" space="8" />
      <Keywords workId={workId} />
    </div>
  );
}
KeywordsSection.story = {
  parameters: {
    graphql: {
      resolvers: {
        Work: {
          extendedWork: () => null,
        },
        SubjectContainer: {
          dbcVerified: () => [
            {
              __typename: "SubjectText",
              display: "historie",
              language: {
                display: "dansk",
                isoCode: "dan",
              },
              type: "TOPIC",
            },
            {
              __typename: "SubjectText",
              display: "historie",
              language: {
                display: "dansk",
                isoCode: "dan",
              },
              type: "TOPIC",
            },
            {
              __typename: "SubjectText",
              display: "den 2. verdenskrig",
              language: {
                display: "dansk",
                isoCode: "dan",
              },
              type: "TOPIC",
            },
            {
              __typename: "SubjectText",
              display: "Tyskland",
              language: {
                display: "dansk",
                isoCode: "dan",
              },
              type: "LOCATION",
            },
            {
              __typename: "SubjectText",
              display: "2. heimsbardagi",
              language: {
                display: "færøsk",
                isoCode: "fao",
              },
              type: "TOPIC",
            },
            {
              __typename: "TimePeriod",
              display: "1930-1939",
              type: "TIME_PERIOD",
            },
          ],
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/",
      query: {},
    },
  },
};

/**
 * Returns Loading description section
 *
 */
export function Loading() {
  return (
    <div>
      <StoryTitle>Keywords section</StoryTitle>
      <StoryDescription>Loading keywords component</StoryDescription>
      <StorySpace direction="v" space="8" />
      <KeywordsSkeleton />
    </div>
  );
}
