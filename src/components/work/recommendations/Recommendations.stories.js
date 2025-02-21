import { StoryTitle, StoryDescription } from "@/storybook";
import WrappedRecommendations from "./Recommendations";

const exportedObject = {
  title: "work/Recommendations",
};

export default exportedObject;

const WORK_ID = "work-of:870970-basis:07276346";

export function WrappedRecommendationsSlider() {
  return (
    <div>
      <StoryTitle>Wrapped Recommendations Slider</StoryTitle>
      <StoryDescription>Fetches data from ...</StoryDescription>
      <WrappedRecommendations workId={WORK_ID} />
    </div>
  );
}
WrappedRecommendationsSlider.story = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Mutation: {
          data_collect: ({ variables }) => {
            // Log for Cypress
            console.debug("data_collect", variables?.input);
            return "OK";
          },
        },
        RecommendationResponse: {
          result: (
            args // Return empty array if wrong workId is given
          ) =>
            args?.variables?.workId === WORK_ID
              ? [...new Array(20).fill({})]
              : [],
        },
        Manifestations: {
          mostRelevant: () => [...new Array(1).fill({})],
        },
        Cover: {
          origin: () => "fbiinfo",
          detail: ({ path }) => `https://picsum.photos/seed/${path}/200/300`,
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
