import { StoryTitle, StoryDescription } from "@/storybook";
import WrappedRelated, { Related } from "./Related";

const exportedObject = {
  title: "work/RelatedSubjects",
};

export default exportedObject;

const dummy = [
  { subject: "heste" },
  { subject: "børnebøger" },
  { subject: "ridning" },
  { subject: "hestesygdomme" },
  { subject: "vokal" },
  { subject: "sygdomme" },
  { subject: "hestesport" },
  { subject: "træning" },
  { subject: "skolebøger" },
  { subject: "hesteavl" },
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

export function MusicNoTags() {
  return (
    <div>
      <StoryTitle>No tags for music</StoryTitle>
      <StoryDescription>Uses mocked GraphQL provider</StoryDescription>
      <div style={{ maxWidth: "1200px", margin: "auto", marginTop: "100px" }}>
        <WrappedRelated workId="work-of:870970-basis:51701763" />
      </div>
    </div>
  );
}

MusicNoTags.story = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Query: {
          recommendations: () => ({
            subjects: [
              { subject: "savn", traceId: "t1" },
              { subject: "melankoli", traceId: "t2" },
            ],
          }),
        },
        Work: {
          workTypes: () => ["MUSIC"],
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
          recommendations: () => ({
            subjects: [
              { subject: "savn", traceId: "t1" },
              { subject: "melankoli", traceId: "t2" },
            ],
          }),
        },
        Work: {
          workTypes: () => ["LITERATURE"],
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
