import { StoryDescription, StoryTitle } from "@/storybook";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

import Modal from "@/components/_modal";
import Pages from "@/components/_modal/pages";
import LocalizationsLink from "@/components/work/overview/localizationslink/LocalizationsLink";

const exportedObject = {
  title: "Localizations/testa",
};

export default exportedObject;

const {
  USER_5,
  BRANCH_5,
  BRANCH_6,
  BRANCH_7,
  DEFAULT_STORY_PARAMETERS,
  TODAY,
} = automock_utils();

function LocalizationsComponentBuilder({
  title,
  description,
  workId,
  selectedPids,
  singleManifestation = false,
}) {
  return (
    <>
      <StoryTitle>{title}</StoryTitle>
      <StoryDescription>
        {description}
        <br />
        <br />
        <span>workId: {workId}</span>
        <br />
        <span>selectedPids: {selectedPids.join(", ")}</span>
      </StoryDescription>
      <LocalizationsLink
        workId={workId}
        singleManifestation={singleManifestation}
        selectedPids={selectedPids}
      />
      <Modal.Container>
        <Modal.Page
          id="agencyLocalizations"
          component={Pages.AgencyLocalizations}
        />
        <Modal.Page
          id="branchLocalizations"
          component={Pages.BranchLocalizations}
        />
        <Modal.Page id="branchDetails" component={Pages.BranchDetails} />
        <Modal.Page id="order" component={Pages.Order} />
        <Modal.Page id="periodicaform" component={Pages.PeriodicaForm} />
        <Modal.Page id="pickup" component={Pages.Pickup} />
        <Modal.Page id="loanerform" component={Pages.Loanerform} />
        <Modal.Page id="receipt" component={Pages.Receipt} />
        <Modal.Page id="login" component={Pages.Login} />
      </Modal.Container>
    </>
  );
}

export function Localizations() {
  return (
    <LocalizationsComponentBuilder
      title="testa"
      description="testa1"
      workId={"some-work-id-8"}
      selectedPids={["some-pid-10"]}
    />
  );
}
Localizations.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        DetailedHoldings: {
          count: () => 2,
          agencyHoldings: () => {
            return [
              {
                agencyId: () => "789120",
                expectedDelivery: () => TODAY,
                localisationPid: () => "some-localisationPid",
                localIdentifier: () => "some-localIdentifier",
              },
            ];
          },
        },
        Query: {
          user: () => USER_5,
          branches: () => {
            return {
              result: [BRANCH_5, BRANCH_6, BRANCH_7],
            };
          },
          localizationsWithHoldings: () => {
            return {
              count: 2,
              agencies: [
                {
                  agencyId: "789120",
                  holdingItem: {
                    localizationPid: "some-pid-10",
                    codes: "12312",
                    localIdentifier: "214123",
                  },
                },
                {
                  agencyId: "891230",
                  holdingItem: {
                    localizationPid: "some-pid-10",
                    codes: "12312",
                    localIdentifier: "214123",
                  },
                },
              ],
            };
          },
        },
      },
    },
  },
});
