import { StoryTitle, StoryDescription } from "@/storybook";
import { ResultPage } from ".";
import Result from "../Result";
import automock_utils from "@/lib/automock_utils.fixture";

const exportedObject = {
  title: "search/Result",
};

const { ALL_WORKS } = automock_utils();

export default exportedObject;

export function Partial() {
  const partial = [
    {
      title: "Harry Potter og de vises sten",
      creator: {
        display: "Joanne K. Rowling",
      },
    },
    {
      title: "Harry Potter og Hemmelighedernes Kammer",
      creator: {
        display: "Joanne K. Rowling",
      },
    },
    {
      title: "Harry Potter og Fønixordenen",
      creator: {
        display: "Joanne K. Rowling",
      },
    },
  ];
  return (
    <div>
      <StoryTitle>Partial data fetched</StoryTitle>
      <StoryDescription>Partial fetched data visible</StoryDescription>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <ResultPage rows={partial} />
      </div>
    </div>
  );
}

export function Loading() {
  return (
    <div>
      <StoryTitle>Loading version</StoryTitle>
      <StoryDescription>No data ready to show</StoryDescription>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <ResultPage isLoading={true} />
      </div>
    </div>
  );
}

export function Connected() {
  return (
    <div>
      <StoryTitle>Connected result page</StoryTitle>
      <StoryDescription>Uses mocked GraphQL provider</StoryDescription>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Result page={1} />
      </div>
    </div>
  );
}
Connected.story = {
  parameters: {
    graphql: {
      resolvers: {
        SearchResponse: {
          works: ({ variables }) =>
            variables?.q?.all === "hest"
              ? [...ALL_WORKS, ...ALL_WORKS].slice(0, 10)
              : [],
          hitcount: () => [...ALL_WORKS, ...ALL_WORKS].slice(0, 10).length,
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
