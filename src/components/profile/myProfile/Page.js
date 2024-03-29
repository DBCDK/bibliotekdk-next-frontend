import { useModal } from "@/components/_modal";
import ProfileLayout from "../profileLayout";
import styles from "./MyProfile.module.css";

import Text from "@/components/base/text";

import Translate from "@/components/base/translate/Translate";
import Title from "@/components/base/title";
import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import IconButton from "@/components/base/iconButton/IconButton";
import { parseDate } from "@/lib/utils";
import useAuthentication from "@/components/hooks/user/useAuthentication";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

/**
 * Shows user info.
 *
 * @returns {component}
 *
 */

export default function MyProfilePage() {
  let modal = useModal();
  const { loanerInfo } = useLoanerInfo();
  const { hasCulrUniqueId } = useAuthentication();
  const { data: userData } = useData(
    hasCulrUniqueId && userFragments.extendedData()
  );
  const userName = loanerInfo?.userParameters?.userName;
  const { agencies, municipalityAgencyId } = loanerInfo;
  const municipalityAgency = agencies
    ?.map((agency) => agency?.result[0])
    .find((agency) => agency?.agencyId == municipalityAgencyId);

  const createdAt = userData?.user?.createdAt;
  const { day, monthName, year } = parseDate(createdAt);
  const formatedDate = `d. ${day}. ${monthName} ${year}`;
  return (
    <ProfileLayout
      title={Translate({ context: "profile", label: "myProfile" })}
    >
      <div className={styles.myProfileContainer}>
        <div className={styles.infoContainer}>
          <div className={styles.userInfo}>
            <div className={styles.dataItem}>
              <Title className={styles.dataItemTitle} type="title6">
                {Translate({ context: "general", label: "name" })}
              </Title>
              <Text type="text2">{userName}</Text>
            </div>
            {municipalityAgency?.agencyName && (
              <div className={styles.dataItem}>
                <Title className={styles.dataItemTitle} type="title6">
                  {Translate({
                    context: "profile",
                    label: "municipalityOfResidence",
                  })}
                </Title>
                <Text>{municipalityAgency?.agencyName}</Text>
              </div>
            )}
          </div>
          <div className={styles.infoBox}>
            <Title type="title6">
              {Translate({ context: "profile", label: "infoBoxTitle" })}
            </Title>
            <Text className={styles.infoBoxText}>
              {Translate({
                context: "profile",
                label: "infoBoxText",
                vars: [formatedDate],
              })}
            </Text>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <IconButton
            icon="chevron"
            keepUnderline
            onClick={() => {
              modal.push("deleteProfile");
            }}
            className={` ${styles.deleteProfileButton}`}
            border={{
              top: false,
              bottom: {
                keepVisible: true,
              },
            }}
          >
            <Text type="text2">
              {Translate({ context: "profile", label: "deleteProfile" })}
            </Text>
          </IconButton>
        </div>
      </div>
    </ProfileLayout>
  );
}
