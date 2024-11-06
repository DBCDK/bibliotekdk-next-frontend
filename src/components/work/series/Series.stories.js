import { StoryTitle, StoryDescription } from "@/storybook";
import WrappedSeries, { Series } from "./Series";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const exportedObject = {
  title: "work/Series",
};

export default exportedObject;

const { ALL_WORKS, WORK_1, WORK_2, WORK_4, WORK_7, DEFAULT_STORY_PARAMETERS } =
  automock_utils();

const WORK_ID = "some-work-id-7";

export function WrappedSeriesSlider() {
  return (
    <div>
      <StoryTitle>Wrapped Series Slider</StoryTitle>
      <StoryDescription>Fetches data from ...</StoryDescription>
      <WrappedSeries workId={WORK_ID} type={["bog"]} />
    </div>
  );
}
WrappedSeriesSlider.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          work: ({ variables }) => {
            const work = ALL_WORKS.find((w) => w.workId === variables?.workId);

            return {
              ...work,
              series: [
                {
                  title: "Sagaen om Sølvskoven",
                  members: [
                    { work: WORK_1 },
                    { work: WORK_2 },
                    { work: WORK_4 },
                    { work: WORK_7 },
                  ],
                },
              ],
              titles: {
                ...work.titles,
                tvSeries: { title: "Sagaen om Sølvskoven" },
              },
            };
          },
        },
      },
    },
  },
});

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
