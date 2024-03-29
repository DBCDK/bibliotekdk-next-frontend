import { StoryDescription, StoryTitle } from "@/storybook";
import ThumbnailParade from "@/components/series/seriesHeading/titleBox/thumbnailParade/ThumbnailParade";
import automock_utils from "@/lib/automock_utils.fixture";

const exportedObject = {
  title: "AdvancedSearch/ThumbnailParade",
};

const {
  MANIFESTATION_1,
  MANIFESTATION_2,
  MANIFESTATION_3,
  MANIFESTATION_4,
  MANIFESTATION_5,
} = automock_utils();

export default exportedObject;

export function ThumbnailParadeBase() {
  const storyTitle = "ThumbnailParadeBase";

  const series = {
    members: [
      {
        work: {
          manifestations: {
            mostRelevant: [MANIFESTATION_1],
          },
        },
      },
      {
        work: {
          manifestations: {
            mostRelevant: [MANIFESTATION_2],
          },
        },
      },
      {
        work: {
          manifestations: {
            mostRelevant: [MANIFESTATION_3],
          },
        },
      },
      {
        work: {
          manifestations: {
            mostRelevant: [MANIFESTATION_4],
          },
        },
      },
      {
        work: {
          manifestations: {
            mostRelevant: [MANIFESTATION_5],
          },
        },
      },
    ],
  };

  return (
    <div>
      <StoryTitle>ThumbnailParade - {storyTitle}</StoryTitle>
      <StoryDescription>
        ThumbnailParade - {storyTitle}, aka a simple test
      </StoryDescription>
      <ThumbnailParade series={series} seriesIsLoading={false} className={""} />
    </div>
  );
}
