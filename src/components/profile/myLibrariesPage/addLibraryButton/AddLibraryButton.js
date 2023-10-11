import Translate from "@/components/base/translate/Translate";
import { useModal } from "@/components/_modal/Modal";
import IconButton from "@/components/base/iconButton/IconButton";
import useUser from "@/components/hooks/useUser";

import useVerification from "@/components/hooks/useVerification";
import { useAccessToken } from "@/components/hooks/useUser";

import styles from "./AddLibraryButton.module.css";

export default function AddLibraryButton({ className = "" }) {
  const modal = useModal();
  const { isCPRValidated } = useUser();

  const accessToken = useAccessToken();
  const verification = useVerification();

  function handleOnClick() {
    if (isCPRValidated) {
      // create a verification process - store current folk-library token
      verification.create({
        accessToken,
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
      className={`${className} ${styles.button}`}
      textType="text2"
      onClick={() => handleOnClick()}
    >
      {Translate({ context: "profile", label: "addLibrary" })}
    </IconButton>
  );
}
