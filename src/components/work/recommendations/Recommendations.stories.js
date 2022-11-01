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
        RecommendationResponse: {
          result: (
            args // Return empty array if wrong workId is given
          ) =>
            args?.variables?.workId === WORK_ID
              ? [...new Array(2).fill({})]
              : [],
        },
        Manifestations: {
          all: () => [...new Array(1).fill({})],
        },
        Cover: {
          detail: (args) =>
            args.getNext([
              "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=46615743&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=a6dc3c794007f38c270",
              "https://moreinfo.addi.dk/2.11/more_info_get.php?lokalid=53247873&attachment_type=forside_stor&bibliotek=870970&source_id=150020&key=d8a4a5e223cd63329321",
            ]),
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
