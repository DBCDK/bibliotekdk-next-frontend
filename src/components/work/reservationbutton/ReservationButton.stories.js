import { StoryDescription, StoryTitle } from "@/storybook";
import ReservationButtonWrapper, {
  ReservationButton,
} from "@/components/work/reservationbutton/ReservationButton";
import { AccessEnum } from "@/lib/enums";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";
import Modal from "@/components/_modal/Modal";
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

const ReservationButtonPhysicalBookStory = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});
ReservationButtonPhysicalBook.parameters =
  ReservationButtonPhysicalBookStory.parameters;
ReservationButtonPhysicalBook.args = ReservationButtonPhysicalBookStory.args;
ReservationButtonPhysicalBook.decorators =
  ReservationButtonPhysicalBookStory.decorators;
ReservationButtonPhysicalBook.storyName =
  ReservationButtonPhysicalBookStory.name ||
  ReservationButtonPhysicalBookStory.storyName;
export function ReservationButtonPhysicalBookNoILLButIsOwnedByAgency() {
  return (
    <ReservationButtonComponentBuilder
      type={["bog"]}
      workId={"some-work-id-1"}
      selectedPids={["some-pid-1"]}
    />
  );
}

const ReservationButtonPhysicalBookNoILLButIsOwnedByAgencyStory = merge(
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
ReservationButtonPhysicalBookNoILLButIsOwnedByAgency.parameters =
  ReservationButtonPhysicalBookNoILLButIsOwnedByAgencyStory.parameters;
ReservationButtonPhysicalBookNoILLButIsOwnedByAgency.args =
  ReservationButtonPhysicalBookNoILLButIsOwnedByAgencyStory.args;
ReservationButtonPhysicalBookNoILLButIsOwnedByAgency.decorators =
  ReservationButtonPhysicalBookNoILLButIsOwnedByAgencyStory.decorators;
ReservationButtonPhysicalBookNoILLButIsOwnedByAgency.storyName =
  ReservationButtonPhysicalBookNoILLButIsOwnedByAgencyStory.name ||
  ReservationButtonPhysicalBookNoILLButIsOwnedByAgencyStory.storyName;
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
const ReservationButtonEBookStory = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});
ReservationButtonEBook.parameters = ReservationButtonEBookStory.parameters;
ReservationButtonEBook.args = ReservationButtonEBookStory.args;
ReservationButtonEBook.decorators = ReservationButtonEBookStory.decorators;
ReservationButtonEBook.storyName =
  ReservationButtonEBookStory.name || ReservationButtonEBookStory.storyName;
export function ReservationButtonEAudioBook() {
  return (
    <ReservationButtonComponentBuilder
      type={["EAudioBook"]}
      selectedPids={["some-pid-lydbog-(net)" + time]}
    />
  );
}
const ReservationButtonEAudioBookStory = {
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
ReservationButtonEAudioBook.parameters =
  ReservationButtonEAudioBookStory.parameters;
ReservationButtonEAudioBook.args = ReservationButtonEAudioBookStory.args;
ReservationButtonEAudioBook.decorators =
  ReservationButtonEAudioBookStory.decorators;
ReservationButtonEAudioBook.storyName =
  ReservationButtonEAudioBookStory.name ||
  ReservationButtonEAudioBookStory.storyName;
export function ReservationButtonGame() {
  return (
    <ReservationButtonComponentBuilder
      selectedPids={["some-pid-game" + time]}
      type={["Playstation 4"]}
    />
  );
}
const ReservationButtonGameStory = {
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
ReservationButtonGame.parameters = ReservationButtonGameStory.parameters;
ReservationButtonGame.args = ReservationButtonGameStory.args;
ReservationButtonGame.decorators = ReservationButtonGameStory.decorators;
ReservationButtonGame.storyName =
  ReservationButtonGameStory.name || ReservationButtonGameStory.storyName;
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
const ReservationButtonDisabledStory = {
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
ReservationButtonDisabled.parameters =
  ReservationButtonDisabledStory.parameters;
ReservationButtonDisabled.args = ReservationButtonDisabledStory.args;
ReservationButtonDisabled.decorators =
  ReservationButtonDisabledStory.decorators;
ReservationButtonDisabled.storyName =
  ReservationButtonDisabledStory.name ||
  ReservationButtonDisabledStory.storyName;
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
const ReservationButtonPhysicalBookLoanNotPossibleStory = {
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
ReservationButtonPhysicalBookLoanNotPossible.parameters =
  ReservationButtonPhysicalBookLoanNotPossibleStory.parameters;
ReservationButtonPhysicalBookLoanNotPossible.args =
  ReservationButtonPhysicalBookLoanNotPossibleStory.args;
ReservationButtonPhysicalBookLoanNotPossible.decorators =
  ReservationButtonPhysicalBookLoanNotPossibleStory.decorators;
ReservationButtonPhysicalBookLoanNotPossible.storyName =
  ReservationButtonPhysicalBookLoanNotPossibleStory.name ||
  ReservationButtonPhysicalBookLoanNotPossibleStory.storyName;
export function ReservationButtonSlowResponse() {
  return (
    <ReservationButtonComponentBuilder
      selectedPids={["some-pid-slow-response" + time]}
      type={"Slow response"}
    />
  );
}
const ReservationButtonSlowResponseStory = {
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
ReservationButtonSlowResponse.parameters =
  ReservationButtonSlowResponseStory.parameters;
ReservationButtonSlowResponse.args = ReservationButtonSlowResponseStory.args;
ReservationButtonSlowResponse.decorators =
  ReservationButtonSlowResponseStory.decorators;
ReservationButtonSlowResponse.storyName =
  ReservationButtonSlowResponseStory.name ||
  ReservationButtonSlowResponseStory.storyName;
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

const ReservationButtonNotLoggedInFlowStory = merge(
  {},
  DEFAULT_STORY_PARAMETERS,
  {
    parameters: {
      session: {}, // makes isAuthenticated: false
      nextRouter: {
        showInfo: true,
        query: {},
      },
    },
  }
);
ReservationButtonNotLoggedInFlow.parameters =
  ReservationButtonNotLoggedInFlowStory.parameters;
ReservationButtonNotLoggedInFlow.args =
  ReservationButtonNotLoggedInFlowStory.args;
ReservationButtonNotLoggedInFlow.decorators =
  ReservationButtonNotLoggedInFlowStory.decorators;
ReservationButtonNotLoggedInFlow.storyName =
  ReservationButtonNotLoggedInFlowStory.name ||
  ReservationButtonNotLoggedInFlowStory.storyName;
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

const ReservationButtonLoginFlowStory = merge({}, DEFAULT_STORY_PARAMETERS, {
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
ReservationButtonLoginFlow.parameters =
  ReservationButtonLoginFlowStory.parameters;
ReservationButtonLoginFlow.args = ReservationButtonLoginFlowStory.args;
ReservationButtonLoginFlow.decorators =
  ReservationButtonLoginFlowStory.decorators;
ReservationButtonLoginFlow.storyName =
  ReservationButtonLoginFlowStory.name ||
  ReservationButtonLoginFlowStory.storyName;
