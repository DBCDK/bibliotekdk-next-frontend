import { StoryDescription, StoryTitle } from "@/storybook";
import OrderButtonTextBelow from "@/components/work/reservationbutton/orderbuttontextbelow/OrderButtonTextBelow";
import { AccessEnum } from "@/lib/enums";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

const exportedObject = {
  title: "work/ReservationButton/OrderButtonTextBelow",
};

export default exportedObject;

const date = new Date();
const time = date.getTime();

const { USER_3, BRANCH_3, DEFAULT_STORY_PARAMETERS, useMockLoanerInfo } =
  automock_utils();

function ButtonTxtComponentBuilder({
  type = ["bog"],
  workId = "some-id-builder" + time,
  selectedPids = ["some-other-id-builder" + time],
  storyNameOverride = null,
}) {
  useMockLoanerInfo({});
  const descriptionName = storyNameOverride ? storyNameOverride : type;
  return (
    <div>
      <StoryTitle>ButtonTxt - {descriptionName}</StoryTitle>
      <StoryDescription>
        The button text based on the type: {descriptionName}
      </StoryDescription>
      <OrderButtonTextBelow
        workId={workId}
        selectedPids={selectedPids}
        skeleton={false}
      />
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
  return (
    <ButtonTxtComponentBuilder
      type={["bog"]}
      workId={"some-work-id-1"}
      selectedPids={["some-pid-1"]}
    />
  );
}

BookButtonTxt.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {},
    },
  },
});

export function EBookButtonTxt() {
  return (
    <ButtonTxtComponentBuilder
      type={["e-bog"]}
      workId={"some-workId-ebog" + time}
      selectedPids={["some-pid-ebog" + time]}
    />
  );
}
EBookButtonTxt.story = {
  ...ButtonTxtStoryBuilder("EBook", {
    Query: {
      work: () => {
        return {
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
                pid: "some-pid-ebog" + time,
              },
            ],
          },
        };
      },
      manifestations: () => {
        return [
          {
            pid: "some-pid-ebog" + time,
            materialTypes: [
              {
                materialTypeSpecific: { display: "e-bog", code: "EBOOK" },
                materialTypeGeneral: { display: "e-bøger", code: "EBOOKS" },
              },
            ],
            accessTypes: [
              {
                display: "online",
              },
            ],
            access: [
              {
                __resolveType: AccessEnum.EREOL,
                url: "https://ereol.combo/langurl",
                origin: "https://ereol.combo",
              },
            ],
            workTypes: ["LITERATURE"],
          },
        ];
      },
    },
  }),
};

export function EAudioBookPhysicalButtonTxt() {
  return (
    <ButtonTxtComponentBuilder
      type={"lydbog (cd-mp3)"}
      workId={"some-id-physical-audio-book" + time}
      selectedPids={["some-pid-physical-audio-book" + time]}
    />
  );
}
EAudioBookPhysicalButtonTxt.story = {
  ...ButtonTxtStoryBuilder("lydbog (cd-mp3)", {
    Query: {
      work: () => {
        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [
            {
              materialTypeSpecific: {
                display: "lydbog (cd-mp3)",
                code: "AUDIO_BOOK_CD_MP3",
              },
              materialTypeGeneral: { display: "lydbøger", code: "AUDIO_BOOKS" },
            },
          ],
          workTypes: ["LITERATURE"],
          manifestations: {
            mostRelevant: [
              {
                pid: "some-pid-physical-audio-book" + time,
              },
            ],
          },
        };
      },
      manifestations: () => {
        return [
          {
            pid: "some-pid-physical-audio-book" + time,
            materialTypes: [
              {
                materialTypeSpecific: {
                  display: "lydbog (cd-mp3)",
                  code: "AUDIO_BOOK_CD_MP3",
                },
                materialTypeGeneral: {
                  display: "lydbøger",
                  code: "AUDIO_BOOKS",
                },
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

export function EAudioBookDigitalButtonTxt() {
  return (
    <ButtonTxtComponentBuilder
      type={["lydbog (net)"]}
      workId={"some-workId-elydbog" + time}
      selectedPids={["some-pid-elydbog" + time]}
    />
  );
}
EAudioBookDigitalButtonTxt.story = {
  ...ButtonTxtStoryBuilder("lydbog (net)", {
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
                pid: "some-pid-elydbog" + time,
              },
            ],
          },
        };
      },
      manifestations: () => {
        return [
          {
            pid: "some-pid-elydbog" + time,
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
            accessTypes: [
              {
                display: "online",
              },
            ],
            access: [
              {
                __resolveType: AccessEnum.EREOL,
                url: "https://nota.combo/langurl",
                origin: "https://nota.combo",
              },
            ],
            workTypes: ["LITERATURE"],
          },
        ];
      },
    },
  }),
};

export function PeriodicaButtonTxt() {
  return (
    <ButtonTxtComponentBuilder
      type={["e-bog"]}
      workId={"some-work-id-3"}
      selectedPids={["some-pid-5"]}
      storyNameOverride={"Periodica"}
    />
  );
}
PeriodicaButtonTxt.story = merge({}, DEFAULT_STORY_PARAMETERS, {
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

export function SlowLoadingButtonTxt() {
  return (
    <ButtonTxtComponentBuilder
      type={["bog"]}
      workId={"some-id-slow-loading"}
      selectedPids={["some-other-id-slow-loading"]}
      storyNameOverride={"Slow Loading"}
    />
  );
}
SlowLoadingButtonTxt.story = {
  ...ButtonTxtStoryBuilder("Slow Loading", {
    Query: {
      manifestations: async () => {
        // Simulate slow access response, wait 5000ms
        await new Promise((r) => {
          setTimeout(r, 5000);
        });

        return [
          {
            materialTypes: [
              {
                materialTypeSpecific: { display: "e-bog", code: "EBOOK" },
                materialTypeGeneral: { display: "e-bøger", code: "EBOOKS" },
              },
            ],
            access: [{ __resolveType: "Ereol", url: "https://ereol.combo" }],
          },
        ];
      },
    },
  }),
};
