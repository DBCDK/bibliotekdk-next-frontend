/**
 * @file This file contains the FFU associate button
 */

import Translate from "@/components/base/translate/Translate";
import { useModal } from "@/components/_modal/Modal";
import IconButton from "@/components/base/iconButton/IconButton";

import useVerification from "@/components/hooks/useVerification";
import useAuthentication from "@/components/hooks/user/useAuthentication";

export default function AddLibraryButton({ className = "" }) {
  const modal = useModal();
  const { isCPRValidated } = useAuthentication();

  const verification = useVerification();

  function handleOnClick() {
    if (isCPRValidated) {
      // create a verification process - store current folk-library token
      verification.create({
        type: "FOLK",
        origin: "addLibraryButton",
      });

      modal.push("addLibrary", {
        title: Translate({ context: "addLibrary", label: "title" }),
      });
    }

    // if user has no CPR attached to any account - show error
    else {
      const errorTitle = Translate({
        context: "errorMessage",
        label: "addLibraryNotVerifiedTitle",
      });
      const errorText = Translate({
        context: "errorMessage",
        label: "addLibraryNotVerifiedText",
      });

      modal.push("statusMessage", {
        title: errorTitle,
        text: errorText,
      });
    }
  }

  return (
    <IconButton
      icon="chevron"
      className={`${className}`}
      textType="text2"
      onClick={() => handleOnClick()}
    >
      {Translate({ context: "profile", label: "addLibrary" })}
    </IconButton>
  );
}
