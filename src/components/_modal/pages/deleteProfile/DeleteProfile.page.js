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
import { useRouter } from "next/router";
import { signOut } from "@dbcdk/login-nextjs/client";
import Translate from "@/components/base/translate/Translate";

/**
 * This modal is used to change the users consent on storing orderhistory data for more than 30 days.
 * @returns {component}
 */
export function DeleteProfile({ modal }) {
  const userDataMutation = useMutate();
  const { isAuthenticated, loanerInfo } = useUser();
  const { data: userData, mutate } = useData(
    isAuthenticated && userFragments.extendedData()
  );
  const user = useUser();
  const router = useRouter();

  const createdAt = userData?.user?.createdAt;
  console.log("createdAt", createdAt);
  const userName = loanerInfo?.userParameters?.userName;

  console.log("loanerInfo", loanerInfo);
  useEffect(() => {
    if (modal.isVisible) {
      mutate();
    }
  }, [modal.isVisible]);

  const handleDeleteUser = () => {
    deleteUser({ userDataMutation });
    signOut(null, "/");
  };
  return (
    <div className={styles.modalContainer}>
      <Top title={"Slet profil"} back />
      <Text className={styles.deleteTextTitle} type="text1">
        {Translate({ context: "profile", label: "deleteProfileTitle" })}
      </Text>
      <Text className={styles.deleteText}>
        {Translate({ context: "profile", label: "deleteProfileText" })}
      </Text>
      <Button
        className={styles.deleteUserButton}
        size="large"
        type="primary"
        onClick={handleDeleteUser}
      >
        {Translate({ context: "profile", label: "deleteProfile" })}
      </Button>
    </div>
  );
}

export default DeleteProfile;
