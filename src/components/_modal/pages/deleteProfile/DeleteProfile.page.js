/**
 * @file DeleteProfile is a modal where the user can confirm profile deletion.
 */
import { useMutate } from "@/lib/api/api";
import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import useUser from "@/components/hooks/useUser";
import Top from "@/components/_modal/pages/base/top";
import styles from "./DeleteProfile.module.css";
import Text from "@/components/base/text";
import { useEffect } from "react";
import Button from "@/components/base/button";
import { deleteUser } from "@/lib/api/userData.mutations";
import { signOut } from "@dbcdk/login-nextjs/client";
import Translate from "@/components/base/translate/Translate";
import useAuthentication from "@/components/hooks/user/useAuthentication";

/**
 * This is a confirmation modal for user deletion.
 * @returns {component}
 */
export function DeleteProfile({ modal }) {
  const userDataMutation = useMutate();
  const { hasCulrUniqueId } = useAuthentication();
  const { mutate } = useData(hasCulrUniqueId && userFragments.extendedData());

  useEffect(() => {
    if (modal.isVisible) {
      mutate();
    }
  }, [modal.isVisible]);

  const handleDeleteUser = async () => {
    const redirectUrl = window?.location?.origin;

    await deleteUser({ userDataMutation });
    signOut(redirectUrl);
  };

  return (
    <div className={styles.modalContainer}>
      <Top title={"Slet profil"} back />
      <Text className={styles.deleteTextTitle} type="text1">
        {Translate({ context: "profile", label: "deleteProfileTitle" })}
      </Text>
      <Text className={styles.deleteText}>
        {Translate({
          context: "profile",
          label: "deleteProfileText",
          renderAsHtml: true,
        })}
      </Text>
      <Button size="large" type="primary" onClick={handleDeleteUser}>
        {Translate({ context: "profile", label: "deleteProfile" })}
      </Button>
    </div>
  );
}

export default DeleteProfile;
