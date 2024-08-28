import { StoryDescription, StoryTitle } from "@/storybook";
import ReservationButtonWrapper, {
  ReservationButton,
} from "@/components/work/reservationbutton/ReservationButton";
import { AccessEnum } from "@/lib/enums";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";
import Modal from "@/components/_modal";
import Pages from "@/components/_modal/pages";
import { useModal } from "@/components/_modal";

const exportedObject = {
  title: "work/ReservationButton",
};

export default exportedObject;

const date = new Date();
const time = date.getTime();

const { DEFAULT_STORY_PARAMETERS, useMockLoanerInfo } = automock_utils();

function ReservationButtonComponentBuilder({
  type = ["bog"],
  workId = "some-id-builder" + time,
  selectedPids = ["some-other-id-builder" + time],
  storyNameOverride = null,
}) {
  const descriptionName = storyNameOverride ? storyNameOverride : type;
  return (
    <div>
      <StoryTitle>ReservationButton - {descriptionName}</StoryTitle>
      <StoryDescription>
        The ReservationButton based on the type: {descriptionName}
      </StoryDescription>
      <ReservationButtonWrapper
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
        // url: "https://fbi-api-staging.k8s.dbc.dk/bibdk21/graphql",
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
      type={["bog"]}
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

export function ReservationButtonPhysicalBookNoILLButIsOwnedByAgency() {
  return (
    <ReservationButtonComponentBuilder
      type={["bog"]}
      workId={"some-work-id-1"}
      selectedPids={["some-pid-1"]}
    />
  );
}

ReservationButtonPhysicalBookNoILLButIsOwnedByAgency.story = merge(
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

export function ReservationButtonEBook() {
  useMockLoanerInfo({});
  return (
    <ReservationButtonComponentBuilder
      type={["e-bog"]}
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
      type={["EAudioBook"]}
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
          materialTypes: [
            {
              materialTypeSpecific: {
                display: "lydbog (online)",
                code: "AUDIO_BOOK_ONLINE",
              },
              materialTypeGeneral: { display: "lydbøger", code: "AUDIO_BOOKS" },
            },
          ],
          workTypes: ["LITERATURE"],
          manifestations: {
            mostRelevant: [
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
            materialTypes: [
              {
                materialTypeSpecific: {
                  display: "lydbog (online)",
                  code: "AUDIO_BOOK_ONLINE",
                },
                materialTypeGeneral: {
                  display: "lydbøger",
                  code: "AUDIO_BOOKS",
                },
              },
            ],
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
      type={["Playstation 4"]}
    />
  );
}
ReservationButtonGame.story = {
  ...ReservationButtonStoryBuilder("Playstation 4", {
    Query: {
      work: () => {
        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [
            {
              materialTypeSpecific: {
                display: "Playstation 4",
                code: "PLAYSTATION_4",
              },
              materialTypeGeneral: {
                display: "computerspil",
                code: "COMPUTER_GAMES",
              },
            },
          ],
          workTypes: ["GAME"],
          manifestations: {
            mostRelevant: [
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
            materialTypes: [
              {
                materialTypeSpecific: {
                  display: "Playstation 4",
                  code: "PLAYSTATION_4",
                },
                materialTypeGeneral: {
                  display: "computerspil",
                  code: "COMPUTER_GAMES",
                },
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
      type={["e-bog"]}
      workId={"some-id-disabled" + time}
      selectedPids={["some-pid-disabled" + time]}
      storyNameOverride={"e-bog disabled"}
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
            unit: {
              manifestations: [
                {
                  pid: "some-pid-disabled" + time,
                  access: [],
                },
              ],
            },
          },
        ];
      },
      work: () => {
        return {
          workId: "some-id-disabled" + time,
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [
            {
              materialTypeSpecific: { display: "e-bog", code: "EBOOK" },
              materialTypeGeneral: { display: "e-bøger", code: "EBOOKS" },
            },
          ],
          workTypes: ["LITERATURE"],
          manifestations: {
            mostRelevant: [
              {
                pid: "some-pid-disabled" + time,
                access: [],
                unit: {
                  manifestations: [
                    {
                      pid: "some-pid-disabled" + time,
                      access: [],
                    },
                  ],
                },
              },
            ],
          },
        };
      },
    },
  }),
};

export function ReservationButtonNotLoggedIn() {
  const descriptionName = "Not logged in";
  const modal = useModal();
  const access = [
    {
      pid: "some-pid-1",
      id: "infomediaUrl",
      __typename: AccessEnum.INFOMEDIA_SERVICE,
    },
  ];

  return (
    <div>
      <StoryTitle>ReservationButton - {descriptionName}</StoryTitle>
      <StoryDescription>
        The ReservationButton based on the type: {descriptionName}
      </StoryDescription>
      <ReservationButton
        user={user}
        singleManifestation={true}
        overrideButtonText="Gå til bog"
        access={access}
        onHandleGoToLogin={() => alert("DU SKAL LOGGE IND")}
        isAuthenticated={false}
        modal={modal}
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
          materialTypes: [
            {
              materialTypeSpecific: { display: "bog", code: "BOOK" },
              materialTypeGeneral: { display: "bøger", code: "BOOKS" },
            },
          ],
          workTypes: ["LITERATURE"],
          manifestations: {
            mostRelevant: [
              {
                pid: "some-pid-bog-loan-not-possible" + time,
              },
            ],
            unit: {
              manifestations: [
                {
                  pid: "some-pid-disabled" + time,
                  access: [],
                },
              ],
            },
          },
        };
      },
      manifestations: () => {
        return [
          {
            pid: "some-pid-bog-loan-not-possible" + time,
            materialTypes: [
              {
                materialTypeSpecific: { display: "bog", code: "BOOK" },
                materialTypeGeneral: { display: "bøger", code: "BOOKS" },
              },
            ],
            access: [],
            workTypes: ["LITERATURE"],
            unit: {
              manifestations: [
                {
                  pid: "some-pid-bog-loan-not-possible" + time,
                  access: [],
                },
              ],
            },
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
          materialTypes: [
            {
              materialTypeSpecific: { display: "bog", code: "BOOK" },
              materialTypeGeneral: { display: "bøger", code: "BOOKS" },
            },
          ],
          workTypes: ["LITERATURE"],
          manifestations: {
            mostRelevant: [
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

        return [
          {
            access: {},
            unit: {
              manifestations: [
                {
                  access: [],
                },
              ],
            },
          },
        ];
      },
    },
  }),
};

const descriptionName = "Not logged in flow";
const user = {
  authUser: {},
  isAuthenticated: false,
  isGuestUser: false,
  isLoading: false,
  loanerInfo: {
    debt: [],
    loans: [],
    orders: [],
    agency: {},
    userParameters: {},
  },
  updateLoanerInfo: () => alert("updateLoanerInfo"),
  updateUserStatusInfo: () => alert("updateUserStatusInfo"),
};

export function ReservationButtonNotLoggedInFlow() {
  return (
    <div>
      <StoryTitle>ReservationButton - {descriptionName}</StoryTitle>
      <StoryDescription>
        The ReservationButton based on the type: {descriptionName}
      </StoryDescription>
      <Modal.Container>
        <Modal.Page id="order" component={Pages.Order} />
        <Modal.Page id="periodicaform" component={Pages.PeriodicaForm} />
        <Modal.Page id="pickup" component={Pages.Pickup} />
        <Modal.Page id="loanerform" component={Pages.Loanerform} />
        <Modal.Page id="receipt" component={Pages.Receipt} />
        <Modal.Page id="login" component={Pages.Login} />
      </Modal.Container>
      <ReservationButtonComponentBuilder
        selectedPids={["some-pid-1"]}
        workId={"some-work-id-1"}
      />
    </div>
  );
}

ReservationButtonNotLoggedInFlow.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    session: {}, // makes isAuthenticated: false
    nextRouter: {
      showInfo: true,
      query: {},
    },
  },
});

export function ReservationButtonLoginFlow() {
  return (
    <div>
      <StoryTitle>ReservationButton - {descriptionName}</StoryTitle>
      <StoryDescription>
        The ReservationButton based on the type: {descriptionName}
      </StoryDescription>

      <Modal.Container>
        <Modal.Page id="order" component={Pages.Order} />
        <Modal.Page id="periodicaform" component={Pages.PeriodicaForm} />
        <Modal.Page id="pickup" component={Pages.Pickup} />
        <Modal.Page id="loanerform" component={Pages.Loanerform} />
        <Modal.Page id="receipt" component={Pages.Receipt} />
        <Modal.Page id="login" component={Pages.Login} />
      </Modal.Container>
      <ReservationButtonComponentBuilder
        selectedPids={["some-pid-1"]}
        workId={"some-work-id-1"}
      />
    </div>
  );
}

ReservationButtonLoginFlow.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
    nextRouter: {
      showInfo: true,
      query: {},
    },
  },
});
