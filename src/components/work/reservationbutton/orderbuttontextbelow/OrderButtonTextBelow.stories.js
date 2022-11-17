import { StoryDescription, StoryTitle } from "@/storybook";
import OrderButtonTextBelow from "@/components/work/reservationbutton/orderbuttontextbelow/OrderButtonTextBelow";
import { AccessEnum } from "@/lib/enums";

const exportedObject = {
  title: "work/ReservationButton/OrderButtonTextBelow",
};

export default exportedObject;

function ButtonTxtComponentBuilder({
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
      <StoryTitle>ButtonTxt - {descriptionName}</StoryTitle>
      <StoryDescription>
        The button text based on the type: {descriptionName}
      </StoryDescription>
      <OrderButtonTextBelow
        workId={workId + time}
        selectedPids={selectedPids.map((pid) => pid + time)}
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
      type="Bog"
      workId={"some-id-book"}
      selectedPids={["some-other-id-book"]}
    />
  );
}

BookButtonTxt.story = {
  ...ButtonTxtStoryBuilder("Book", {
    Query: {
      manifestations: () => {
        return [
          {
            workTypes: ["LITERATURE"],
            materialTypes: [{ specific: "Bog" }],
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

export function EBookButtonTxt() {
  return (
    <ButtonTxtComponentBuilder
      type={"ebog"}
      workId={"some-id-e-book"}
      selectedPids={["some-other-id-e-book"]}
    />
  );
}
EBookButtonTxt.story = {
  ...ButtonTxtStoryBuilder("EBook", {
    Query: {
      manifestations: () => {
        return [
          {
            materialTypes: [{ specific: "Ebog" }],
            access: [
              {
                __resolveType: AccessEnum.EREOL,
                url: "ereol.combo/langurl",
                origin: "ereol.combo",
              },
            ],
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
      workId={"some-id-physical-audio-book"}
      selectedPids={["some-other-id-physical-audio-book"]}
    />
  );
}
EAudioBookPhysicalButtonTxt.story = {
  ...ButtonTxtStoryBuilder("Lydbog (cd-mp3)", {
    Query: {
      manifestations: () => {
        return [
          {
            materialTypes: [{ specific: "lydbog (cd-mp3)" }],
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

export function EAudioBookDigitalButtonTxt() {
  return (
    <ButtonTxtComponentBuilder
      type={"Lydbog (net)"}
      workId={"some-id-e-audio-book"}
      selectedPids={["some-other-id-e-audio-book"]}
    />
  );
}
EAudioBookDigitalButtonTxt.story = {
  ...ButtonTxtStoryBuilder("Lydbog (net)", {
    Query: {
      manifestations: () => {
        return [
          {
            materialTypes: [{ specific: "lydbog (net)" }],
            access: [
              {
                __resolveType: AccessEnum.ACCESS_URL,
                origin: "notambo.dekå",
                loginRequired: false,
              },
            ],
          },
        ];
      },
    },
  }),
};

export function PeriodicaButtonTxt() {
  return (
    <ButtonTxtComponentBuilder
      type={"bog"}
      workId={"some-id-periodica"}
      selectedPids={["some-other-id-periodica"]}
      storyNameOverride={"Periodica"}
    />
  );
}
PeriodicaButtonTxt.story = {
  ...ButtonTxtStoryBuilder("Periodica", {
    Query: {
      manifestations: () => {
        return [
          {
            workTypes: ["PERIODICA"],
            access: [],
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
            access: [{ __resolveType: "Ereol", url: "ereol.combo" }],
          },
        ];
      },
    },
  }),
};
