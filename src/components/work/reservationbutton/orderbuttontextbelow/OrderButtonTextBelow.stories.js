import { StoryDescription, StoryTitle } from "@/storybook";
import OrderButtonTextBelow from "@/components/work/reservationbutton/orderbuttontextbelow/OrderButtonTextBelow";
import { AccessEnum } from "@/lib/enums";

const exportedObject = {
  title: "work/ReservationButton/OrderButtonTextBelow",
};

export default exportedObject;

const date = new Date();
const time = date.getTime();

function ButtonTxtComponentBuilder({
  type = ["bog"],
  workId = "some-id-builder" + time,
  selectedPids = ["some-other-id-builder" + time],
  storyNameOverride = null,
}) {
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
      workId={"some-workId-bog" + time}
      selectedPids={["some-pid-bog" + time]}
    />
  );
}

BookButtonTxt.story = {
  ...ButtonTxtStoryBuilder("Book", {
    Query: {
      work: () => {
        return {
          workId: "some-workId-bog" + time,
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "bog" }],
          workTypes: ["LITERATURE"],
          manifestations: {
            all: [
              {
                pid: "some-pid-bog" + time,
              },
            ],
          },
        };
      },
      manifestations: () => {
        return [
          {
            pid: "some-pid-bog" + time,
            materialTypes: [{ specific: "bog" }],
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

export function EBookButtonTxt() {
  return (
    <ButtonTxtComponentBuilder
      type={"Ebog"}
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
          materialTypes: [{ specific: "Ebog" }],
          workTypes: ["LITERATURE"],
          manifestations: {
            all: [
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
            materialTypes: [{ specific: "Ebog" }],
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
      type={"Lydbog (cd-mp3)"}
      workId={"some-id-physical-audio-book" + time}
      selectedPids={["some-pid-physical-audio-book" + time]}
    />
  );
}
EAudioBookPhysicalButtonTxt.story = {
  ...ButtonTxtStoryBuilder("Lydbog (cd-mp3)", {
    Query: {
      work: () => {
        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "Lydbog (cd-mp3)" }],
          workTypes: ["LITERATURE"],
          manifestations: {
            all: [
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
            materialTypes: [{ specific: "Lydbog (cd-mp3)" }],
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
      type={"Lydbog (net)"}
      workId={"some-workId-elydbog" + time}
      selectedPids={["some-pid-elydbog" + time]}
    />
  );
}
EAudioBookDigitalButtonTxt.story = {
  ...ButtonTxtStoryBuilder("Lydbog (net)", {
    Query: {
      work: () => {
        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "Lydbog (net)" }],
          workTypes: ["LITERATURE"],
          manifestations: {
            all: [
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
            materialTypes: [{ specific: "Lydbog (net)" }],
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
      type={"Ebog"}
      workId={"some-workId-periodica" + time}
      selectedPids={["some-pid-periodica" + time]}
      storyNameOverride={"Periodica"}
    />
  );
}
PeriodicaButtonTxt.story = {
  ...ButtonTxtStoryBuilder("Periodica", {
    Query: {
      work: () => {
        return {
          titles: [{ main: "Hugo hejs" }],
          materialTypes: [{ specific: "Ebog" }],
          workTypes: ["PERIODICA"],
          manifestations: {
            all: [
              {
                pid: "some-pid-periodica" + time,
              },
            ],
          },
        };
      },
      manifestations: () => {
        return [
          {
            pid: "some-pid-periodica" + time,
            materialTypes: [{ specific: "Ebog" }],
            access: [],
            workTypes: ["PERIODICA"],
          },
        ];
      },
    },
  }),
};

export function SlowLoadingButtonTxt() {
  return (
    <ButtonTxtComponentBuilder
      type={"bog"}
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
            materialTypes: [{ specific: "Ebog" }],
            access: [{ __resolveType: "Ereol", url: "https://ereol.combo" }],
          },
        ];
      },
    },
  }),
};
