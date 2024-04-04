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
LocalizationsLinkPreferredOnline.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

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
LocalizationsLinkNoAvailable.story = merge({}, DEFAULT_STORY_PARAMETERS, {
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
LocalizationsLinkAvailableAtLibraries.story = merge(
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
LocalizationsLinkNoIllButAvailableAtLibraries.story = merge(
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

LocalizationsLinkSlowResponse.story = merge({}, DEFAULT_STORY_PARAMETERS, {
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
