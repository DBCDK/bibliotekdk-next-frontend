import { StoryTitle, StoryDescription } from "@/storybook";

import Button from "@/components/base/button";
import { useModal } from "@/components/_modal";
import Modal from "@/components/_modal/Modal";
import Pages from "@/components/_modal/pages";

const exportedObject = {
  title: "modal/OpenAdgangsplatform",
};

export default exportedObject;

/**
 * Returns Modal
 *
 */
export function ShowModal() {
  const modal = useModal();
  return (
    <div style={{ height: "100vh" }}>
      <StoryTitle>Modal</StoryTitle>
      <StoryDescription>Full Modal component</StoryDescription>
      <Modal.Container>
        <Modal.Page
          id="openAdgangsplatform"
          component={Pages.OpenAdgangsplatform}
        />
      </Modal.Container>

      <Button
        type="secondary"
        size="small"
        onClick={() =>
          modal.push("openAdgangsplatform", {
            branchId: "790900",
            agencyId: "790900",
            agencyName: "Test Agency",
            name: "Test Branch",
          })
        }
      >
        {"Toggle open adgangsplatform"}
      </Button>
    </div>
  );
}
