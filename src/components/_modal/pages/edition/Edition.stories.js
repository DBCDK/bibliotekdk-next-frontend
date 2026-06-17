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
  isMaterialCard = false,
}) {
  const descriptionName = storyNameOverride ? storyNameOverride : type;

  return (
    <div>
      <StoryTitle>Edition - {descriptionName}</StoryTitle>
      <StoryDescription>
        The Edition on the type: {descriptionName}
      </StoryDescription>
      <Edition
        {...editionProps.context}
        singleManifestation={editionProps.singleManifestation}
        showOrderTxt={editionProps.showOrderTxt}
        isMaterialCard={isMaterialCard}
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
const EditionSingleManifestationStory = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});
EditionSingleManifestation.parameters =
  EditionSingleManifestationStory.parameters;
EditionSingleManifestation.args = EditionSingleManifestationStory.args;
EditionSingleManifestation.decorators =
  EditionSingleManifestationStory.decorators;
EditionSingleManifestation.storyName =
  EditionSingleManifestationStory.name ||
  EditionSingleManifestationStory.storyName;
export function EditionSingleManifestationImageToLeft() {
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
      isMaterialCard={true}
    />
  );
}
const EditionSingleManifestationImageToLeftStory = merge(
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
EditionSingleManifestationImageToLeft.parameters =
  EditionSingleManifestationImageToLeftStory.parameters;
EditionSingleManifestationImageToLeft.args =
  EditionSingleManifestationImageToLeftStory.args;
EditionSingleManifestationImageToLeft.decorators =
  EditionSingleManifestationImageToLeftStory.decorators;
EditionSingleManifestationImageToLeft.storyName =
  EditionSingleManifestationImageToLeftStory.name ||
  EditionSingleManifestationImageToLeftStory.storyName;
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

const EditionSingleManifestationNoOrderTxtStory = merge(
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
EditionSingleManifestationNoOrderTxt.parameters =
  EditionSingleManifestationNoOrderTxtStory.parameters;
EditionSingleManifestationNoOrderTxt.args =
  EditionSingleManifestationNoOrderTxtStory.args;
EditionSingleManifestationNoOrderTxt.decorators =
  EditionSingleManifestationNoOrderTxtStory.decorators;
EditionSingleManifestationNoOrderTxt.storyName =
  EditionSingleManifestationNoOrderTxtStory.name ||
  EditionSingleManifestationNoOrderTxtStory.storyName;
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

const EditionAnyManifestationStory = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});
EditionAnyManifestation.parameters = EditionAnyManifestationStory.parameters;
EditionAnyManifestation.args = EditionAnyManifestationStory.args;
EditionAnyManifestation.decorators = EditionAnyManifestationStory.decorators;
EditionAnyManifestation.storyName =
  EditionAnyManifestationStory.name || EditionAnyManifestationStory.storyName;
export function EditionAnyManifestationImageToLeft() {
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
      storyNameOverride={"AnyManifestation - image to the left"}
      isMaterialCard={true}
    />
  );
}

const EditionAnyManifestationImageToLeftStory = merge(
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
EditionAnyManifestationImageToLeft.parameters =
  EditionAnyManifestationImageToLeftStory.parameters;
EditionAnyManifestationImageToLeft.args =
  EditionAnyManifestationImageToLeftStory.args;
EditionAnyManifestationImageToLeft.decorators =
  EditionAnyManifestationImageToLeftStory.decorators;
EditionAnyManifestationImageToLeft.storyName =
  EditionAnyManifestationImageToLeftStory.name ||
  EditionAnyManifestationImageToLeftStory.storyName;
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

const EditionAnyManifestationNoOrderTxtStory = merge(
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
EditionAnyManifestationNoOrderTxt.parameters =
  EditionAnyManifestationNoOrderTxtStory.parameters;
EditionAnyManifestationNoOrderTxt.args =
  EditionAnyManifestationNoOrderTxtStory.args;
EditionAnyManifestationNoOrderTxt.decorators =
  EditionAnyManifestationNoOrderTxtStory.decorators;
EditionAnyManifestationNoOrderTxt.storyName =
  EditionAnyManifestationNoOrderTxtStory.name ||
  EditionAnyManifestationNoOrderTxtStory.storyName;
export function EditionAnyManifestationNoOrderTxtImageToLeft() {
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
      isMaterialCard={true}
    />
  );
}

const EditionAnyManifestationNoOrderTxtImageToLeftStory = merge(
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
EditionAnyManifestationNoOrderTxtImageToLeft.parameters =
  EditionAnyManifestationNoOrderTxtImageToLeftStory.parameters;
EditionAnyManifestationNoOrderTxtImageToLeft.args =
  EditionAnyManifestationNoOrderTxtImageToLeftStory.args;
EditionAnyManifestationNoOrderTxtImageToLeft.decorators =
  EditionAnyManifestationNoOrderTxtImageToLeftStory.decorators;
EditionAnyManifestationNoOrderTxtImageToLeft.storyName =
  EditionAnyManifestationNoOrderTxtImageToLeftStory.name ||
  EditionAnyManifestationNoOrderTxtImageToLeftStory.storyName;
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

const EditionAnyManifestationDigitalCopyStory = merge(
  {},
  DEFAULT_STORY_PARAMETERS,
  {
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
  }
);
EditionAnyManifestationDigitalCopy.parameters =
  EditionAnyManifestationDigitalCopyStory.parameters;
EditionAnyManifestationDigitalCopy.args =
  EditionAnyManifestationDigitalCopyStory.args;
EditionAnyManifestationDigitalCopy.decorators =
  EditionAnyManifestationDigitalCopyStory.decorators;
EditionAnyManifestationDigitalCopy.storyName =
  EditionAnyManifestationDigitalCopyStory.name ||
  EditionAnyManifestationDigitalCopyStory.storyName;
export function EditionAnyManifestationDigitalCopyImageToLeft() {
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
      storyNameOverride={
        "Edition Any Manifestation Digital Copy - image to the left"
      }
      isMaterialCard={true}
    />
  );
}

const EditionAnyManifestationDigitalCopyImageToLeftStory = merge(
  {},
  DEFAULT_STORY_PARAMETERS,
  {
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
  }
);
EditionAnyManifestationDigitalCopyImageToLeft.parameters =
  EditionAnyManifestationDigitalCopyImageToLeftStory.parameters;
EditionAnyManifestationDigitalCopyImageToLeft.args =
  EditionAnyManifestationDigitalCopyImageToLeftStory.args;
EditionAnyManifestationDigitalCopyImageToLeft.decorators =
  EditionAnyManifestationDigitalCopyImageToLeftStory.decorators;
EditionAnyManifestationDigitalCopyImageToLeft.storyName =
  EditionAnyManifestationDigitalCopyImageToLeftStory.name ||
  EditionAnyManifestationDigitalCopyImageToLeftStory.storyName;
