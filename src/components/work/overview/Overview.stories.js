import { useState } from "react";
import Overview, { OverviewSkeleton } from "./Overview";

import { StoryTitle, StoryDescription } from "@/storybook";

const exportedObject = {
  title: "work/Overview",
};

export default exportedObject;

/** OverviewComponentBuilder
 * @param {string} type
 * @param {Object<Object<string, Array, boolean>, boolean, boolean>} editionProps
 * @param {string} storyNameOverride
 */
function OverviewComponentBuilder({
  overviewProps,
  type = "Bog",
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
        workId={overviewProps.workId ?? "some-workId"}
        type={overviewProps.type ?? "Bog"}
        onTypeChange={(el) => overviewProps.onTypeChange(el.type)}
        login={() => {}}
      />
    </div>
  );
}

function OverviewStoryBuilder(storyname, resolvers = {}, query = {}) {
  return {
    parameters: {
      graphql: {
        debug: true,
        resolvers: resolvers,
        url: "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql",
      },
      nextRouter: {
        showInfo: true,
        pathname: `/materiale/${storyname}Edition/work-of:870970-basis:${storyname}`,
        query: query,
      },
    },
  };
}

function resolvers(storyname) {
  return {
    ...OverviewStoryBuilder(`${storyname}`, {
      MaterialType: {
        specific: () => "Bog",
      },
      InterLibraryLoan: {
        loanIsPossible: () => true,
      },
      Access: {
        __resolveType: () => "InterLibraryLoan",
      },
      Work: {
        workId: () => "some-workId-bog",
        materialTypes: () => [
          { specific: "Bog" },
          { specific: "Ebog" },
          { specific: "Lydbog (bånd)" },
          { specific: "Lydbog (cd-mp3)" },
          { specific: "Lydbog (net)" },
        ],
        creators: () => [{ display: "Lucky Luke" }, { display: "Ratata" }],
      },
      WorkTitles: {
        full: () => ["Asterix og Obelix i det vilde vesten"],
      },
      Manifestation: {
        pid: () => "some-pid",
        access: () => [...new Array(10).fill({})],
        materialTypes: () => [
          { specific: "Ebog" },
          { specific: "Lydbog (cd-mp3)" },
        ],
        genreAndForm: () => ["some-genreAndForm - 1", "some-genreAndForm - 2"],
        physicalDescriptions: () => [...new Array(10).fill({})],
        contributors: () => [...new Array(10).fill({})],
        accessTypes: () => [...new Array(10).fill({})],
      },
    }),
  };
}

export function OverviewWrapped() {
  const [type, setType] = useState("bog");

  const overviewProps = {
    workId: `some-workId-${type}`,
    type: type,
    onTypeChange: (el) => setType(el),
  };

  return (
    <OverviewComponentBuilder overviewProps={overviewProps} type={"Bog"} />
  );
}

OverviewWrapped.story = {
  ...resolvers("Wrapped"),
};

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
