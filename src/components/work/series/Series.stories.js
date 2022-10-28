import { StoryTitle, StoryDescription } from "@/storybook";
import WrappedSeries, { Series } from "./Series";

const exportedObject = {
  title: "work/Series",
};

export default exportedObject;

const WORK_ID = "work-of:870970-basis:07276346";

export function WrappedSeriesSlider() {
  return (
    <div>
      <StoryTitle>Wrapped Series Slider</StoryTitle>
      <StoryDescription>Fetches data from ...</StoryDescription>
      <WrappedSeries workId={WORK_ID} />
    </div>
  );
}
WrappedSeriesSlider.story = {
  parameters: {
    graphql: {
      debug: true,
      resolvers: {
        Work: {
          seriesMembers: (args) =>
            // Return empty array if wrong workId is given
            args?.variables?.workId === WORK_ID
              ? [...new Array(2).fill({})]
              : [],
        },
        Manifestations: {
          all: (args) => [...new Array(1).fill({})],
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

export function LoadingSeries() {
  return (
    <div>
      <StoryTitle>Loading</StoryTitle>
      <StoryDescription>
        The loading/skeleton version of the review slider, uses the Infomedia
        template as skeleton elements.
      </StoryDescription>
      <Series isLoading={true} />
    </div>
  );
}
