import { StoryDescription, StoryTitle } from "@/storybook";
import ReservationButton, {
  OrderButton,
} from "@/components/work/reservationbutton/ReservationButton";
import { dummy_workDataApi } from "@/components/work/dummy.workDataApi";

const exportedObject = {
  title: "work/ReservationButton",
};

export default exportedObject;

function ReservationButtonComponentBuilder({
  type = "Bog",
  workId = "some-id-builder",
  storyNameOverride = null,
}) {
  const descriptionName = storyNameOverride ? storyNameOverride : type;
  return (
    <div>
      <StoryTitle>OrderButton - {descriptionName}</StoryTitle>
      <StoryDescription>
        The OrderButton based on the type: {descriptionName}
      </StoryDescription>
      <ReservationButton
        workId={workId}
        chosenMaterialType={type}
        onOnlineAccess={() => {}}
        openOrderModal={() => {}}
        singleManifestation={false}
        buttonType={"primary"}
        size={"large"}
      />
    </div>
  );
}

function ReservationButtonStoryBuilder(storyname, resolvers = {}, query = {}) {
  return {
    parameters: {
      graphql: {
        debug: true,
        resolvers: resolvers,
        url:
          "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql" ||
          "https://alfa-api.stg.bibliotek.dk/190101/bibdk21/graphql",
      },
      nextRouter: {
        showInfo: true,
        pathname: `/materiale/${storyname}ReservationButton/work-of:870970-basis:${storyname}`,
        query: query,
      },
    },
  };
}

export function ReservationButtonPhysicalBook() {
  return (
    <ReservationButtonComponentBuilder workId={"some-id-book"} type={"Bog"} />
  );
}
ReservationButtonPhysicalBook.story = {
  ...ReservationButtonStoryBuilder("Book", {
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

export function ReservationButtonEBook() {
  return (
    <ReservationButtonComponentBuilder
      workId={"some-id-e-book"}
      type={"EBog"}
    />
  );
}
ReservationButtonEBook.story = {
  ...ReservationButtonStoryBuilder("EBook", {
    MaterialType: {
      specific: () => "EBog",
    },
    Ereol: {
      url: () => "ereol.combo",
    },
    Access: {
      __resolveType: () => "Ereol",
    },
    AccessType: {
      display: () => "some-display",
    },
    Work: {
      workTypes: () => ["LITERATURE"],
    },
  }),
};

export function ReservationButtonEAudioBook() {
  return (
    <ReservationButtonComponentBuilder
      workId={"some-id-e-audio-book"}
      type={"EBog"}
    />
  );
}
ReservationButtonEAudioBook.story = {
  ...ReservationButtonStoryBuilder("EBook", {
    MaterialType: {
      specific: () => "EBog",
    },
    Ereol: {
      url: () => "ereol.combo",
    },
    Access: {
      __resolveType: () => "Ereol",
    },
    AccessType: {
      display: () => "some-display",
    },
    Work: {
      workTypes: () => ["LITERATURE"],
    },
  }),
};

export function ReservationButtonGame() {
  return (
    <ReservationButtonComponentBuilder
      workId={"some-id-game"}
      type={"Playstation 4"}
    />
  );
}
ReservationButtonGame.story = {
  ...ReservationButtonStoryBuilder("Playstation 4", {
    MaterialType: {
      specific: () => "Playstation 4",
    },
    InterLibraryLoan: {
      loanIsPossible: () => true,
    },
    Access: {
      __resolveType: () => "InterLibraryLoan",
    },
    Work: {
      workTypes: () => ["GAME"],
    },
  }),
};

export function ReservationButtonDisabled() {
  return (
    <ReservationButtonComponentBuilder
      workId={"some-id-button-disabled"}
      type={"Ebog"}
    />
  );
}
ReservationButtonDisabled.story = {
  ...ReservationButtonStoryBuilder("Button disabled", {
    MaterialType: {
      specific: () => "Ebog",
    },
    Access: {
      __resolveType: () => "InfomediaService",
    },
    Work: {
      workTypes: () => ["LITERATURE"],
    },
    Manifestations: {
      all: () => [],
    },
  }),
};

export function OrderButtonNotLoggedIn() {
  const workId = "some-id-button-not-logged-in";
  const descriptionName = "Not logged in";
  const user = { isAuthenticated: false };
  const data = dummy_workDataApi({ workId });

  return (
    <div>
      <StoryTitle>OrderButton - {descriptionName}</StoryTitle>
      <StoryDescription>
        The OrderButton based on the type: {descriptionName}
      </StoryDescription>
      <OrderButton
        user={user}
        chosenMaterialType={"avisartikel"}
        work={data?.work}
      />
    </div>
  );
}

export function ReservationButtonSlowResponse() {
  return (
    <ReservationButtonComponentBuilder
      workId={"some-slow-id-book"}
      type={"Slow response"}
    />
  );
}
ReservationButtonSlowResponse.story = {
  ...ReservationButtonStoryBuilder("Slow", {
    Manifestation: {
      access: async () => {
        // Simulate slow access response, wait 5000ms
        await new Promise((r) => {
          setTimeout(r, 5000);
        });

        return [{}];
      },
    },
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
