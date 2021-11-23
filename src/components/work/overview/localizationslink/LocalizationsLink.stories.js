import { StoryTitle, StoryDescription, StorySpace } from "@/storybook";
import { LocalizationsLink } from "@/components/work/overview/localizationslink/LocalizationsLink";
import Translate from "@/components/base/translate";

import Pages from "@/components/_modal/pages";
import Modal, { useModal } from "@/components/_modal";
import { Localizations } from "@/components/_modal/pages/localizations/Localizations";
import { useEffect } from "react";

export default {
  title: "work/Localizations",
};

export function LocalizationlinkWithLocalizationsUserLoggedIn() {
  const modal = useModal();

  /*const openLocalizationsModal = () => {
    modal.push("localizations", { ...context, ...selectedLocalizations });
  };*/

  const alertopener = () => {
    alert("LOCALIZATIONS");
  };

  console.log(selectedLocalizations, "SELECTED");

  return (
    <div>
      <StoryTitle>Localizations - user not logged in </StoryTitle>
      <StoryDescription>
        link shows total number of localizations for selected material
      </StoryDescription>

      <LocalizationsLink
        localizations={selectedLocalizations.localizations || {}}
        opener={alertopener}
        user={{}}
      />
      {/*<Modal.Container>
        <Modal.Page id="localizations" component={Localizations} />
      </Modal.Container>
      */}
    </div>
  );
}

export function LocalizationlinkWithLocalizations() {
  const openLocalizationsModal = () => {
    modal.push("localizations", {
      title: Translate({ context: "modal", label: "title-order" }),
      workId,
    });
  };

  const openalert = () => {
    alert("LOCALIZATIONS");
  };

  return (
    <div>
      <StoryTitle>Localizations - not logged in</StoryTitle>
      <StoryDescription>
        link shows total number of localizations for selected material
      </StoryDescription>
      <LocalizationsLink count="1" opener={openalert} />
    </div>
  );
}

export function LocalizationlinkWithNoLocalizations() {
  const openLocalizationsModal = () => {
    Modal.push("localizations", {
      title: Translate({ context: "modal", label: "title-order" }),
      workId,
    });
  };

  const openalert = () => {
    alert("LOCALIZATIONS");
  };
  return (
    <div>
      <StoryTitle>Localizations - no localizations</StoryTitle>
      <StoryDescription>no link - just a text message</StoryDescription>
      <LocalizationsLink count="0" opener={openalert} />
    </div>
  );
}
