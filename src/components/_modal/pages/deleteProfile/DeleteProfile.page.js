/**
 * @file ProfileInfo is a modal that shows user info. User can sign out and delete their profile from here.
 */
import { useMutate } from "@/lib/api/api";
import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import useUser from "@/components/hooks/useUser";
import Top from "@/components/_modal/pages/base/top";
import styles from "./DeleteProfile.module.css";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import { useEffect } from "react";
import Button from "@/components/base/button";
import Link from "@/components/base/link";

/**
 * This modal is used to change the users consent on storing orderhistory data for more than 30 days.
 * @returns {component}
 */
export function ProfileInfo({ modal }) {
  const userDataMutation = useMutate();
  const { isAuthenticated, loanerInfo } = useUser();
  const { data: userData, mutate } = useData(
    isAuthenticated && userFragments.extendedData()
  );
  const user = useUser();

  const persistUserData = !!userData?.user?.persistUserData;

  const userName = loanerInfo?.userParameters?.userName;

  console.log("loanerInfo", loanerInfo);
  useEffect(() => {
    if (modal.isVisible) {
      mutate();
    }
  }, [modal.isVisible]);

  return (
    <div className={styles.modalContainer}>
      <Top title={"Slet profil"} back />
      <Text className={styles.deleteTextTitle} type="tex1">
        Vil du slette din brugerprofil på bibliotek.dk?{" "}
      </Text>
      <Text className={styles.deleteText}>
        Dette vil slette din huskeliste, bestillingshistorik, søgehistorik og
        evt. tilføjede uddannelsesbiblioteker.
        <br /> <br />
        Bemærk: Du slettes ikke fra de biblioteker, du er oprettet ved. Kontakt
        dit lokale bibliotek for dette.
      </Text>
      <Button className={styles.deleteUserButton} size="large" type="primary">
        Slet profil
      </Button>
    </div>
  );
}

export default ProfileInfo;
