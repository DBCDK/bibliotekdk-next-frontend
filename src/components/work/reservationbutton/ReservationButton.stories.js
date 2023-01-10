import { StoryDescription, StoryTitle } from "@/storybook";
import ReservationButton, {
  OrderButton,
} from "@/components/work/reservationbutton/ReservationButton";
import { AccessEnum } from "@/lib/enums";
import automock_utils from "@/components/_modal/pages/automock_utils";
import merge from "lodash/merge";

const exportedObject = {
  title: "work/ReservationButton",
};

export default exportedObject;

const date = new Date();
const time = date.getTime();

const { DEFAULT_STORY_PARAMETERS, useMockLoanerInfo } = automock_utils();

function ReservationButtonComponentBuilder({
  type = "bog",
  workId = "some-id-builder" + time,
  selectedPids = ["some-other-id-builder" + time],
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
        selectedPids={selectedPids.map((pid) => pid)}
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
  return (
    <ReservationButtonComponentBuilder
      type={"bog"}
      workId={"some-work-id-1"}
      selectedPids={["some-pid-1"]}
    />
  );
}

ReservationButtonPhysicalBook.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

export function ReservationButtonEBook() {
  useMockLoanerInfo("790900");
  return (
    <ReservationButtonComponentBuilder
      type={["ebog"]}
      workId={"some-work-id-4"}
      selectedPids={["some-pid-7"]}
    />
  );
}
ReservationButtonEBook.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

export function ReservationButtonEAudioBook() {
  return (
    <ReservationButtonComponentBuilder
      type={"EAudioBook"}
      selectedPids={["some-pid-lydbog-(net)" + time]}
    />
  );
}
ReservationButtonEAudioBook.story = {
  ...ReservationButtonStoryBuilder("EAudioBook", {
    Query: {
      work: () => {
        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "lydbog (net)" }],
          workTypes: ["LITERATURE"],
          manifestations: {
            all: [
              {
                pid: "some-pid-lydbog-(net)" + time,
              },
            ],
          },
        };
      },
      manifestations: () => {
        return [
          {
            pid: "some-pid-lydbog-(net)" + time,
            materialTypes: [{ specific: "lydbog (net)" }],
            access: [
              {
                __resolveType: AccessEnum.EREOL,
                url: "https://ereol.combo",
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
      selectedPids={["some-pid-game" + time]}
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
          manifestations: {
            all: [
              {
                pid: "some-pid-game" + time,
              },
            ],
          },
        };
      },
      manifestations: () => {
        return [
          {
            pid: "some-pid-game" + time,
            materialTypes: [{ specific: "Playstation 4" }],
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
      type={"ebog"}
      workId={"some-id-disabled" + time}
      selectedPids={["some-pid-disabled" + time]}
      storyNameOverride={"ebog disabled"}
    />
  );
}
ReservationButtonDisabled.story = {
  ...ReservationButtonStoryBuilder("Button disabled", {
    Query: {
      manifestations: () => {
        return [
          {
            pid: "some-pid-disabled" + time,
            access: [],
          },
        ];
      },
      work: () => {
        return {
          workId: "some-id-disabled" + time,
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "ebog" }],
          workTypes: ["LITERATURE"],
          manifestations: {
            all: [
              {
                pid: "some-pid-disabled" + time,
                access: [],
              },
            ],
          },
        };
      },
    },
  }),
};

export function OrderButtonNotLoggedIn() {
  const descriptionName = "Not logged in";
  const user = { isAuthenticated: false };
  const access = [
    {
      pid: "some-pid-1",
      id: "infomediaUrl",
      __typename: AccessEnum.INFOMEDIA_SERVICE,
    },
  ];

  return (
    <div>
      <StoryTitle>OrderButton - {descriptionName}</StoryTitle>
      <StoryDescription>
        The OrderButton based on the type: {descriptionName}
      </StoryDescription>
      <OrderButton
        user={user}
        access={access}
        onHandleGoToLogin={() => alert("DU SKAL LOGGE IND")}
      />
    </div>
  );
}

export function ReservationButtonPhysicalBookLoanNotPossible() {
  return (
    <ReservationButtonComponentBuilder
      type={["bog"]}
      selectedPids={["some-pid-bog-loan-not-possible" + time]}
    />
  );
}
ReservationButtonPhysicalBookLoanNotPossible.story = {
  ...ReservationButtonStoryBuilder("Book", {
    Query: {
      work: () => {
        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "bog" }],
          workTypes: ["LITERATURE"],
          manifestations: {
            all: [
              {
                pid: "some-pid-bog-loan-not-possible" + time,
              },
            ],
          },
        };
      },
      manifestations: () => {
        return [
          {
            pid: "some-pid-bog-loan-not-possible" + time,
            materialTypes: [{ specific: "bog" }],
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
      selectedPids={["some-pid-slow-response" + time]}
      type={"Slow response"}
    />
  );
}
ReservationButtonSlowResponse.story = {
  ...ReservationButtonStoryBuilder("Slow", {
    Query: {
      work: () => {
        const date = new Date();
        const time = date.getTime();

        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "bog" }],
          workTypes: ["LITERATURE"],
          manifestations: {
            all: [
              {
                pid: "some-pid-slow-response" + time,
              },
            ],
          },
        };
      },
      manifestations: async () => {
        // Simulate slow access response, wait 5000ms
        await new Promise((r) => {
          setTimeout(r, 5000);
        });

        return [{ access: {} }];
      },
    },
  }),
};
