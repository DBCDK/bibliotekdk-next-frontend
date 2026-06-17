import { StoryTitle, StoryDescription } from "@/storybook";
import LocalizationsLink from "@/components/work/overview/localizationslink/LocalizationsLink";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const exportedObject = {
  title: "work/Overview/LocalizationsLink",
};

export default exportedObject;

const { DEFAULT_STORY_PARAMETERS } = automock_utils();

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
  const descriptionName = storyNameOverride ? storyNameOverride : type;

  return (
    <div>
      <StoryTitle>LocalizationsLink - {descriptionName}</StoryTitle>
      <StoryDescription>
        LocalizationsLink with description: {descriptionName}
      </StoryDescription>
      <LocalizationsLink selectedPids={localizationsLinkProps?.selectedPids} />
    </div>
  );
}

export function LocalizationsLinkPreferredOnline() {
  const localizationsLinkProps = {
    selectedPids: ["some-pid-7"],
  };

  return (
    <LocalizationsLinkComponentBuilder
      localizationsLinkProps={localizationsLinkProps}
      storyNameOverride={"LocalizationsLinkPreferredOnline"}
    />
  );
}
const LocalizationsLinkPreferredOnlineStory = merge(
  {},
  DEFAULT_STORY_PARAMETERS,
  {
    parameters: {
      graphql: {
        resolvers: {},
      },
    },
  }
);
LocalizationsLinkPreferredOnline.parameters =
  LocalizationsLinkPreferredOnlineStory.parameters;
LocalizationsLinkPreferredOnline.args =
  LocalizationsLinkPreferredOnlineStory.args;
LocalizationsLinkPreferredOnline.decorators =
  LocalizationsLinkPreferredOnlineStory.decorators;
LocalizationsLinkPreferredOnline.storyName =
  LocalizationsLinkPreferredOnlineStory.name ||
  LocalizationsLinkPreferredOnlineStory.storyName;
export function LocalizationsLinkNoAvailable() {
  const localizationLinkProps = {
    selectedPids: ["some-pid-1"],
  };

  return (
    <LocalizationsLinkComponentBuilder
      storyNameOverride={"LocalizationsLinkNoAvailable"}
      localizationsLinkProps={localizationLinkProps}
    />
  );
}
const LocalizationsLinkNoAvailableStory = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          localizations: () => {
            return {
              count: 0,
            };
          },
        },
      },
    },
  },
});
LocalizationsLinkNoAvailable.parameters =
  LocalizationsLinkNoAvailableStory.parameters;
LocalizationsLinkNoAvailable.args = LocalizationsLinkNoAvailableStory.args;
LocalizationsLinkNoAvailable.decorators =
  LocalizationsLinkNoAvailableStory.decorators;
LocalizationsLinkNoAvailable.storyName =
  LocalizationsLinkNoAvailableStory.name ||
  LocalizationsLinkNoAvailableStory.storyName;
export function LocalizationsLinkAvailableAtLibraries() {
  const localizationLinkProps = {
    selectedPids: ["some-pid-1"],
  };

  return (
    <LocalizationsLinkComponentBuilder
      storyNameOverride={"LocalizationsLinkNoAvailable"}
      localizationsLinkProps={localizationLinkProps}
    />
  );
}
const LocalizationsLinkAvailableAtLibrariesStory = merge(
  {},
  DEFAULT_STORY_PARAMETERS,
  {
    parameters: {
      graphql: {
        resolvers: {},
      },
    },
  }
);
LocalizationsLinkAvailableAtLibraries.parameters =
  LocalizationsLinkAvailableAtLibrariesStory.parameters;
LocalizationsLinkAvailableAtLibraries.args =
  LocalizationsLinkAvailableAtLibrariesStory.args;
LocalizationsLinkAvailableAtLibraries.decorators =
  LocalizationsLinkAvailableAtLibrariesStory.decorators;
LocalizationsLinkAvailableAtLibraries.storyName =
  LocalizationsLinkAvailableAtLibrariesStory.name ||
  LocalizationsLinkAvailableAtLibrariesStory.storyName;
export function LocalizationsLinkNoIllButAvailableAtLibraries() {
  const localizationLinkProps = {
    selectedPids: ["some-pid-1"],
  };

  return (
    <LocalizationsLinkComponentBuilder
      storyNameOverride={"No ILL but material is owned by a library"}
      localizationsLinkProps={localizationLinkProps}
    />
  );
}
const LocalizationsLinkNoIllButAvailableAtLibrariesStory = merge(
  {},
  DEFAULT_STORY_PARAMETERS,
  {
    parameters: {
      graphql: {
        resolvers: {
          Query: {
            localizations: () => {
              return { count: 1 };
            },
          },
          Manifestation: {
            accessTypes: [{ code: "PHYSICAL" }],
            access: () => [],
          },
        },
      },
    },
  }
);
LocalizationsLinkNoIllButAvailableAtLibraries.parameters =
  LocalizationsLinkNoIllButAvailableAtLibrariesStory.parameters;
LocalizationsLinkNoIllButAvailableAtLibraries.args =
  LocalizationsLinkNoIllButAvailableAtLibrariesStory.args;
LocalizationsLinkNoIllButAvailableAtLibraries.decorators =
  LocalizationsLinkNoIllButAvailableAtLibrariesStory.decorators;
LocalizationsLinkNoIllButAvailableAtLibraries.storyName =
  LocalizationsLinkNoIllButAvailableAtLibrariesStory.name ||
  LocalizationsLinkNoIllButAvailableAtLibrariesStory.storyName;
export function LocalizationsLinkSlowResponse() {
  const localizationLinkProps = {
    selectedPids: ["some-pid-1"],
  };

  return (
    <LocalizationsLinkComponentBuilder
      storyNameOverride={"LocalizationsLinkNoAvailable"}
      localizationsLinkProps={localizationLinkProps}
    />
  );
}

const LocalizationsLinkSlowResponseStory = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          localizations: async () => {
            // Simulate slow access response, wait 5000ms
            await new Promise((r) => {
              setTimeout(r, 5000);
            });
            return { count: 10 };
          },
        },
      },
    },
  },
});
LocalizationsLinkSlowResponse.parameters =
  LocalizationsLinkSlowResponseStory.parameters;
LocalizationsLinkSlowResponse.args = LocalizationsLinkSlowResponseStory.args;
LocalizationsLinkSlowResponse.decorators =
  LocalizationsLinkSlowResponseStory.decorators;
LocalizationsLinkSlowResponse.storyName =
  LocalizationsLinkSlowResponseStory.name ||
  LocalizationsLinkSlowResponseStory.storyName;
