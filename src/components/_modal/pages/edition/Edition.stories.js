import Edition from "@/components/_modal/pages/edition/Edition";
import { StoryDescription, StoryTitle } from "@/storybook";

const exportedObject = {
  title: "modal/Edition",
};

export default exportedObject;

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

function EditionStoryBuilder(storyname, resolvers = {}, query = {}) {
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
    ...EditionStoryBuilder(`${storyname}`, {
      Manifestation: {
        publisher: () => ["Sølvbakke"],
        creators: () => [{}],
      },
      ManifestationTitles: {
        full: () => ["Hugo i Sølvskoven"],
      },
      Person: {
        display: () => "Linoleum Gummigulv",
      },
      PublicationYear: {
        display: () => "3001",
      },
      Edition: {
        edition: () => "109. udgave",
      },
      MaterialType: {
        specific: () => "Bog",
      },
    }),
  };
}

export function EditionSingleManifestation() {
  const editionProps = {
    context: {
      workId: "some-work-id",
      pids: ["some-pid-1"],
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
EditionSingleManifestation.story = {
  ...resolvers("SingleManifestation"),
};

export function EditionSingleManifestationNoOrderTxt() {
  const editionProps = {
    context: {
      workId: "some-work-id",
      pids: ["some-pid-1"],
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

EditionSingleManifestationNoOrderTxt.story = {
  ...resolvers("SingleManifestationNoOrderTxt"),
};

export function EditionAnyManifestation() {
  const editionProps = {
    context: {
      workId: "some-work-id",
      pids: ["some-pid-1"],
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

EditionAnyManifestation.story = { ...resolvers("AnyManifestation") };

export function EditionAnyManifestationNoOrderTxt() {
  const editionProps = {
    context: {
      workId: "some-work-id",
      pids: ["some-pid-1"],
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

EditionAnyManifestationNoOrderTxt.story = {
  ...resolvers("AnyManifestationNoOrderTxt"),
};
