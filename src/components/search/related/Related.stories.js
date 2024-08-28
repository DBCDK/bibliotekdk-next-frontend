import { StoryTitle, StoryDescription } from "@/storybook";
import WrappedRelated, { Words } from "./Related";
import { FilterTypeEnum } from "@/lib/enums";

const exportedObject = {
  title: "search/RelatedSubjects",
};

export default exportedObject;

export function Default() {
  const data = [
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

  return (
    <div>
      <StoryTitle>Related subjects</StoryTitle>
      <StoryDescription>
        Related subjects for a given search query
      </StoryDescription>
      <div style={{ marginTop: "10px" }}>
        <Words data={data} isLoading={false} />
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
      resolvers: {
        SearchResponse: {
          hitcount: () => "998",
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: "/find",
      query: { "q.all": "hest" },
    },
  },
};

export function Empty() {
  return (
    <div>
      <StoryTitle>Connected result page</StoryTitle>
      <StoryDescription>Uses mocked GraphQL provider</StoryDescription>
      <div style={{ maxWidth: "1200px", margin: "auto" }}>
        <WrappedRelated workId="" />
      </div>
    </div>
  );
}

Empty.story = {
  parameters: {
    graphql: {
      debug: true,
      // url: "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql",
      resolvers: {
        Query: {
          search: () => {
            return {
              hitcount: 0,
            };
          },
        },
      },
    },
    nextRouter: {
      showInfo: true,
      pathname: `/find?workTypes=game`,
      query: { [FilterTypeEnum.WORK_TYPES]: "game" },
    },
  },
};
