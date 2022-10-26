import { StoryDescription, StoryTitle } from "@/storybook";
import { OrderButtonTextBelow } from "@/components/work/reservationbutton/orderbuttontextbelow/OrderButtonTextBelow";

const exportedObject = {
  title: "work/ReservationButton/OrderButtonTextBelow",
};

export default exportedObject;

function ButtonTxtComponentBuilder({
  type = "Bog",
  workId = "some-id-builder",
  storyNameOverride = null,
}) {
  const descriptionName = storyNameOverride ? storyNameOverride : type;
  return (
    <div>
      <StoryTitle>ButtonTxt - {descriptionName}</StoryTitle>
      <StoryDescription>
        The button text based on the type: {descriptionName}
      </StoryDescription>
      <OrderButtonTextBelow workId={workId} type={type} skeleton={false} />
    </div>
  );
}

function ButtonTxtStoryBuilder(storyname, resolvers = {}, query = {}) {
  return {
    parameters: {
      graphql: {
        debug: true,
        resolvers: resolvers,
        url: "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql",
      },
      nextRouter: {
        showInfo: true,
        pathname: `/materiale/${storyname}ButtonTxt/work-of:870970-basis:${storyname}`,
        query: query,
      },
    },
  };
}

export function BookButtonTxt() {
  return <ButtonTxtComponentBuilder type={"Bog"} workId={"some-id-book"} />;
}

BookButtonTxt.story = {
  ...ButtonTxtStoryBuilder("Book", {
    MaterialType: {
      specific: () => "Bog",
    },
    InterLibraryLoan: {
      loanIsPossible: () => true,
    },
    Access: {
      __resolveType: () => "InterLibraryLoan",
    },
  }),
};

export function EBookButtonTxt() {
  return <ButtonTxtComponentBuilder type={"ebog"} workId={"some-id-e-book"} />;
}
EBookButtonTxt.story = {
  ...ButtonTxtStoryBuilder("EBook", {
    MaterialType: {
      specific: () => "e-bog",
    },
    Ereol: {
      url: () => "ereol.combo",
    },
    Access: {
      __resolveType: () => "Ereol",
    },
  }),
};

export function EAudioBookPhysicalButtonTxt() {
  return (
    <ButtonTxtComponentBuilder
      type={"Lydbog (cd-mp3)"}
      workId={"some-id-physical-book"}
    />
  );
}
EAudioBookPhysicalButtonTxt.story = {
  ...ButtonTxtStoryBuilder("Lydbog (cd-mp3)", {
    MaterialType: {
      specific: () => "lydbog (cd-mp3)",
    },
    InterLibraryLoan: {
      loanIsPossible: () => true,
    },
    Access: {
      __resolveType: () => "InterLibraryLoan",
    },
  }),
};

export function EAudioBookDigitalButtonTxt() {
  return (
    <ButtonTxtComponentBuilder
      type={"Lydbog (net)"}
      workId={"some-id-e-audio-book"}
    />
  );
}
EAudioBookDigitalButtonTxt.story = {
  ...ButtonTxtStoryBuilder("Lydbog (net)", {
    MaterialType: {
      specific: () => "lydbog (net)",
    },
    AccessUrl: {
      origin: () => "notambo.dekå",
      loginRequired: () => false,
    },
    Access: {
      __resolveType: () => "AccessUrl",
    },
  }),
};

export function PeriodicaButtonTxt() {
  return (
    <ButtonTxtComponentBuilder
      type={"bog"}
      workId={"some-id-periodica"}
      storyNameOverride={"Periodica"}
    />
  );
}
PeriodicaButtonTxt.story = {
  ...ButtonTxtStoryBuilder("Periodica", {
    AccessUrl: {
      origin: () => "some-origin",
    },
    Work: {
      workTypes: () => ["PERIODICA"],
    },
    Manifestation: {
      access: () => [],
    },
  }),
};
