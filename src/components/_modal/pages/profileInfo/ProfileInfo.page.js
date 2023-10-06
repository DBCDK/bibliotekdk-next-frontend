/**
 * @file ProfileInfo is a modal that shows user info. User can sign out and delete their profile from here.
 */
import { useMutate } from "@/lib/api/api";
import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import useUser from "@/components/hooks/useUser";
import Top from "@/components/_modal/pages/base/top";
import styles from "./ProfileInfo.module.css";
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
      <Top title={userName} />

      <div style={styles.userInfo}>
        <div className={styles.dataItem}>
          <Text type="text4">Bopælskommune:</Text>
          <Text>Københavns Kommune</Text>
        </div>
        <div className={styles.dataItem}>
          <Text type="text4">Favorit afhentningssted:</Text>
          <Text>Stadsbiblioteket, Lyngby</Text>
        </div>
        {/* <div className={styles.dataItem}>
          <Text type="text4">Mail:</Text>
          <Text>Alfred@hej.dk</Text>
        </div> */}
      </div>

      <div className={styles.buttonsContainer}>
        <Button className={styles.logoutButton} size="large" type="primary">
          Log ud
        </Button>
        <Link
          onClick={() => {
            modal.push("deleteProfile");
          }}
          className={styles.deleteProfileButton}
          border={{
            top: false,
            bottom: {
              keepVisible: true,
            },
          }}
        >
          Slet profil
        </Link>
      </div>
    </div>
  );
}

export default ProfileInfo;
