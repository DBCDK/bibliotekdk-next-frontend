import { useState } from "react";
import Overview, { OverviewSkeleton } from "./Overview";

import { StoryTitle, StoryDescription } from "@/storybook";
import { AccessEnum } from "@/lib/enums";

const exportedObject = {
  title: "work/Overview",
};

export default exportedObject;

const date = new Date();
const time = date.getTime();

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
        workId={overviewProps.workId ?? "some-workId"}
        type={overviewProps.type ?? ""}
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
      Query: {
        work: () => {
          return {
            titles: { full: ["Asterix og Obelix i det vilde vesten"] },
            materialTypes: [
              { specific: "Bog" },
              { specific: "Ebog" },
              { specific: "Lydbog (bånd)" },
              { specific: "Lydbog (cd-mp3)" },
              { specific: "Lydbog (net)" },
            ],
            creators: [{ display: "Lucky Luke" }, { display: "Ratata" }],
            workTypes: ["LITERATURE"],
            manifestations: {
              all: [
                {
                  pid: "some-pid-bog" + time,
                  materialTypes: [
                    { specific: "Bog" },
                    { specific: "Lydbog (cd-mp3)" },
                  ],
                  cover: {
                    detail: "hejsa.cob",
                  },
                },
              ],
            },
          };
        },
        manifestations: () => {
          return [
            {
              pid: "some-pid-bog" + time,
              materialTypes: [{ specific: "Bog" }, { specific: "Ebog" }],
              accessTypes: [
                {
                  display: "fysisk",
                },
              ],
              access: [
                {
                  __resolveType: AccessEnum.INTER_LIBRARY_LOAN,
                  loanIsPossible: true,
                },
              ],
              workTypes: ["LITERATURE"],
              genreAndForm: ["some-genreAndForm - 1", "some-genreAndForm - 2"],
              physicalDescriptions: [...new Array(10).fill({})],
              contributors: [...new Array(10).fill({})],
            },
          ];
        },
      },
    }),
  };
}

export function OverviewWrapped() {
  const [type, setType] = useState("Bog");

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

export function OverviewWrappedNoType() {
  const [type, setType] = useState("");

  const overviewProps = {
    workId: `some-workId-${type}`,
    type: type,
    onTypeChange: (el) => {
      setTimeout(() => {
        setType(el);
      }, 400);
    },
  };

  return (
    <OverviewComponentBuilder overviewProps={overviewProps} type={"No type"} />
  );
}

OverviewWrappedNoType.story = {
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
