import { StoryDescription, StoryTitle } from "@/storybook";
import automock_utils from "@/lib/automock_utils.fixture";
import merge from "lodash/merge";

import Modal from "@/components/_modal";
import Pages from "@/components/_modal/pages";
import { LocalizationsLink } from "@/components/work/overview/localizationslink/LocalizationsLink";

const exportedObject = {
  title: "work/CoverCarousel",
};

export default exportedObject;

const {
  BORROWER_STATUS_FALSE,
  BORROWER_STATUS_TRUE,
  USER_1,
  USER_2,
  USER_3,
  USER_4,
  BRANCH_1,
  BRANCH_2,
  BRANCH_3,
  BRANCH_4,
  DEFAULT_STORY_PARAMETERS,
  useMockLoanerInfo,
} = automock_utils();

function LocalizationsComponentBuilder({
  title,
  description,
  workId,
  selectedPids,
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
      <LocalizationsLink workId={workId} selectedPids={selectedPids} />
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
        <Modal.Page id="receipt" component={Pages.Receipt} />
        <Modal.Page id="order" component={Pages.Order} />
        <Modal.Page id="login" component={Pages.Login} />
      </Modal.Container>
    </>
  );
}
