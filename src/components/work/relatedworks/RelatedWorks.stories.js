import { StoryDescription, StoryTitle } from "@/storybook";
import RelatedWorks from "@/components/work/relatedworks/RelatedWorks";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const exportedObject = {
  title: "work/RelatedWorks",
};

export default exportedObject;

const date = new Date();
const time = date.getTime();

const { DEFAULT_STORY_PARAMETERS } = automock_utils();

function RelatedWorksComponentBuilder({
  type = "bog",
  workId = "some-id-builder" + time,
  storyNameOverride = null,
}) {
  const descriptionName = storyNameOverride ? storyNameOverride : type;
  return (
    <div>
      <StoryTitle>ReservationButton - {descriptionName}</StoryTitle>
      <StoryDescription>
        The ReservationButton based on the type: {descriptionName}
      </StoryDescription>
      <RelatedWorks workId={workId} />
    </div>
  );
}

export function RelatedWorksPhysicalBook() {
  return (
    <RelatedWorksComponentBuilder type={"bog"} workId={"some-work-id-4"} />
  );
}

RelatedWorksPhysicalBook.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
    nextRouter: {
      showInfo: true,
      pathname: "/materiale/[title_author]/[workId]",
      query: {
        title_author: "hugo_i_soelvskoven",
        workId: "some-work-id-4",
      },
    },
  },
});
