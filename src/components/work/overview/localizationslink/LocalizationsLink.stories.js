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

  const context = {
    //title: Translate({ context: "modal", label: "title-order" }),
    title: "fisk",
    workId: "work-of:870970-basis:01362984",
    //materialType: selectedMaterial.materialType,
    materialType: "hest",
  };

  const openLocalizationsModal = () => {
    modal.push("localizations", context);
  };

  return (
    <div>
      <StoryTitle>Localizations - user logged in - with modal</StoryTitle>
      <StoryDescription>
        link shows total number of localizations for selected material
      </StoryDescription>

      <LocalizationsLink count="1" opener={openLocalizationsModal} user={{}} />
      <Modal.Container>
        <Modal.Page id="localizations" component={Localizations} />
      </Modal.Container>
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
