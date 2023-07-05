import { useState } from "react";
import Overview, { OverviewSkeleton } from "./Overview";
import { StoryTitle, StoryDescription } from "@/storybook";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const exportedObject = {
  title: "work/Overview",
};

export default exportedObject;

const { DEFAULT_STORY_PARAMETERS } = automock_utils();

/** OverviewComponentBuilder
 * @param {string} type
 * @param {Object<Object<string, Array, boolean>, boolean, boolean>} editionProps
 * @param {string} storyNameOverride
 */
function OverviewComponentBuilder({
  overviewProps,
  type,
  storyNameOverride = null,
}) {
  const descriptionName = storyNameOverride ? storyNameOverride : type;

  return (
    <div>
      <StoryTitle>Overview - {descriptionName}</StoryTitle>
      <StoryDescription>
        Overview with description: {descriptionName}
      </StoryDescription>
      <Overview
        workId={overviewProps.workId}
        type={overviewProps.type}
        onTypeChange={(el) => overviewProps.onTypeChange(el.type)}
        login={() => {}}
      />
    </div>
  );
}

export function OverviewWrapped() {
  const [type, setType] = useState(["bog"]);

  const overviewProps = {
    workId: `some-work-id-5`,
    type: type,
    onTypeChange: (el) => setType(el),
  };

  return (
    <OverviewComponentBuilder overviewProps={overviewProps} type={["bog"]} />
  );
}

OverviewWrapped.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

export function OverviewWrappedNoType() {
  const [type, setType] = useState([]);

  const overviewProps = {
    workId: `some-work-id-5`,
    type: type,
    onTypeChange: (el) => {
      setTimeout(() => {
        setType(el);
      }, 400);
    },
  };

  return <OverviewComponentBuilder overviewProps={overviewProps} type={[]} />;
}

OverviewWrappedNoType.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

/**
 * skeleton
 *
 */
export function Loading() {
  return (
    <div>
      <OverviewSkeleton />
    </div>
  );
}
