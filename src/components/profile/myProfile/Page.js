import { useModal } from "@/components/_modal";
import ProfileLayout from "../profileLayout";
import styles from "./MyProfile.module.css";

import Text from "@/components/base/text";

import useUser from "@/components/hooks/useUser";
import Translate from "@/components/base/translate/Translate";
import Title from "@/components/base/title";
import { useData } from "@/lib/api/api";
import * as userFragments from "@/lib/api/user.fragments";
import IconButton from "@/components/base/iconButton/IconButton";
import { parseDate } from "@/lib/utils";

/**
 * Shows user info.
 *
 * @returns {component}
 *
 */

export default function MyProfilePage() {
  let modal = useModal();
  const { isAuthenticated, loanerInfo } = useUser();
  const { data: userData } = useData(
    isAuthenticated && userFragments.extendedData()
  );
  const userName = loanerInfo?.userParameters?.userName;
  const { agencies, municipalityAgencyId } = loanerInfo;
  const municipalityAgency = agencies
    ?.map((agency) => agency?.result[0])
    .find((agency) => agency?.agencyId == municipalityAgencyId);

  const createdAt = userData?.user?.createdAt;
  const { day, monthName, year } = parseDate(createdAt);
  return (
    <ProfileLayout
      title={Translate({ context: "profile", label: "myProfile" })}
    >
      <div className={styles.myProfileContainer}>
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
          <div className={styles.dataItem}>
            <Title className={styles.dataItemTitle} type="title6">
              {Translate({ context: "profile", label: "profileCreated" })}
            </Title>
            <Text>{`${day}. ${monthName} ${year}`}</Text>
          </div>
        </div>
        <div className={styles.infoBox}>
          <Title type="title6">
            {Translate({ context: "profile", label: "infoBoxTitle" })}
          </Title>
          <Text className={styles.infoBoxText}>
            {Translate({ context: "profile", label: "infoBoxText" })}
          </Text>
        </div>

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
    </ProfileLayout>
  );
}
