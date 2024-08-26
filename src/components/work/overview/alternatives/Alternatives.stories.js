import { StoryTitle, StoryDescription } from "@/storybook";
import { default as AlternativeOptions } from "./Alternatives";
import { AccessEnum } from "@/lib/enums";

const exportedObject = {
  title: "work/Overview/Alternatives",
};

export default exportedObject;

/** AlternativesComponentBuilder
 * @param {string} type
 * @param {Object<Object<string, Array, boolean>, boolean, boolean>} editionProps
 * @param {string} storyNameOverride
 */
function AlternativeOptionsComponentBuilder({
  alternativeOptionsProps,
  type = "Bog",
  storyNameOverride = null,
}) {
  const date = new Date();
  let time = date.getTime();

  const descriptionName = storyNameOverride ? storyNameOverride : type;

  const workId = alternativeOptionsProps?.workId || "some-workId" + time;
  const selectedPids = alternativeOptionsProps?.selectedPids || [
    "some-pid-0" + time,
    "some-pid-1" + time,
  ];

  return (
    <div>
      <StoryTitle>LocalizationsLink - {descriptionName}</StoryTitle>
      <StoryDescription>
        LocalizationsLink with description: {descriptionName}
      </StoryDescription>
      <AlternativeOptions workId={workId} selectedPids={selectedPids} />
    </div>
  );
}

function AlternativeOptionsStoryBuilder(storyname, resolvers = {}, query = {}) {
  return {
    parameters: {
      graphql: {
        debug: true,
        resolvers: resolvers,
        // url: "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql",
      },
      nextRouter: {
        showInfo: true,
        pathname: `/materiale/${storyname}Edition/work-of:870970-basis:${storyname}`,
        query: query,
      },
    },
  };
}

export function AlternativeOptionsNoAlternatives() {
  return (
    <AlternativeOptionsComponentBuilder
      storyNameOverride={"AlternativeOptionsNoAlternatives"}
    />
  );
}
AlternativeOptionsNoAlternatives.story = {
  ...AlternativeOptionsStoryBuilder("AlternativeOptionsNoAlternatives", {
    Query: {
      manifestations: () => {},
    },
  }),
};

export function AlternativeOptionsWithAlternatives() {
  return (
    <AlternativeOptionsComponentBuilder
      storyNameOverride={"AlternativeOptionsWithAlternatives"}
    />
  );
}
AlternativeOptionsWithAlternatives.story = {
  ...AlternativeOptionsStoryBuilder("AlternativeOptionsWithAlternatives", {
    Query: {
      manifestations: () => {
        return [
          {
            access: [
              { loanIsPossible: true },
              {
                url: "notambo.dk",
                type: "RESOURCE",
                __typename: AccessEnum.ACCESS_URL,
              },
              {
                id: 123,
                __typename: AccessEnum.INFOMEDIA_SERVICE,
              },
            ],
          },
        ];
      },
    },
  }),
};

export function AlternativeOptionsSlowResponse() {
  return (
    <AlternativeOptionsComponentBuilder
      storyNameOverride={"AlternativeOptionsSlowResponse"}
    />
  );
}
AlternativeOptionsSlowResponse.story = {
  ...AlternativeOptionsStoryBuilder("AlternativeOptionsSlowResponse", {
    Query: {
      manifestations: async () => {
        // Simulate slow access response, wait 5000ms
        await new Promise((r) => {
          setTimeout(r, 5000);
        });

        return [
          {
            access: [
              { loanIsPossible: true },
              {
                url: "notambo.dk",
                type: "RESOURCE",
                __typename: AccessEnum.ACCESS_URL,
              },
            ],
          },
        ];
      },
    },
  }),
};
