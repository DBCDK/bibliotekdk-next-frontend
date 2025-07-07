/**
 * @file DeleteProfile is a modal where the user can confirm profile deletion.
 */
import { useMutate } from "@/lib/api/api";
import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import Top from "@/components/_modal/pages/base/top";
import styles from "./DeleteProfile.module.css";
import Text from "@/components/base/text";
import { useEffect } from "react";
import Button from "@/components/base/button";
import { deleteUser } from "@/lib/api/userData.mutations";
import Translate from "@/components/base/translate/Translate";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useSignOut from "@/components/hooks/useSignOut";

export function DeleteProfile({ modal }) {
  const userDataMutation = useMutate();
  const { hasCulrUniqueId } = useAuthentication();
  const { mutate } = useData(hasCulrUniqueId && userFragments.extendedData());

  const { signOut } = useSignOut();

  useEffect(() => {
    if (modal.isVisible) {
      mutate();
    }
  }, [modal.isVisible]);

  const handleDeleteUser = async () => {
    await deleteUser({ userDataMutation });
    signOut();
  };

  return (
    <div className={styles.modalContainer}>
      <Top title="Slet profil" back />
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
