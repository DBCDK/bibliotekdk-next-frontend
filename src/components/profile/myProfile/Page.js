import { useModal } from "@/components/_modal";
import Layout from "../profileLayout";
import styles from "./MyProfile.module.css";

import Top from "@/components/_modal/pages/base/top";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Link from "@/components/base/link";
import useUser from "@/components/hooks/useUser";
import Translate from "@/components/base/translate/Translate";
import Title from "@/components/base/title";
import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";

/**
 * Shows the previous orders made by the user from bibliotekdk.
 *
 * @returns {component}
 *
 */

export default function SettingsPage() {
  let modal = useModal();
  const { isAuthenticated, loanerInfo } = useUser();
  const { data: userData } = useData(
    isAuthenticated && userFragments.branchesForUser()
  );
  const userName = loanerInfo?.userParameters?.userName;
  const {agencies, municipalityAgencyId} = loanerInfo;
  console.log('SettingsPage.municipalityAgencyId',municipalityAgencyId)
  console.log('SettingsPage.agencies',agencies)
  const municipalityAgency = agencies?.map(agency=>agency?.result[0]).find(agency=>agency?.agencyId==municipalityAgencyId)
console.log('municipalityAgency',municipalityAgency)
  return (
    <Layout title={Translate({ context: "profile", label: "myProfile" })}>
      <div className={styles.modalContainer}>
        <div className={styles.userInfo}>
          <div className={styles.dataItem}>
            <Title className={styles.dataItemTitle} type="title6">{Translate({context:"general",label:"name"})}</Title>
            <Text type="text2">{userName}</Text>
          </div>
          <div className={styles.dataItem}>
          <Title className={styles.dataItemTitle}  type="title6">{Translate({context:"profile",label:"municipalityOfResidence"})}</Title>
           <Text>{municipalityAgency?.agencyName}</Text>
          </div>
          <div className={styles.dataItem}>
          <Title className={styles.dataItemTitle}  type="title6">{Translate({ context: "profile", label: "profileCreated" })}</Title>
            <Text>18. sep</Text>
          </div>
        </div>

        <Link
          onClick={() => {
            modal.push("deleteProfile");
          }}
          className={`${styles.deleteProfileButton} ${styles.deleteProfileButtonCustom}`}
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
    </Layout>
  );
}
