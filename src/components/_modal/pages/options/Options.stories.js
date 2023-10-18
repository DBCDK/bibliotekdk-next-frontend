import { StoryTitle, StoryDescription } from "@/storybook";

import Modal from "@/components/_modal/Modal";
import Pages from "@/components/_modal/pages";
import AlternativeOptions from "@/components/work/overview/alternatives/Alternatives";
import merge from "lodash/merge";
import automock_utils from "@/lib/automock_utils.fixture";

const { DEFAULT_STORY_PARAMETERS } = automock_utils();

const exportedObject = {
  title: "modal/Options",
};

export default exportedObject;

export function AllOptions() {
  const workId = "work-of:870971-tsart:39160846";
  const selectedPids = [
    "some-pid-1",
    "some-pid-2",
    "some-pid-3",
    "some-pid-4",
    "some-pid-5",
    "some-pid-6",
    "some-pid-7",
    "some-pid-8",
    "some-pid-9",
    "some-pid-10",
  ];

  return (
    <>
      <StoryTitle>Url, pdf, infomedia and digital copy</StoryTitle>
      <StoryDescription>
        All options. Physical and digital copy are combined into one entry
      </StoryDescription>
      <AlternativeOptions workId={workId} selectedPids={selectedPids} />
      <Modal.Container>
        <Modal.Page id="options" component={Pages.Options} />
      </Modal.Container>
    </>
  );
}
AllOptions.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});
