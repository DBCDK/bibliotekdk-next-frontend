import { StoryTitle, StoryDescription } from "@/storybook";

import dummy_data from "./dummy_data.fixture.json";
import Modal, { useModal } from "@/components/_modal/Modal";
import Pages from "@/components/_modal/pages";
import { Options } from "./Options.page";
import merge from "lodash/merge";
import automock_utils from "@/lib/automock_utils.fixture";

const { DEFAULT_STORY_PARAMETERS } = automock_utils();

const exportedObject = {
  title: "modal/Options",
};

export default exportedObject;

export function AllOptions() {
  const modal = useModal();
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Url, pdf, infomedia and digital copy</StoryTitle>
      <StoryDescription>
        All options. Physical and digital copy are combined into one entry
      </StoryDescription>
      <Options
        modal={modal}
        context={{
          title: "fiske",
          workId: "work-of:870971-tsart:39160846",
          selectedPids: [
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
          ],
        }}
      />
    </div>
  );
}
AllOptions.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

export function NoPhysicalOption() {
  const modal = useModal();
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Url, pdf, infomedia and digital copy</StoryTitle>
      <StoryDescription>
        Physical order is not possible. Digital copy will have its own entry.
      </StoryDescription>
      <Options
        modal={modal}
        context={{
          title_author: "fiske",
          workId: "work-of:870971-tsart:39160846",
          selectedPids: ["some-pid-7"],
        }}
      />
    </div>
  );
}
NoPhysicalOption.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

export function NoDigitalCopyOption() {
  const modal = useModal();
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Url, pdf, infomedia and digital copy</StoryTitle>
      <StoryDescription>
        Digital copy is not possible. Physical order will have its own entry.
      </StoryDescription>
      <Options
        modal={modal}
        context={{
          title_author: "fiske_hest",
          workId: "work-of:870971-tsart:39160846",
          selectedPids: ["some-pid-1"],
          orderPossible: true,
        }}
      />
    </div>
  );
}
NoDigitalCopyOption.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

/**
 * Options template - loading
 *
 */
export function Loading() {
  const modal = useModal();
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Loading</StoryTitle>
      <StoryDescription>
        Skeleton version of the options template
      </StoryDescription>
      <Modal.Container>
        <Modal.Page id="options" component={Pages.Options} />
      </Modal.Container>

      <Options modal={modal} context={{ title_author: "fiske_hest" }} />
    </div>
  );
}
Loading.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});
