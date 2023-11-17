import { StoryDescription, StoryTitle } from "@/storybook";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

import Modal from "@/components/_modal";
import Pages from "@/components/_modal/pages";
import LocalizationsLink from "@/components/work/overview/localizationslink/LocalizationsLink";
import isEmpty from "lodash/isEmpty";

const exportedObject = {
  title: "Localizations/Base",
};

export default exportedObject;

const {
  BRANCH_5,
  BRANCH_5_1,
  BRANCH_5_2,
  BRANCH_6,
  BRANCH_7,
  BRANCH_7_1,
  BRANCH_7_2,
  BRANCH_7_3,
  BRANCH_9,
  BRANCH_9_1,
  BRANCH_9_2,
  BRANCH_9_3,
  BRANCH_10,
  BRANCH_10_1,
  DEFAULT_STORY_PARAMETERS,
  ALL_WORKS,
  ALL_MANIFESTATIONS,
} = automock_utils();

const branches = [
  BRANCH_5,
  BRANCH_5_1,
  BRANCH_5_2,
  BRANCH_6,
  BRANCH_7,
  BRANCH_7_1,
  BRANCH_7_2,
  BRANCH_7_3,
  BRANCH_9,
  BRANCH_9_1,
  BRANCH_9_2,
  BRANCH_9_3,
  BRANCH_10,
  BRANCH_10_1,
];

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

export function LocalizationsBaseFlow() {
  return (
    <LocalizationsComponentBuilder
      title="Localizations"
      description="Localizations story including AgencyLocalizations, BranchLocalizations, and BranchDetails"
      workId={"some-work-id-8"}
      selectedPids={["some-pid-10"]}
    />
  );
}
LocalizationsBaseFlow.story = merge({}, DEFAULT_STORY_PARAMETERS, {
  parameters: {
    graphql: {
      resolvers: {
        Query: {
          branches: ({ variables }) => {
            const agencyId = variables?.agencyId;
            const branchId = !isEmpty(variables?.branchId)
              ? variables?.branchId
              : null;
            // Only on branchId, branchName, agencyId, agencyName
            const q = variables?.q;

            const res = branches
              ?.filter((b) => (agencyId ? b.agencyId === agencyId : true))
              ?.filter((b) => (branchId ? b.branchId === branchId : true))
              ?.filter((b) => {
                return q
                  ? [b.name, b.branchId, b.agencyId, b.agencyName].filter(
                      (field) => field.toLowerCase().includes(q.toLowerCase())
                    ).length > 0
                  : true;
              });

            return {
              count: res.length,
              result: res,
            };
          },
          manifestations: (args) => {
            return args?.variables?.pid?.map((pid) =>
              ALL_MANIFESTATIONS.find((m) => m.pid === pid)
            );
          },
          work: ({ variables }) => {
            return ALL_WORKS.find((w) => w.workId === variables?.workId);
          },
          localizationsWithHoldings: () => {
            return {
              count: 4,
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
                  agencyId: "765430",
                  holdingItem: {
                    localizationPid: "some-pid-10",
                    codes: "12312",
                    localIdentifier: "214123",
                  },
                },
                {
                  agencyId: "800010",
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
                {
                  agencyId: "898760",
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
