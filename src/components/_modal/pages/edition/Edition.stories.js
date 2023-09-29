import Edition from "@/components/_modal/pages/edition/Edition";
import { StoryDescription, StoryTitle } from "@/storybook";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const exportedObject = {
  title: "modal/Edition",
};

export default exportedObject;

const { DEFAULT_STORY_PARAMETERS, USER_3, BRANCH_3 } = automock_utils();

/** EditionComponentBuilder
 * @param {string} type
 * @param {Object<Object<string, Array, boolean>, boolean, boolean>} editionProps
 * @param {string} storyNameOverride
 */
function EditionComponentBuilder({
  editionProps,
  type = "Bog",
  storyNameOverride = null,
}) {
  const descriptionName = storyNameOverride ? storyNameOverride : type;

  return (
    <div>
      <StoryTitle>Edition - {descriptionName}</StoryTitle>
      <StoryDescription>
        The Edition on the type: {descriptionName}
      </StoryDescription>
      <Edition
        context={editionProps.context}
        singleManifestation={editionProps.singleManifestation}
        showOrderTxt={editionProps.showOrderTxt}
      />
    </div>
  );
}

export function EditionSingleManifestation() {
  const editionProps = {
    context: {
      workId: "some-work-id",
      pids: ["some-pid-6"],
      orderPids: ["some-pid-6"],
      periodicaForm: false,
    },
    singleManifestation: true,
    showOrderTxt: true,
  };

  return (
    <EditionComponentBuilder
      editionProps={editionProps}
      storyNameOverride={"SingleManifestation"}
    />
  );
}
EditionSingleManifestation.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

export function EditionSingleManifestationNoOrderTxt() {
  const editionProps = {
    context: {
      workId: "some-work-id",
      pids: ["some-pid-6"],
      orderPids: ["some-pid-6"],
      periodicaForm: false,
    },
    singleManifestation: true,
    showOrderTxt: false,
  };

  return (
    <EditionComponentBuilder
      editionProps={editionProps}
      storyNameOverride={"SingleManifestationNoOrderTxt"}
    />
  );
}

EditionSingleManifestationNoOrderTxt.story = merge(
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

export function EditionAnyManifestation() {
  const editionProps = {
    context: {
      workId: "some-work-id",
      pids: ["some-pid-6"],
      orderPids: ["some-pid-6"],
      periodicaForm: false,
    },
    singleManifestation: false,
    showOrderTxt: true,
  };

  return (
    <EditionComponentBuilder
      editionProps={editionProps}
      storyNameOverride={"AnyManifestation"}
    />
  );
}

// EditionAnyManifestation.story = { ...resolvers("AnyManifestation") };
EditionAnyManifestation.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

export function EditionAnyManifestationNoOrderTxt() {
  const editionProps = {
    context: {
      workId: "some-work-id",
      pids: ["some-pid-6"],
      orderPids: ["some-pid-6"],
      periodicaForm: false,
    },
    singleManifestation: false,
    showOrderTxt: false,
  };

  return (
    <EditionComponentBuilder
      editionProps={editionProps}
      storyNameOverride={"AnyManifestation"}
    />
  );
}

EditionAnyManifestationNoOrderTxt.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});
export function EditionAnyManifestationDigitalCopy() {
  const editionProps = {
    context: {
      workId: "some-work-id",
      pids: ["some-pid-4"],
      orderPids: ["some-pid-4"],
      periodicaForm: false,
    },
    singleManifestation: false,
    showOrderTxt: true,
  };

  return (
    <EditionComponentBuilder
      editionProps={editionProps}
      storyNameOverride={"EditionAnyManifestationDigitalCopy"}
    />
  );
}

EditionAnyManifestationDigitalCopy.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          user: () => USER_3,
          branches: () => {
            return {
              result: [BRANCH_3],
            };
          },
        },
      },
    },
  },
});
