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
        type={overviewProps.type || []}
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
              { specific: "bog" },
              { specific: "ebog" },
              { specific: "lydbog (bånd)" },
              { specific: "lydbog (cd-mp3)" },
              { specific: "lydbog (net)" },
            ],
            creators: [{ display: "Lucky Luke" }, { display: "Ratata" }],
            workTypes: ["LITERATURE"],
            manifestations: {
              mostRelevant: [
                {
                  pid: "some-pid-bog" + time,
                  materialTypes: [{ specific: "bog" }],
                  cover: {
                    detail: "hejsa.cob",
                  },
                },
                {
                  pid: "some-pid-bog-1" + time,
                  materialTypes: [{ specific: "ebog" }],
                  cover: {
                    detail: "hejsa.cob",
                  },
                },
                {
                  pid: "some-pid-bog-2" + time,
                  materialTypes: [{ specific: "lydbog (bånd)" }],
                  cover: {
                    detail: "hejsa.cob",
                  },
                },
                {
                  pid: "some-pid-bog-3" + time,
                  materialTypes: [{ specific: "lydbog (cd-mp3)" }],
                  cover: {
                    detail: "hejsa.cob",
                  },
                },
                {
                  pid: "some-pid-bog-4" + time,
                  materialTypes: [{ specific: "lydbog (net)" }],
                  cover: {
                    detail: "hejsa.cob",
                  },
                },
                {
                  pid: "some-pid-bog-5" + time,
                  materialTypes: [
                    { specific: "lydbog (net)" },
                    { specific: "soloplade" },
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
              materialTypes: [{ specific: "Ebog" }],
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
            {
              pid: "some-pid-ebog" + time,
              materialTypes: [{ specific: "Ebog" }],
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
  const [type, setType] = useState(["bog"]);

  const overviewProps = {
    workId: `some-workId-${type}`,
    type: type,
    onTypeChange: (el) => setType(el),
  };

  return (
    <OverviewComponentBuilder overviewProps={overviewProps} type={["bog"]} />
  );
}

OverviewWrapped.story = {
  ...resolvers("Wrapped"),
};

export function OverviewWrappedNoType() {
  const [type, setType] = useState([]);

  const overviewProps = {
    workId: `some-workId-${type}`,
    type: type,
    onTypeChange: (el) => {
      setTimeout(() => {
        setType(el);
      }, 400);
    },
  };

  return <OverviewComponentBuilder overviewProps={overviewProps} type={[]} />;
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
