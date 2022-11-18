import { StoryTitle, StoryDescription } from "@/storybook";
import LocalizationsLink from "@/components/work/overview/localizationslink/LocalizationsLink";

const exportedObject = {
  title: "work/Overview/LocalizationsLink",
};

export default exportedObject;

/** LocalizationsLinkComponentBuilder
 * @param {string} type
 * @param {Object<Object<string, Array, boolean>, boolean, boolean>} editionProps
 * @param {string} storyNameOverride
 */
function LocalizationsLinkComponentBuilder({
  localizationsLinkProps,
  type = "Bog",
  storyNameOverride = null,
}) {
  const date = new Date();
  let time = date.getTime();

  const descriptionName = storyNameOverride ? storyNameOverride : type;

  const workId = localizationsLinkProps?.workId || "some-workId" + time;
  const selectedPids = localizationsLinkProps?.selectedPids || [
    "some-pid-0" + time,
    "some-pid-1" + time,
  ];

  return (
    <div>
      <StoryTitle>LocalizationsLink - {descriptionName}</StoryTitle>
      <StoryDescription>
        LocalizationsLink with description: {descriptionName}
      </StoryDescription>
      <LocalizationsLink workId={workId} selectedPids={selectedPids} />
    </div>
  );
}

function LocalizationsLinkStoryBuilder(storyname, resolvers = {}, query = {}) {
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

export function LocalizationsLinkPreferredOnline() {
  const localizationsLinkProps = {
    workId: "some-workId-not-available",
    selectedPids: ["some-pid-0", "some-pid-1"],
  };

  return (
    <LocalizationsLinkComponentBuilder
      localizationsLinkProps={localizationsLinkProps}
      storyNameOverride={"LocalizationsLinkPreferredOnline"}
    />
  );
}
LocalizationsLinkPreferredOnline.story = {
  ...LocalizationsLinkStoryBuilder("LocalizationsLinkPreferredOnline", {
    Query: {
      work: () => {
        return {
          manifestations: {
            all: [
              {
                pid: "some-pid-0",
                materialTypes: [{ specific: "lydbog (net)" }],
              },
            ],
          },
        };
      },
    },
  }),
};

export function LocalizationsLinkNoAvailable() {
  return (
    <LocalizationsLinkComponentBuilder
      storyNameOverride={"LocalizationsLinkNoAvailable"}
    />
  );
}
LocalizationsLinkNoAvailable.story = {
  ...LocalizationsLinkStoryBuilder("LocalizationsLinkNoAvailable", {
    Query: {
      localizations: () => {
        return {
          count: 0,
        };
      },
    },
  }),
};

export function LocalizationsLinkAvailableAtLibraries() {
  return (
    <LocalizationsLinkComponentBuilder
      storyNameOverride={"LocalizationsLinkNoAvailable"}
    />
  );
}
LocalizationsLinkAvailableAtLibraries.story = {
  ...LocalizationsLinkStoryBuilder("LocalizationsLinkAvailableAtLibraries", {}),
};

export function LocalizationsLinkSlowResponse() {
  return (
    <LocalizationsLinkComponentBuilder
      storyNameOverride={"LocalizationsLinkNoAvailable"}
    />
  );
}
LocalizationsLinkSlowResponse.story = {
  ...LocalizationsLinkStoryBuilder("LocalizationsLinkSlowResponse", {
    Query: {
      localizations: async () => {
        // Simulate slow access response, wait 5000ms
        await new Promise((r) => {
          setTimeout(r, 5000);
        });

        return { count: 10 };
      },
    },
  }),
};
