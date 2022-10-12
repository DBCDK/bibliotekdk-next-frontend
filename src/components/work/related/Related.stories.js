import { StoryTitle, StoryDescription } from "@/storybook";
import WrappedRelated, { Related } from "./Related";

export default {
  title: "work/RelatedSubjects",
};

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
        Relted subjects for a given search query
      </StoryDescription>
      <div>
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
      <div style={{ maxWidth: "1200px", margin: "auto" }}>
        <WrappedRelated workId="work-of:870970-basis:51701763" />
      </div>
    </div>
  );
}

Connected.story = {
  parameters: {
    graphql: {
      resolvers: {
        // Subject: {
        //   __resolveType: () => "SubjectText",
        // },
        // Work: {
        //   subjects: (args) => {
        //     console.log("args1....", args);
        //     return {
        //       dbcVerified: [{ display: "hest" }, { display: "ost" }],
        //     };
        //   },
        // },
        // Query: {
        //   relatedSubjects: (args) => {
        //     console.log("args2...", args);
        //     return dummy;
        //   },
        // },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/materiale",
      query: { workId: "work-of:870970-basis:51701763" },
    },
  },
};
