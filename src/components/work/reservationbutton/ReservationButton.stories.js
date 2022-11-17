import { StoryDescription, StoryTitle } from "@/storybook";
import ReservationButton, {
  OrderButton,
} from "@/components/work/reservationbutton/ReservationButton";
import { dummy_workDataApi } from "@/components/work/dummy.workDataApi";
import { AccessEnum } from "@/lib/enums";

const exportedObject = {
  title: "work/ReservationButton",
};

export default exportedObject;

function ReservationButtonComponentBuilder({
  type = "Bog",
  workId = "some-id-builder",
  selectedPids = ["some-other-id-builder"],
  storyNameOverride = null,
}) {
  const date = new Date();
  const time = date.getTime();

  const descriptionName = storyNameOverride ? storyNameOverride : type;
  return (
    <div>
      <StoryTitle>OrderButton - {descriptionName}</StoryTitle>
      <StoryDescription>
        The OrderButton based on the type: {descriptionName}
      </StoryDescription>
      <ReservationButton
        workId={workId + time}
        selectedPids={selectedPids.map((pid) => pid + time)}
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
        url: "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql",
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
  return <ReservationButtonComponentBuilder type={"Bog"} />;
}
ReservationButtonPhysicalBook.story = {
  ...ReservationButtonStoryBuilder("Book", {
    Query: {
      work: () => {
        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "Bog" }],
          workTypes: ["LITERATURE"],
        };
      },
      manifestations: () => {
        return [
          {
            materialTypes: [{ specific: "Bog" }],
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
          },
        ];
      },
    },
  }),
};

export function ReservationButtonEBook() {
  return <ReservationButtonComponentBuilder type={"Ebog"} />;
}
ReservationButtonEBook.story = {
  ...ReservationButtonStoryBuilder("Ebog", {
    Query: {
      work: () => {
        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "Ebog" }],
          workTypes: ["LITERATURE"],
        };
      },
      manifestations: () => {
        return [
          {
            materialTypes: [{ specific: "Ebog" }],
            accessTypes: [
              {
                display: "online",
              },
            ],
            access: [
              {
                __resolveType: AccessEnum.EREOL,
                url: "ereol.combo",
              },
            ],
            workTypes: ["LITERATURE"],
          },
        ];
      },
    },
  }),
};

export function ReservationButtonEAudioBook() {
  return <ReservationButtonComponentBuilder type={"EAudioBook"} />;
}
ReservationButtonEAudioBook.story = {
  ...ReservationButtonStoryBuilder("EAudioBook", {
    Query: {
      work: () => {
        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "lydbog (net)" }],
          workTypes: ["LITERATURE"],
        };
      },
      manifestations: () => {
        return [
          {
            materialTypes: [{ specific: "lydbog (net)" }],
            accessTypes: [
              {
                display: "online",
              },
            ],
            access: [
              {
                __resolveType: AccessEnum.EREOL,
                url: "ereol.combo",
              },
            ],
          },
        ];
      },
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
    Query: {
      work: () => {
        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "Playstation 4" }],
          workTypes: ["GAME"],
        };
      },
      manifestations: () => {
        return [
          {
            materialTypes: [{ specific: "Playstation 4" }],
            accessTypes: [
              {
                display: "online",
              },
            ],
            access: [
              {
                __resolveType: AccessEnum.INTER_LIBRARY_LOAN,
                loanIsPossible: true,
              },
            ],
          },
        ];
      },
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
    Query: {
      work: () => {
        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "EBog" }],
          workTypes: ["LITERATURE"],
        };
      },
      manifestations: () => {
        return [
          {
            materialTypes: [{ specific: "EBog" }],
            accessTypes: [
              {
                display: "online",
              },
            ],
            access: [],
          },
        ];
      },
    },
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
        manifestations={data?.work?.manifestations?.all}
        onHandleGoToLogin={() => alert("DU SKAL LOGGE IND")}
      />
    </div>
  );
}

export function ReservationButtonPhysicalBookLoanNotPossible() {
  return <ReservationButtonComponentBuilder type={"Bog"} />;
}
ReservationButtonPhysicalBookLoanNotPossible.story = {
  ...ReservationButtonStoryBuilder("Book", {
    Query: {
      work: () => {
        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "Bog" }],
          workTypes: ["LITERATURE"],
        };
      },
      manifestations: () => {
        return [
          {
            materialTypes: [{ specific: "Bog" }],
            accessTypes: [
              {
                display: "fysisk",
              },
            ],
            access: [],
            workTypes: ["LITERATURE"],
          },
        ];
      },
    },
  }),
};

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
