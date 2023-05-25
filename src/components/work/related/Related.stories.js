import { StoryTitle, StoryDescription } from "@/storybook";
import WrappedRelated, { Related } from "./Related";

const exportedObject = {
  title: "work/RelatedSubjects",
};

export default exportedObject;

const dummy = [
  "heste",
  "børnebøger",
  "ridning",
  "hestesygdomme",
  "vokal",
  "sygdomme",
  "hestesport",
  "træning",
  "skolebøger",
  "hesteavl",
];

export function Default() {
  return (
    <div>
      <StoryTitle>Related subjects</StoryTitle>
      <StoryDescription>
        Related subjects for a given search query
      </StoryDescription>
      <div style={{ marginTop: "100px" }}>
        <Related data={dummy} isLoading={false} />
      </div>
    </div>
  );
}

export function Connected() {
  return (
    <div>
      <StoryTitle>Connected result page</StoryTitle>
      <StoryDescription>Uses mocked GraphQL provider</StoryDescription>
      <div style={{ maxWidth: "1200px", margin: "auto", marginTop: "100px" }}>
        <WrappedRelated workId="work-of:870970-basis:51701763" />
      </div>
    </div>
  );
}

Connected.story = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Query: {
          relatedSubjects: () => ["savn", "melankoli"],
        },
        SubjectContainer: {
          dbcVerified: () => [
            {
              display: "savn",
              __typename: "SubjectText",
              language: {
                display: "dansk",
                isoCode: "dan",
              },
            },
            {
              display: "melankoli",
              __typename: "SubjectText",
              language: {
                display: "dansk",
                isoCode: "dan",
              },
            },
          ],
        },
      },
    },
  },
  nextRouter: {
    showInfo: true,
    pathname: "/",
    query: {},
  },
};
